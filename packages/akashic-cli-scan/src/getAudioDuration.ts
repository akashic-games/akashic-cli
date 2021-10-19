import * as fs from "fs";
import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import * as aacDuration from "aac-duration";
import * as musicMetaData from "music-metadata";
import { mp4Inspector } from "thumbcoil";

export async function getAudioDuration(filepath: string, logger?: Logger): Promise<number> {
	const ext = path.extname(filepath);
	if (ext === ".aac") {
		return aacDuration(filepath);
	} else if (ext === ".ogg") {
		const metaData = await musicMetaData.parseFile(filepath, {duration: true});
		return metaData.format.duration;
	} else if (ext === ".ogg" || ext === ".mp4") {
		logger?.warn("[deprecated] " + path.basename(filepath) + " uses deprecated format. Use AAC instead of MP4(AAC).");
		const data = fs.readFileSync(filepath);
		const moov = mp4Inspector.inspect(data).filter((o: any) => o.type === "moov")[0]; // 必須BOXなので必ず1つある
		const mvhd = moov.boxes.filter((o: any) => o.type === "mvhd")[0]; // MoVie HeaDer。moov直下の必須フィールドなので必ず1つある
		return mvhd.duration / mvhd.timescale;
	} else {
		throw new Error("Unsupported format: " + ext);
	}
}
