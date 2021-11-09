import * as amflow from "@akashic/amflow";
import type { Socket } from "socket.io-client";
import { SocketIOAMFlowClient } from "./SocketIOAMFlowClient";

export interface SocketIOAMFlowClientOverrideParameterObject {
	playId: string;
	token: string;
}

/**
 * SocketIOAMFlowClientの関数を書き換えるためのクラス
 * 本来はSocketIOAMFlowClientの継承ではなく委譲にすべきだが、現状書き換えが必要なメソッドが少ないので継承とした。
 * TODO: 書き換えがメソッドが多くなったら委譲に切り替える。
 */
export class　SocketIOAMFlowClientOverride extends SocketIOAMFlowClient {
	private _playId: string;
	private _token: string;

	constructor(socket: Socket, params: SocketIOAMFlowClientOverrideParameterObject) {
		super(socket);
		this._playId = params.playId;
		this._token = params.token;
	}

	open(_playId: string, callback?: (error?: Error) => void): void {
		super.open(this._playId, callback);
	}

	authenticate(_token: string, callback: (error: Error, permission: amflow.Permission) => void): void {
		super.authenticate(this._token, callback);
	}
}
