import { Trigger } from "@akashic/trigger";
import type {
	PlayCreateTestbedEvent,
	PlayStatusChangedTestbedEvent,
	PlayDurationStateChangeTestbedEvent,
	PlayAudioStateChangeTestbedEvent,
	PlayerJoinTestbedEvent,
	PlayerLeaveTestbedEvent,
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent,
	ClientInstanceAppearTestbedEvent,
	ClientInstanceDisappearTestbedEvent,
	PlayBroadcastTestbedEvent,
	PutStartPointEvent
} from "../../common/types/TestbedEvent";
import { socketInstance } from "./socketInstance";

export const onPlayCreate = new Trigger<PlayCreateTestbedEvent>();
export const onPlayStatusChange = new Trigger<PlayStatusChangedTestbedEvent>();
export const onPlayDurationStateChange = new Trigger<PlayDurationStateChangeTestbedEvent>();
export const onPlayAudioStateChange = new Trigger<PlayAudioStateChangeTestbedEvent>();
export const onPlayerJoin = new Trigger<PlayerJoinTestbedEvent>();
export const onPlayerLeave = new Trigger<PlayerLeaveTestbedEvent>();
export const onRunnerCreate = new Trigger<RunnerCreateTestbedEvent>();
export const onRunnerRemove = new Trigger<RunnerRemoveTestbedEvent>();
export const onRunnerPause = new Trigger<RunnerPauseTestbedEvent>();
export const onRunnerResume = new Trigger<RunnerResumeTestbedEvent>();
export const onClientInstanceAppear = new Trigger<ClientInstanceAppearTestbedEvent>();
export const onClientInstanceDisappear = new Trigger<ClientInstanceDisappearTestbedEvent>();
export const onBroadcast = new Trigger<any>();
export const onDisconnect = new Trigger<void>();
export const onPutStartPoint = new Trigger<PutStartPointEvent>();

const socket = socketInstance;
socket.on("playCreate", (arg: PlayCreateTestbedEvent) => onPlayCreate.fire(arg));
socket.on("playStatusChange", (arg: PlayStatusChangedTestbedEvent) => onPlayStatusChange.fire(arg));
socket.on("playDurationStateChange", (arg: PlayDurationStateChangeTestbedEvent) => onPlayDurationStateChange.fire(arg));
socket.on("playAudioStateChange", (arg: PlayAudioStateChangeTestbedEvent) => onPlayAudioStateChange.fire(arg));
socket.on("playerJoin", (arg: PlayerJoinTestbedEvent) => onPlayerJoin.fire(arg));
socket.on("playerLeave", (arg: PlayerLeaveTestbedEvent) => onPlayerLeave.fire(arg));
socket.on("runnerCreate", (arg: RunnerCreateTestbedEvent) => onRunnerCreate.fire(arg));
socket.on("runnerRemove", (arg: RunnerRemoveTestbedEvent) => onRunnerRemove.fire(arg));
socket.on("runnerPause", (arg: RunnerPauseTestbedEvent) => onRunnerPause.fire(arg));
socket.on("runnerResume", (arg: RunnerResumeTestbedEvent) => onRunnerResume.fire(arg));
socket.on("clientInstanceAppear", (arg: ClientInstanceAppearTestbedEvent) => onClientInstanceAppear.fire(arg));
socket.on("clientInstanceDisappear", (arg: ClientInstanceDisappearTestbedEvent) => onClientInstanceDisappear.fire(arg));
socket.on("playBroadcast", (arg: PlayBroadcastTestbedEvent) => onBroadcast.fire(arg));
socket.on("disconnect", () => onDisconnect.fire());
socket.on("putStartPoint", (arg: PutStartPointEvent) => onPutStartPoint.fire(arg));
