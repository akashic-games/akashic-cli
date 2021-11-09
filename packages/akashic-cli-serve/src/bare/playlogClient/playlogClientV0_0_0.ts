import { SocketIOAMFlowClientOverride } from "../../client/akashic/SocketIOAMFlowClientOverride";
import { socketInstance } from "../../client/api/socketInstance";
import { ApiClient } from "../../client/api/ApiClient";
import { SocketIOAMFlowClient } from "../../client/akashic/SocketIOAMFlowClient";

// このファイルを実行しているホスト名
// クライアント側で取得できないためサーバー側で取得して埋め込むという使い方をする想定
declare var HOST: string;

// playlogClientのplaylogServerUrlとして以下のURLを指定された時だけ動作確認テスト用に書き換えたAmflowを使う
const DUMMY_URLS = ["http://dummy.playlog.net"];
const DUMMY_PLAYER_ID = "dummy";

export class Session {
	private _url: string;
	constructor(url: string, _option: any) {
		this._url = url;
	}
	open(cb: (err?: Error) => void) {
		cb();
	}
	on(_msg: string, _cb: (err?: Error) => void) {}
	createClient(opt: any, cb: (err: Error, client: any) => void) {
		if (typeof opt === "function") {
			cb = opt;
			opt = null;
		}
		const host = typeof HOST !== "undefined" ? HOST : window.location.host;
		if (DUMMY_URLS.indexOf(this._url) !== -1) {
			const protocol = window.location.protocol.includes("https") ? "https" : "http";
			const apiClient = new ApiClient(`${protocol}://${host}`);
			// TODO: 外部からplayIdの指定をできるようにすべきだが、現状動作確認テストでは1つのplayしか使用しないので今の所はこのままでも問題ない
			const playId = "0";
			apiClient.createPlayToken(playId, DUMMY_PLAYER_ID, false, DUMMY_PLAYER_ID, undefined).then(result => {
				cb(null, new SocketIOAMFlowClientOverride(socketInstance(host), { playId, token: result.data.playToken }));
			}).catch(err => console.error(err));
		}
		else {
			cb(null, new SocketIOAMFlowClient(socketInstance()));
		}
	}
}

export const Socket = {
	Type: {
		WebSocket: 1
	}
}
