import { PromisifiedAMFlowProxy } from "@akashic/amflow-util/lib/PromisifiedAMFlowProxy";
import { calculateFinishedTime } from "@akashic/amflow-util/lib/calculateFinishedTime";
import type { AMFlowClient, Play, PlayManager } from "@akashic/headless-driver";
import * as pl from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import { TimeKeeper } from "../../common/TimeKeeper";
import type { PlayAudioState } from "../../common/types/PlayAudioState";
import type { PlayInfo } from "../../common/types/PlayInfo";
import type { PlayStatus } from "../../common/types/PlayStatus";
import type { Player } from "../../common/types/Player";
import { TelemetryConflict } from "../../common/types/TelemetryConflict";
import type { TelemetryMessage } from "../../common/types/TelemetryMessage";
import type {
	ClientInstanceAppearTestbedEvent,
	ClientInstanceDescription,
	ClientInstanceDisappearTestbedEvent,
	PlayAudioStateChangeTestbedEvent,
	PlayCreateTestbedEvent,
	PlayDurationStateChangeTestbedEvent,
	PlayStatusChangedTestbedEvent,
	PlayerJoinTestbedEvent,
	PlayerLeaveTestbedEvent,
	RunnerCreateTestbedEvent,
	RunnerDescription,
	RunnerRemoveTestbedEvent
} from "../../common/types/TestbedEvent";
import type { ServerContentLocator } from "../common/ServerContentLocator";
import type { DumpedPlaylog } from "../common/types/DumpedPlaylog";
import { activePermission, debugPermission, passivePermission } from "./AMFlowPermisson";

export interface PlayStoreParameterObject {
	playManager: PlayManager;
}

export interface CreatePlayParameterObject {
	/**
	 * 実行するコンテンツ。
	 */
	contentLocator: ServerContentLocator;

	/**
	 * 流し込むプレイログ。
	 * 指定した場合、このプレイに active instance を生成してはならない。
	 */
	playlog?: DumpedPlaylog;

	/**
	 * 初期 join プレイヤー。
	 */
	initialJoinPlayer?: Player;

	/**
	 * 直前のプレイから join 済みプレイヤー情報を引き継ぐか。
	 */
	inheritsJoinedFromLatest?: boolean;

	/**
	 * 直前のプレイから PlayAudioState を引き継ぐか。
	 */
	inheritsAudioFromLatest?: boolean;
}

/**
 * プレイ関連情報。特に headless-driver の Play では賄えない情報を補うデータ。
 */
// TODO headless-driver の Play の利用をやめるか、隠蔽してこれと統合する
export interface PlayEntity {
	/**
	 * プレイのステータス。
	 * headless-driver の Play にも同名のデータがあるが、
	 * serve ではプッシュ通知のために変更されるタイミングを完全に把握する必要があり、ここに自前で持つ。
	 */
	status: PlayStatus;

	contentLocator: ServerContentLocator;
	timeKeeper: TimeKeeper;
	clientInstances: ClientInstanceDescription[];
	runners: RunnerDescription[];
	joinedPlayers: Player[];
	audioState: PlayAudioState;
	debugAMFlow: AMFlowClient | null;
	telemetries: TelemetryMessage[];
	uncheckedTelemetries: { playerId: string, message: TelemetryMessage }[]
}

export class PlayStore {
	onPlayCreate: Trigger<PlayCreateTestbedEvent>;
	onPlayStatusChange: Trigger<PlayStatusChangedTestbedEvent>;
	onPlayDurationStateChange: Trigger<PlayDurationStateChangeTestbedEvent>;
	onPlayAudioStateChange: Trigger<PlayAudioStateChangeTestbedEvent>;
	onPlayerJoin: Trigger<PlayerJoinTestbedEvent>;
	onPlayerLeave: Trigger<PlayerLeaveTestbedEvent>;
	onClientInstanceAppear: Trigger<ClientInstanceAppearTestbedEvent>;
	onClientInstanceDisappear: Trigger<ClientInstanceDisappearTestbedEvent>;
	onConflictTelemetry: Trigger<TelemetryConflict>;

	private playManager: PlayManager;

	// TODO playId ごとの情報を集約して PlayEntity を作る
	private playEntities: { [playId: string]: PlayEntity };

	constructor(params: PlayStoreParameterObject) {
		this.onPlayCreate = new Trigger();
		this.onPlayStatusChange = new Trigger();
		this.onPlayDurationStateChange = new Trigger();
		this.onPlayAudioStateChange = new Trigger();
		this.onPlayerJoin = new Trigger();
		this.onPlayerLeave = new Trigger();
		this.onClientInstanceAppear = new Trigger();
		this.onClientInstanceDisappear = new Trigger();
		this.onConflictTelemetry = new Trigger();
		this.playManager = params.playManager;
		this.playEntities = {};
	}

