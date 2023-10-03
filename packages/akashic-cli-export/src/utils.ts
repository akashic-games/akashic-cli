import { AssetConfiguration } from "@akashic/game-configuration";

/**
 * audio アセットの拡張子チェック
 */
export function checkAudioAssetExtensions(assets: AssetConfiguration[]): void {
	assets.forEach(asset => {
		if (asset.type === "audio") {
			if (asset.hint && asset.hint.extensions) {
				let isOggExist = false;
				let isM4aOrAacExist = false;
				asset.hint.extensions.forEach(v => {
					if (v === ".ogg") isOggExist = true;
					if (v === ".m4a" || v === ".aac") isM4aOrAacExist = true;
				});

				if (!isOggExist)
					console.warn(`may be no sound depending on the environment because no .ogg file in ${asset.path}.`);

				if (!isM4aOrAacExist)
					console.warn(`may be no sound depending on the environment because no .m4a or .aac file in ${asset.path}.`);
			}
		}
	});
}
