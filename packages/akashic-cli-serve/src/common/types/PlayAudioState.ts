export type MuteType = "all" | "solo" | "none";

export interface PlayAudioStateMuteTypeAll {
	muteType: "all";
}

export interface PlayAudioStateMuteTypeSolo {
	muteType: "solo";
	soloPlayerId: string;
}

export interface PlayAudioStateMuteTypeNone {
	muteType: "none";
}

export type PlayAudioState =
	PlayAudioStateMuteTypeAll |
	PlayAudioStateMuteTypeSolo |
	PlayAudioStateMuteTypeNone;


/**
 * PlayAudioState の要約。
 * (UI など localInstance を意識しないレイヤーのためにある)
 */
export type PlayAudioStateSummary =
	/**
	 * 全プレイヤーがミュートされている。(muteType: "all")
	 */
	"all-player-muted" |
	/**
	 * 全プレイヤーがミュートされていない。(muteType: "none")
	 */
	"all-player-unmuted" |
	/**
	 * 自分だけがミュートされていない。
	 * (muteType: "solo" かつ soloPlayerId が localInstance.player?.id と一致)
	 */
	"only-this-player-unmuted" |
	/**
	 * 自分以外の誰かだけがミュートされていない。
	 * (muteType: "solo" かつ soloPlayerId が localInstance.player?.id と不一致)
	 */
	"only-other-player-unmuted";