	/**
	 * Playを生成するが、返すものはPlayId
	 */
	async createPlay(params: CreatePlayParameterObject): Promise<string> {
		const { contentLocator: loc, playlog, initialJoinPlayer, inheritsJoinedFromLatest, inheritsAudioFromLatest } = params;
		const latestPlay = this.getLatestPlayInfo();
		const audioState: PlayAudioState = (latestPlay && inheritsAudioFromLatest) ? { ...latestPlay.audioState } : { muteType: "none" };
		const joinedPlayers = (latestPlay && inheritsJoinedFromLatest) ? latestPlay.joinedPlayers.concat() : [];
		if (initialJoinPlayer)
			joinedPlayers.push(initialJoinPlayer);

		const playId = await this.playManager.createPlay({ contentUrl: loc.asAbsoluteUrl() }, playlog, { preservesUnhandledEvents: true });
		const status = "preparing";
		this.playEntities[playId] = {
			contentLocator: loc,
			status,
			timeKeeper: new TimeKeeper(),
			clientInstances: [],
			runners: [],
			joinedPlayers,
			audioState,
			debugAMFlow: null,
			telemetries: [],
			uncheckedTelemetries: []
		};

		if (playlog) {
			// クライアント側にdurationとしてplaylogに記録されている終了時間を渡す必要があるので、そのための設定を行う
			const timeKeeper = this.playEntities[playId].timeKeeper;
			const finishedTime = calculateFinishedTime(
				playlog.tickList,
				playlog.startPoints[0].data.fps,
				playlog.startPoints[0].timestamp
			);
			timeKeeper.setTime(finishedTime);
		}

		this.onPlayCreate.fire({playId, status, contentLocatorData: loc.asContentLocatorData(), joinedPlayers, audioState });
		this.setPlayStatus(playId, "running");

		// TODO: Join/Leave の特殊な sendEvent() をこのクラスに集約する (現状は SocketIOAMFlowManager で Join/Leave の送信をハンドリングしている)
		if (joinedPlayers.length > 0) {
			const amflow = (await this.getDebugAMFlow(playId))!;
			joinedPlayers.forEach(player => {
				amflow.sendEvent([pl.EventCode.Join, 3, player.id, player.name]);
			});
		}
		return playId;
	}

	getPlay(playId: string): Play | null {
		return this.playManager.getPlay(playId);
	}

	getPlays(): Play[] {
		return this.playManager.getAllPlays();
	}

	getLatestPlay(): Play | null {
		const plays = this.getPlays();
		return (plays.length > 0) ? plays[plays.length - 1] : null;
	}

	// プレイ関連情報を取得する。headless-driver の Play を取得する getPlay() との混同に注意。
	// TODO getPlay() の方を隠蔽する
	getPlayInfo(playId: string): PlayInfo | null {
		const play = this.getPlay(playId);
		const playEntity = this.playEntities[playId];
		if (!playEntity || !play)
			return null;
		return {
			playId,
			status: playEntity.status,
			createdAt: play.createdAt,
			lastSuspendedAt: play.lastSuspendedAt,
			contentLocatorData: playEntity.contentLocator.asContentLocatorData(),
			joinedPlayers: playEntity.joinedPlayers,
			runners: playEntity.runners,
			clientInstances: playEntity.clientInstances,
			durationState: {
				duration: playEntity.timeKeeper.now(),
				isPaused: playEntity.timeKeeper.isPausing()
			},
			audioState: playEntity.audioState
		};
	}

	getPlaysInfo(): PlayInfo[] {
		return this.getPlays().map(p => this.getPlayInfo(p.playId)!);
	}

	getLatestPlayInfo(): PlayInfo | null {
		const play = this.getLatestPlay();
		return play ? this.getPlayInfo(play.playId) : null;
	}

	getPlayIdsFromContentId(contentId: string): string[] {
		return Object.keys(this.playEntities).filter(key => contentId === this.playEntities[key].contentLocator.contentId);
	}

	async stopPlay(playId: string): Promise<void> {
		await this.playManager.deletePlay(playId);
		this.setPlayStatus(playId, "suspending");
	}

	createPlayToken(playId: string, isActive: boolean): string {
		return this.playManager.createPlayToken(playId, isActive ? activePermission : passivePermission);
	}

	createAMFlow(playId: string): AMFlowClient {
		return this.playManager.createAMFlow(playId);
	}

