import type { ContentLocatorData } from "./ContentLocatorData";
import type { PlayAudioState } from "./PlayAudioState";
import type { PlayDurationState } from "./PlayDurationState";
import type { Player } from "./Player";
import type { PlayStatus } from "./PlayStatus";
import type { ClientInstanceDescription, RunnerDescription } from "./TestbedEvent";

export interface PlayInfo {
	playId: string;
	status: PlayStatus;
	createdAt: number;
	lastSuspendedAt: number;
	contentLocatorData: ContentLocatorData;
	joinedPlayers: Player[];
	runners: RunnerDescription[];
	clientInstances: ClientInstanceDescription[];
	durationState: PlayDurationState;
	audioState: PlayAudioState;
}
