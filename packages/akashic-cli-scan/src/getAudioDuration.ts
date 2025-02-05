import * as fs from "fs";
import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger.js";
import aacDuration from "aac-duration";
import { parseFile } from "music-metadata";
import type { IAudioMetadata } from "music-metadata";
import * as thumbcoil from "thumbcoil";

export async function getAudioDuration(filepath: string, logger?: Logger): Promise<number | undefined> {
	const ext = path.extname(filepath);
	if (ext === ".aac") {
		return aacDuration(filepath);
	} else if (ext === ".ogg") {
		let metaData: IAudioMetadata | null = null;
		try {
			metaData = await parseFile(filepath, { duration: true });
		} catch (error) {
			logger?.error(error);
		}
		return metaData?.format.duration;
	} else if (ext === ".mp4" || ext === ".m4a") {
		if (ext === ".mp4")
			logger?.warn("[deprecated] " + path.basename(filepath) + " uses deprecated format. Use AAC or M4A instead of MP4(AAC).");
		const data = fs.readFileSync(filepath);
		const moov = thumbcoil.default.mp4Inspector.inspect(data).filter((o: any) => o.type === "moov")[0]; // 必須BOXなので必ず1つある
		const mvhd = moov.boxes.filter((o: any) => o.type === "mvhd")[0]; // MoVie HeaDer。moov直下の必須フィールドなので必ず1つある
		return mvhd.duration / mvhd.timescale;
	} else {
		throw new Error("Unsupported format: " + ext);
	}
}
