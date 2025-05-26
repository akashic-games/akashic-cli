import type * as amf from "@akashic/amflow";
import type { Packet } from "socket.io-parser";
import type {ContentLocatorData} from "./ContentLocatorData.js";
import type {PlayAudioState} from "./PlayAudioState.js";
import type {Player} from "./Player.js";
import type {PlayStatus} from "./PlayStatus.js";
import type {StartPointHeader} from "./StartPointHeader.js";

export interface PlayCreateTestbedEvent {
	playId: string;
	status: PlayStatus;
	contentLocatorData: ContentLocatorData;
	joinedPlayers: Player[];
	audioState: PlayAudioState;
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

export interface RunnerPutStartPointTestbedEvent {
	playId: string;
	startPoint: amf.StartPoint;
}

export interface NamagameCommentPluginStartStopTestbedEvent {
	playId: string;
	started: boolean;
}

export interface ClientInstanceDescription {
	id: number;
	playId: string;
	playerId: string;
	name: string;
	isActive: boolean;
	envInfo: any;  // TODO 中身を固めてanyをやめる
}

export interface ClientInstanceAppearTestbedEvent extends ClientInstanceDescription {
}

export interface ClientInstanceDisappearTestbedEvent extends ClientInstanceDescription {
}

export interface PlayBroadcastTestbedEvent {
	playId: string;
	message: any;
}

export interface PutStartPointEvent {
	playId: string;
	startPointHeader: StartPointHeader;
}

export interface PlayAudioStateChangeTestbedEvent {
	playId: string;
	audioState: PlayAudioState;
}

export interface MessageEncodeTestbedEvent {
	packet: Packet;
	encoded: Uint8Array;
}
