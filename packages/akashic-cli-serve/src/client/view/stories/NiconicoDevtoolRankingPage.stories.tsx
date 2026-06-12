import { observable } from "mobx";
import * as React from "react";
import { fn } from "storybook/test";
import { NiconicoDevtoolRankingPage } from "../molecule/NiconicoDevtoolRankingPage.js";

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
	onAutoSendEventsChanged: fn(),
	onModeSelectChanged: fn(),
	onTotalTimeLimitInputValueChanged: fn(),
	onUsePreferredTotalTimeLimitChanged: fn(),
	onUseStopGameChanged: fn()
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
