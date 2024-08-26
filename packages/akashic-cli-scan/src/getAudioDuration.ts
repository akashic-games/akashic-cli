import * as fs from "fs";
import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import * as aacDuration from "aac-duration";
import type { IAudioMetadata, IOptions, parseFile } from "music-metadata";
import { mp4Inspector } from "thumbcoil";

// music-metadata@8 以降 pure ESM なので import() で読み込む
async function importMetadata(filepath: string, options?: IOptions): Promise<IAudioMetadata> {
	// CommonJS 設定の TS では dynamic import が require() に変換されてしまうので、eval() で強引に import() する
	// eslint-disable-next-line no-eval
	const musicMetadata = (await eval("import('music-metadata')"));
	return (musicMetadata.parseFile as typeof parseFile)(filepath, options);
}

export async function getAudioDuration(filepath: string, logger?: Logger): Promise<number | undefined> {
	const ext = path.extname(filepath);
	if (ext === ".aac") {
		return aacDuration(filepath);
	} else if (ext === ".ogg") {
		const metaData = await importMetadata(filepath, { duration: true });
		// TODO: duration が取得できなかった場合のフォールバック対応。現状、`writeJSON()` に渡すオブジェクトの duration 値は NaN となり、game.json 書き込み時に null となる。
		return metaData.format.duration;
	} else if (ext === ".mp4" || ext === ".m4a") {
		if (ext === ".mp4")
			logger?.warn("[deprecated] " + path.basename(filepath) + " uses deprecated format. Use AAC or M4A instead of MP4(AAC).");
		const data = fs.readFileSync(filepath);
		const moov = mp4Inspector.inspect(data).filter((o: any) => o.type === "moov")[0]; // 必須BOXなので必ず1つある
		const mvhd = moov.boxes.filter((o: any) => o.type === "mvhd")[0]; // MoVie HeaDer。moov直下の必須フィールドなので必ず1つある
		return mvhd.duration / mvhd.timescale;
	} else {
		throw new Error("Unsupported format: " + ext);
	}
}
