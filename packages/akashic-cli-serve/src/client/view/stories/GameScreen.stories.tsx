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
			isDisplayingResolver={false}
			usernameDisplayAuthorizationDialogProps={{
				remainingSeconds: 0,
				onClick: action("onClick")
			}}
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
			isDisplayingResolver={false}
			usernameDisplayAuthorizationDialogProps={{
				remainingSeconds: 0,
				onClick: action("onClick")
			}}
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
			isDisplayingResolver={false}
			usernameDisplayAuthorizationDialogProps={{
				remainingSeconds: 0,
				onClick: action("onClick")
			}}
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
			isDisplayingResolver={true}
			usernameDisplayAuthorizationDialogProps={{
				remainingSeconds: 15,
				onClick: action("onClick")
			}}
			shouldStopPropagationFunc={() => {
				action("shouldStopPropagation");
				return false;
			}}
			onMouseMoveCapture={action("onMouseMoveCapture")}
			onClickCapture={action("onClickCapture")}
		/>
	));
