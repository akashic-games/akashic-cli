import { GameConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";
import { ImageAssetConfigurationBase } from "@akashic/game-configuration";

/**
 * コンテンツ内の全ての画像アセットに hint として untainted:true を付与する。
 */
export async function transformUntaint(gamejson: GameConfiguration): Promise<void> {
	// async は現状不要だが、他の transform〜() と統一しておく
	const assets = gamejson.assets ?? (gamejson.assets = {});
	Object.keys(assets).forEach(key => {
		const decl = assets[key] as ImageAssetConfigurationBase;
		if (decl.type === "image") {
			if (!decl.hint) {
				decl.hint = {};
			}
			decl.hint!.untainted = true;
		}
	});
}
