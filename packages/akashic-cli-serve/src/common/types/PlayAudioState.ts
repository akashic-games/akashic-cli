export type MuteType = "mute" | "solo" | "none";

export interface PlayAudioState {
	muteType: MuteType;
	soloPlayerId: string | null;
}

export type PlayAudioStateSummary = "anyone-muted" | "anyone-unmuted" | "only-me-unmuted" | "only-someone-unmuted";
