import {Player} from "./Player";
import {PlayStatus} from "./PlayStatus";
import {PlayTree} from "./PlayTree";

export interface PlayCreateTestbedEvent {
	playId: string;
	contentUrl: string;
	clientContentUrl: string | null;
}

export interface PlayStatusChangedTestbedEvent {
	playId: string;
	playStatus: PlayStatus;
}

export interface PlayDurationStateChangeTestbedEvent {
	playId: string;
	isPaused: boolean;
	duration?: number;
}

export interface PlayerJoinTestbedEvent {
	playId: string;
	player: Player;
}

export interface PlayerLeaveTestbedEvent {
	playId: string;
	playerId: string;
}

export interface RunnerDescription {
	playId: string;
	runnerId: string;
	isActive: boolean;
	passedArgument: string;
}

export interface RunnerCreateTestbedEvent extends RunnerDescription {
}

export interface RunnerRemoveTestbedEvent {
	playId: string;
	runnerId: string;
}

export interface RunnerPauseTestbedEvent {
	playId: string;
	runnerId: string;
}

export interface RunnerResumeTestbedEvent {
	playId: string;
	runnerId: string;
}

export interface ClientInstanceDescription {
	id: number;
	playId: string;
	playerId: string;
	name: string;
	isActive: boolean;
	envInfo: any;  // TODO 中身を固めてanyをやめる
	passedArgument: string;
}

export interface ClientInstanceAppearTestbedEvent extends ClientInstanceDescription {
}

export interface ClientInstanceDisappearTestbedEvent extends ClientInstanceDescription {
}

export interface PlayBroadcastTestbedEvent {
	playId: string;
	message: any;
}

export type PlayTreeTestbedEvent = PlayTree[];
