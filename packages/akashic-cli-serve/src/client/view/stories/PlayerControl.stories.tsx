import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { PlayerControl } from "../molecule/PlayerControl";

storiesOf("m-PlayerControl", module)
	.add("joined&enabled", () => (
		<PlayerControl makeProps={() => ({
			selfId: "1234567asdfg",
			isJoined: true,
			isJoinEnabled: true,
			onClickJoinLeave: action("joinleave")
		})} />
	))
	.add("non-joined&disabled", () => (
		<PlayerControl makeProps={() => ({
			selfId: "1234567asdfg",
			isJoined: false,
			isJoinEnabled: false,
			onClickJoinLeave: action("joinleave")
		})} />
	));
