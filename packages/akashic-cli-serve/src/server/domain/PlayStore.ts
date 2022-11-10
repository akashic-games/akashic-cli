import { PromisifiedAMFlowProxy } from "@akashic/amflow-util/lib/PromisifiedAMFlowProxy";
import type { AMFlowClient, Play, PlayManager } from "@akashic/headless-driver";
import { Trigger } from "@akashic/trigger";
import { TimeKeeper } from "../../common/TimeKeeper";
import type { PlayAudioState } from "../../common/types/PlayAudioState";
import type { Player } from "../../common/types/Player";
import type { PlayInfo } from "../../common/types/PlayInfo";
import type { PlayStatus } from "../../common/types/PlayStatus";
import type {
	PlayCreateTestbedEvent,
	PlayStatusChangedTestbedEvent,
	PlayDurationStateChangeTestbedEvent,
	PlayerJoinTestbedEvent,
	PlayerLeaveTestbedEvent,
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	ClientInstanceAppearTestbedEvent,
	ClientInstanceDisappearTestbedEvent,
	RunnerDescription,
	ClientInstanceDescription,
	PlayAudioStateChangeTestbedEvent
} from "../../common/types/TestbedEvent";
import type { ServerContentLocator } from "../common/ServerContentLocator";
import type { DumpedPlaylog } from "../common/types/DumpedPlaylog";
import { activePermission, passivePermission, debugPermission } from "./AMFlowPermisson";

export interface PlayStoreParameterObject {
	playManager: PlayManager;
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

	private playManager: PlayManager;

	// TODO playId ごとの情報を集約して PlayEntity を作る
	private playEntities: { [playId: string]: PlayEntity };

	constructor(params: PlayStoreParameterObject) {
		this.onPlayCreate = new Trigger<PlayCreateTestbedEvent>();
		this.onPlayStatusChange = new Trigger<PlayStatusChangedTestbedEvent>();
		this.onPlayDurationStateChange = new Trigger<PlayDurationStateChangeTestbedEvent>();
		this.onPlayAudioStateChange = new Trigger<PlayAudioStateChangeTestbedEvent>();
		this.onPlayerJoin = new Trigger<PlayerJoinTestbedEvent>();
		this.onPlayerLeave = new Trigger<PlayerLeaveTestbedEvent>();
		this.onClientInstanceAppear = new Trigger<ClientInstanceAppearTestbedEvent>();
		this.onClientInstanceDisappear = new Trigger<ClientInstanceDisappearTestbedEvent>();
		this.playManager = params.playManager;
		this.playEntities = {};
	}

	/**
	 * Playを生成するが、返すものはPlayId
	 */
	async createPlay(
		loc: ServerContentLocator,
		audioState: PlayAudioState = { muteType: "none" },
		playlog?: DumpedPlaylog
	): Promise<string> {
		const playId = await this.playManager.createPlay({
			contentUrl: loc.asAbsoluteUrl()
		}, playlog);
		const status = "preparing";
		this.playEntities[playId] = {
			contentLocator: loc,
			status,
			timeKeeper: new TimeKeeper(),
			clientInstances: [],
			runners: [],
			joinedPlayers: [],
			audioState,
			debugAMFlow: null
		};

		if (playlog) {
			// クライアント側にdurationとしてplaylogに記録されている終了時間を渡す必要があるので、そのための設定を行う
			const timeKeeper = this.playEntities[playId].timeKeeper;
			const finishedTime = this.calculataFinishedTime(playlog);
			timeKeeper.setTime(finishedTime);
		}
		this.onPlayCreate.fire({playId, status, contentLocatorData: loc.asContentLocatorData(), audioState});
		this.setPlayStatus(playId, "running");
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

	// コンテンツの終了時間をplaylogから算出する
	private calculataFinishedTime(playlog: DumpedPlaylog): number {
		const fps = playlog.startPoints[0].data.fps;
		const replayStartTime = playlog.startPoints[0].timestamp;
		const replayLastAge = playlog.tickList[1];
		const ticksWithEvents = playlog.tickList[2] ?? [];
		let replayLastTime = null;
		loop: for (let i = ticksWithEvents.length - 1; i >= 0; --i) {
			const tick = ticksWithEvents[i];
			const pevs = tick[1] || [];
			for (let j = 0; j < pevs.length; ++j) {
				if (pevs[j][0] === 2) { // TimestampEvent
					const timestamp = pevs[j][3]; // Timestamp
					// Timestamp の時刻がゲームの開始時刻より小さかった場合は相対時刻とみなす
					replayLastTime =
						(timestamp < replayStartTime ? timestamp + replayStartTime : timestamp) + (replayLastAge - tick[0]) * 1000 / fps;
					break loop;
				}
			}
		}
		return (replayLastTime == null) ? (replayLastAge * 1000 / fps) : (replayLastTime - replayStartTime);
	}
}
