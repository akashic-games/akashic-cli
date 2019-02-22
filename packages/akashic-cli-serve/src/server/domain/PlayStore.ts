import { AMFlowClient, Play, PlayManager } from "@akashic/headless-driver";
import { Trigger } from "@akashic/trigger";
import { Player } from "../../common/types/Player";
import {
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
	ClientInstanceDescription
} from "../../common/types/TestbedEvent";
import { PlayDurationState } from "../../common/types/PlayDurationState";
import { TimeKeeper } from "../../common/TimeKeeper";
import { activePermission, passivePermission } from "./AMFlowPermisson";

export interface PlayStoreParameterObject {
	playManager: PlayManager;
}

export class PlayStore {
	onPlayCreate: Trigger<PlayCreateTestbedEvent>;
	onPlayStatusChange: Trigger<PlayStatusChangedTestbedEvent>;
	onPlayDurationStateChange: Trigger<PlayDurationStateChangeTestbedEvent>;
	onPlayerJoin: Trigger<PlayerJoinTestbedEvent>;
	onPlayerLeave: Trigger<PlayerLeaveTestbedEvent>;
	onClientInstanceAppear: Trigger<ClientInstanceAppearTestbedEvent>;
	onClientInstanceDisappear: Trigger<ClientInstanceDisappearTestbedEvent>;

	private playManager: PlayManager;

	// TODO playId ごとの情報を集約して PlayEntity を作る
	private clientInstances: { [playId: string]: ClientInstanceDescription[] };
	private runners: { [playId: string]: RunnerDescription[] };
	private joinedPlayers: { [playId: string]: Player[] };
	private clientContentUrls: { [playId: string]: string };
	private timeKeepers: { [playId: string]: TimeKeeper };

	constructor(params: PlayStoreParameterObject) {
		this.onPlayCreate = new Trigger<PlayCreateTestbedEvent>();
		this.onPlayStatusChange = new Trigger<PlayStatusChangedTestbedEvent>();
		this.onPlayDurationStateChange = new Trigger<PlayDurationStateChangeTestbedEvent>();
		this.onPlayerJoin = new Trigger<PlayerJoinTestbedEvent>();
		this.onPlayerLeave = new Trigger<PlayerLeaveTestbedEvent>();
		this.onClientInstanceAppear = new Trigger<ClientInstanceAppearTestbedEvent>();
		this.onClientInstanceDisappear = new Trigger<ClientInstanceDisappearTestbedEvent>();
		this.playManager = params.playManager;
		this.clientInstances = {};
		this.runners = {};
		this.joinedPlayers = {};
		this.clientContentUrls = {};
		this.timeKeepers = {};
	}

	/**
	 * Playを生成するが、返すものはPlayId
	 */
	async createPlay(contentUrl: string, clientContentUrl?: string): Promise<string> {
		const playId = await this.playManager.createPlay({
			contentUrl
		});
		this.clientContentUrls[playId] = clientContentUrl;
		this.timeKeepers[playId] = new TimeKeeper();
		this.onPlayCreate.fire({playId, contentUrl, clientContentUrl: clientContentUrl || null});
		this.onPlayStatusChange.fire({playId, playStatus: "running"});
		return playId;
	}

	getPlay(playId: string): Play {
		return this.playManager.getPlay(playId);
	}

	getPlays(): Play[] {
		return this.playManager.getPlays();
	}

	async stopPlay(playId: string): Promise<void> {
		await this.playManager.stopPlay(playId);
		this.onPlayStatusChange.fire({playId, playStatus: "suspending"});
	}

	createPlayToken(playId: string, isActive: boolean): string {
		return this.playManager.createPlayToken(playId, isActive ? activePermission : passivePermission);
	}

	createAMFlow(playId: string): AMFlowClient {
		return this.playManager.createAMFlow(playId);
	}

	registerClientInstance(playId: string, desc: ClientInstanceDescription): void {
		if (this.clientInstances[playId] === undefined) {
			this.clientInstances[playId] = [];
		}
		this.clientInstances[playId].push(desc);
		this.onClientInstanceAppear.fire(desc);
	}

	unregisterClientInstance(playId: string, desc: ClientInstanceDescription): void {
		if (this.clientInstances[playId]) {
			this.clientInstances[playId] = this.clientInstances[playId].filter(i => i.id !== desc.id);
			this.onClientInstanceDisappear.fire(desc);
		}
	}

	registerRunner(param: RunnerCreateTestbedEvent): void {
		const playId = param.playId;
		if (this.runners[playId] === undefined) {
			this.runners[playId] = [];
		}
		this.runners[playId].push(param);
	}

	unregisterRunner(param: RunnerRemoveTestbedEvent): void {
		const playId = param.playId;
		if (this.runners[playId]) {
			this.runners[playId] = this.runners[playId].filter(i => i.runnerId !== param.runnerId);
		}
	}

	join(playId: string, player: Player): void {
		if (this.joinedPlayers[playId] === undefined) {
			this.joinedPlayers[playId] = [];
		}
		this.joinedPlayers[playId].push(player);
		this.onPlayerJoin.fire({playId, player});
	}

	leave(playId: string, playerId: string): void {
		if (this.joinedPlayers[playId]) {
			this.joinedPlayers[playId] = this.joinedPlayers[playId].filter(player => player.id !== playerId);
		}
		this.onPlayerLeave.fire({playId, playerId});
	}

	pausePlayDuration(playId: string): void {
		this.timeKeepers[playId].pause();
		this.onPlayDurationStateChange.fire({playId, isPaused: true});
	}

	resumePlayDuration(playId: string): void {
		const timeKeeper = this.timeKeepers[playId];
		timeKeeper.start();
		this.onPlayDurationStateChange.fire({playId, isPaused: false, duration: timeKeeper.now() });
	}

	getJoinedPlayers(playId: string): Player[] {
		return this.joinedPlayers[playId] || [];
	}

	getClientContentUrl(playId: string): string | null {
		return (this.clientContentUrls[playId] != null) ? this.clientContentUrls[playId] : null;
	}

	getRunners(playId: string): RunnerDescription[] {
		return (this.runners[playId] != null) ? this.runners[playId] : [];
	}

	getClientInstances(playId: string): ClientInstanceDescription[] {
		return (this.clientInstances[playId] != null) ? this.clientInstances[playId] : [];
	}

	getPlayDurationState(playId: string): PlayDurationState {
		const timeKeeper = this.timeKeepers[playId];
		return { duration: timeKeeper.now(), isPaused: timeKeeper.isPausing() };
	}
}
