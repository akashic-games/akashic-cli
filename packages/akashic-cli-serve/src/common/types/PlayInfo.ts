import { ContentLocatorData } from "./ContentLocatorData";
import { PlayAudioState } from "./PlayAudioState";
import { PlayDurationState } from "./PlayDurationState";
import { Player } from "./Player";
import { PlayStatus } from "./PlayStatus";
import { ClientInstanceDescription, RunnerDescription } from "./TestbedEvent";

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
