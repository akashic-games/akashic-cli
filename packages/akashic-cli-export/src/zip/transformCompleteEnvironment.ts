import * as https from "https";
import { GameConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";

// TODO game-configuration への移行後、削除する
interface GameConfigurationEnvrironment {
	"sandbox-runtime"?: string;
	"akashic-runtime"?: string | {
		version: string;
		flavor?: string;
	};
	external?: { [key: string]: string };
}

const VERSION_INFO_URL = "https://raw.githubusercontent.com/akashic-games/akashic-runtime-version-table/master/versions.json";

/**
 * game.json の environment フィールドを補完する。
 * 特に、 sandbox-runtime から akashic-runtime を求めて設定する。
 */
export async function transformCompleteEnvrironment(gamejson: GameConfiguration): Promise<void> {
	if (!gamejson.environment) {
		gamejson.environment = {};
	}

	// TODO game-configuration 以降後、 as を削除する
	const renderers = (gamejson as any).renderers as (string[] | undefined);
	const environment = gamejson.environment as GameConfigurationEnvrironment;

	if (!environment.external) {
		environment.external = {};
	}
	environment.external.send = "0"; // 現バージョンでは固定。将来的に指定方法が必要でありうるが、未検討。

	if (!environment["sandbox-runtime"])
		environment["sandbox-runtime"] = "1";

	if (!environment["akashic-runtime"]) {
		const sandboxRuntime = environment["sandbox-runtime"]!;
		const versionInfo = JSON.parse(await getFromHttps(VERSION_INFO_URL));

		environment["akashic-runtime"] = {
			version: "~" + versionInfo.latest[sandboxRuntime]!
		};

		if (sandboxRuntime !== "1" && (!renderers || renderers.indexOf("webgl") === -1)) {
			// WebGL Renderer のある v2 以降では、WebGL が不要ならファイルサイズの小さい -canvas 版を利用する
			environment["akashic-runtime"].flavor = "-canvas";
		}
	}
}

export function getFromHttps(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const request = https.get(url, (res) => {
			if (res.statusCode! >= 400) { // リファレンスを見ても statusCode がないケースがなさそうなので !
				return reject(new Error(`Failed to get resource. url: ${url}. status code: ${res.statusCode}.`));
			}
			const bodies: string[] = [];
			res.on("data", (chunk) => {
				bodies.push(chunk.toString());
			});
			res.on("end", () => resolve(bodies.join("")));
		});
		request.on("error", (err) => reject(err));
	});
}