	/**
	 * 指定されたプレイに干渉するためのデバッグ用 AMFlow インスタンスを取得する。
	 * この AMFlow は open() され、全権限で authenticate() された状態で返される。
	 */
	async getDebugAMFlow(playId: string): Promise<AMFlowClient | null> {
		const e = this.playEntities[playId];
		if (!e)
			return null;
		if (!e.debugAMFlow) {
			const amflow = this.playManager.createAMFlow(playId);
			const token = this.playManager.createPlayToken(playId, debugPermission);
			e.debugAMFlow = amflow;
			const pamflow = new PromisifiedAMFlowProxy(amflow);
			await pamflow.open(playId);
			await pamflow.authenticate(token);
		}
		return e.debugAMFlow;
	}

	registerClientInstance(playId: string, desc: ClientInstanceDescription): void {
		this.playEntities[playId].clientInstances.push(desc);
		this.onClientInstanceAppear.fire(desc);
	}

	unregisterClientInstance(playId: string, desc: ClientInstanceDescription): void {
		this.playEntities[playId].clientInstances = this.playEntities[playId].clientInstances.filter(i => i.id !== desc.id);
		this.onClientInstanceDisappear.fire(desc);
	}

	registerRunner(param: RunnerCreateTestbedEvent): void {
		const playId = param.playId;
		this.playEntities[playId].runners.push(param);
	}

	unregisterRunner(param: RunnerRemoveTestbedEvent): void {
		const playId = param.playId;
		this.playEntities[playId].runners = this.playEntities[playId].runners.filter(i => i.runnerId !== param.runnerId);
	}

	join(playId: string, player: Player): void {
		this.playEntities[playId].joinedPlayers.push(player);
		this.onPlayerJoin.fire({playId, player});
	}

	leave(playId: string, playerId: string): void {
		this.playEntities[playId].joinedPlayers = this.playEntities[playId].joinedPlayers.filter(player => player.id !== playerId);
		this.onPlayerLeave.fire({playId, playerId});
	}

	setPlayStatus(playId: string, playStatus: PlayStatus): void {
		this.playEntities[playId].status = playStatus;
		this.onPlayStatusChange.fire({playId, playStatus});
	}

	pausePlayDuration(playId: string): void {
		this.playEntities[playId].timeKeeper.pause();
		this.onPlayDurationStateChange.fire({playId, isPaused: true});
	}

	resumePlayDuration(playId: string): void {
		const timeKeeper = this.playEntities[playId].timeKeeper;
		timeKeeper.start();
		this.onPlayDurationStateChange.fire({playId, isPaused: false, duration: timeKeeper.now()});
	}

	stepPlayDuration(playId: string): void {
		const timeKeeper = this.playEntities[playId].timeKeeper;
		this.onPlayDurationStateChange.fire({playId, isPaused: false, duration: timeKeeper.now() + 1000 / 60});
	}

	setPlayAudioState(playId: string, audioState: PlayAudioState): void {
		this.playEntities[playId].audioState = audioState;
		this.onPlayAudioStateChange.fire({playId, audioState});
	}

	recordTelemetry(playId: string, msg: TelemetryMessage): void {
		const playEntity = this.playEntities[playId];
		const { telemetries, uncheckedTelemetries } = this.playEntities[playId];
		telemetries[msg.age] = msg;

		if (uncheckedTelemetries.length > 0) {
			playEntity.uncheckedTelemetries = uncheckedTelemetries.filter(unchecked => {
				if (unchecked.message.age !== msg.age) return true; // age が違うので無視して残す
				const diff = compareTelemetry(unchecked.message, msg);
				if (diff !== "none") {
					console.log("CONFLICT TELEMETRY", unchecked.message, msg);
					this.onConflictTelemetry.fire({ playerId: unchecked.playerId, age: msg.age, reason: diff });
				}
				return false;
			});
		}
	}

	checkTelemetry(playId: string, playerId: string, msg: TelemetryMessage): void {
		const { telemetries, uncheckedTelemetries } = this.playEntities[playId];

		// 正解より先に受信してしまった場合
		if (!(msg.age in telemetries)) {
			uncheckedTelemetries.push({ playerId, message: msg });
			return;
		}

		// 記録が既にある場合: 一致することを検証
		const recorded = telemetries[msg.age];
		const diff = compareTelemetry(msg, recorded);
		if (diff !== "none") {
			console.log("CONFLICT TELEMETRY", msg, recorded);
			this.onConflictTelemetry.fire({ playerId, age: msg.age, reason: diff });
		}
	}
}

type TelemetryDifference = "none" | "idx" | "random";

function compareTelemetry(a: TelemetryMessage, b: TelemetryMessage): TelemetryDifference {
	if (a.age !== b.age) throw new Error("Logic Error: telemetry age mismatch");
	if (a.idx !== b.idx) return "idx";

	if (
		a.actions?.length !== b.actions?.length ||
		(a.actions && a.actions.some((action, i) => action !== b.actions![i]))
	) {
		return "random";
	}

	return "none";
}
