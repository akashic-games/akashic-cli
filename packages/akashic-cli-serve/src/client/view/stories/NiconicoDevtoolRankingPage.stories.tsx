import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import * as React from "react";
import { NiconicoDevtoolRankingPage } from "../molecule/NiconicoDevtoolRankingPage";

export default {
	title: "m-NiconicoDevtoolRankingPage"
};

const store = observable({
	isAutoSendEvent: true,
	usePreferredTimeLimit: true,
	stopsGameOnTimeout: true,
	totalTimeLimitInputValue: 75,
	emulatingShinichibaMode: "ranking",
	totalTimeLimit: 65,
	playDuration: 0,
	preferredTotalTimeLimit: 55,
	score: 700,
	playThreshold: 100,
	clearThreshold: 500,
	onAutoSendEventsChanged: action("events:auto-send-events-changed"),
	onModeSelectChanged: action("events:mode-select-changed"),
	onTotalTimeLimitInputValueChanged: action("events:total-time-limit-changed"),
	onUsePreferredTotalTimeLimitChanged: action(
		"events:use-preferred-total-time-limit-changed",
	),
	onUseStopGameChanged: action("events:use-stop-game-changed")
});

export const WithBehavior = {
	render: () => (
		<div style={{
			display: "flex",
			height: 300,
			border: "1px dotted silver"
		}}>
			<NiconicoDevtoolRankingPage {...store} />
		</div>
	),
	name: "with-behavior"
};
