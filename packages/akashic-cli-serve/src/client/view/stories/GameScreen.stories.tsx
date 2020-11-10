import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { GameScreen } from "../organism/GameScreen";

function createDummyDiv(width: number, height: number): HTMLElement {
	const e = document.createElement("div");
	e.setAttribute("style", `width: ${width}px; height: ${height}px;`);
	return e;
}

storiesOf("o-GameScreen", module)
	.add("basic", () => (
		<GameScreen
			showsBackgroundImage={false}
			showsGrid={false}
			backgroundImage={null}
			gameWidth={320}
			gameHeight={240}
			screenElement={createDummyDiv(320, 240)}
			playerInfoResolverDialogProps={undefined}
			profilerCanvasProps={undefined}
			shouldStopPropagationFunc={() => {
				action("shouldStopPropagation");
				return false;
			}}
			onMouseMoveCapture={action("onMouseMoveCapture")}
			onClickCapture={action("onClickCapture")}
		/>
	))
	.add("background", () => (
		<GameScreen
			showsBackgroundImage={true}
			showsGrid={false}
			backgroundImage={null}
			gameWidth={320}
			gameHeight={240}
			screenElement={createDummyDiv(320, 240)}
			playerInfoResolverDialogProps={undefined}
			profilerCanvasProps={undefined}
			shouldStopPropagationFunc={() => {
				action("shouldStopPropagation");
				return false;
			}}
			onMouseMoveCapture={action("onMouseMoveCapture")}
			onClickCapture={action("onClickCapture")}
		/>
	))
	.add("background&grid", () => (
		<GameScreen
			showsBackgroundImage={true}
			showsGrid={true}
			backgroundImage={null}
			gameWidth={320}
			gameHeight={240}
			screenElement={createDummyDiv(320, 240)}
			playerInfoResolverDialogProps={undefined}
			profilerCanvasProps={undefined}
			shouldStopPropagationFunc={() => {
				action("shouldStopPropagation");
				return false;
			}}
			onMouseMoveCapture={action("onMouseMoveCapture")}
			onClickCapture={action("onClickCapture")}
		/>
	))
	.add("confirmDialog", () => (
		<GameScreen
			showsBackgroundImage={false}
			showsGrid={false}
			backgroundImage={null}
			gameWidth={320}
			gameHeight={240}
			screenElement={createDummyDiv(320, 240)}
			playerInfoResolverDialogProps={{
				remainingSeconds: 15,
				name: "プレイヤー名X",
				guestName: "ゲスト名Y",
				onClick: action("onClick")
			}}
			profilerCanvasProps={undefined}
			shouldStopPropagationFunc={() => {
				action("shouldStopPropagation");
				return false;
			}}
			onMouseMoveCapture={action("onMouseMoveCapture")}
			onClickCapture={action("onClickCapture")}
		/>
	))
	.add("profiler", () => (
		<GameScreen
			showsBackgroundImage={false}
			showsGrid={false}
			backgroundImage={null}
			gameWidth={320}
			gameHeight={240}
			screenElement={createDummyDiv(320, 240)}
			playerInfoResolverDialogProps={undefined}
			profilerCanvasProps={{
				profilerDataArray: [
					{
						name: "fps",
						data: [30, 31, 28, 32, 35],
						max: 35,
						min: 28,
						fixed: 2
					},
					{
						name: "frame",
						data: [4, 1, 0, 0, 0],
						max: 4,
						min: 0,
						fixed: 1
					}
				],
				profilerStyleSetting: {
					width: 150,
					height: 0,
					margin: 5,
					padding: 5,
					align: "horizontal",
					bgColor: "gray",
					fontColor: "white",
					fontSize: 17,
					fontMaxColor: "deeppink",
					fontMinColor: "dodgerblue",
					fontMinMaxColor: "black",
					graphColor: "lavender",
					graphWidth: 3,
					graphWidthMargin: 1,
					graphPadding: 5
				},
				canvasWidth: 350,
				canvasHeight: 200
			}}
			shouldStopPropagationFunc={() => {
				action("shouldStopPropagation");
				return false;
			}}
			onMouseMoveCapture={action("onMouseMoveCapture")}
			onClickCapture={action("onClickCapture")}
		/>
	));
