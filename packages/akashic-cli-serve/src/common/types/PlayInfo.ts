import type { ContentLocatorData } from "./ContentLocatorData.js";
import type { PlayAudioState } from "./PlayAudioState.js";
import type { PlayDurationState } from "./PlayDurationState.js";
import type { Player } from "./Player.js";
import type { PlayStatus } from "./PlayStatus.js";
import type { ClientInstanceDescription, RunnerDescription } from "./TestbedEvent.js";

export interface PlayInfo {
	playId: string;
	status: PlayStatus;
	createdAt: number;
	lastSuspendedAt: number | null;
	contentLocatorData: ContentLocatorData;
	joinedPlayers: Player[];
	runners: RunnerDescription[];
	clientInstances: ClientInstanceDescription[];
	durationState: PlayDurationState;
	audioState: PlayAudioState;
}
