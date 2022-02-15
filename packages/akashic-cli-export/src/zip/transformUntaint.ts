import { GameConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";

/**
 * コンテンツ内の全ての画像アセットに hint として untainted:true を付与する。
 */
export async function transformUntaint(gamejson: GameConfiguration): Promise<void> {
	// async は現状不要だが、他の transform〜() と統一しておく
	const assets = gamejson.assets ?? (gamejson.assets = {});
	Object.keys(assets).forEach(key => {
		if (assets[key].type === "image") {
			if (!assets[key].hint) {
				assets[key].hint = {};
			}
			assets[key].hint!.untainted = true;
		}
	});
}
