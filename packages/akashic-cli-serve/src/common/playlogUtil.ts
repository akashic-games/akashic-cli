import { calculateFinishedTime } from "@akashic/amflow-util/lib/calculateFinishedTime.js";
import type { DumpedPlaylog } from "./types/DumpedPlaylog.js";

export function calculatePlayDuration(playlog: DumpedPlaylog): number {
	let duration = calculateFinishedTime(
		playlog.tickList,
		playlog.startPoints[0].data.fps,
		playlog.startPoints[0].timestamp
	);

	if (playlog.__serve) {
		// 最終ティックから離れ過ぎていたらシュリンクすべき？
		duration = Math.max(duration, playlog.__serve.duration ?? 0);
	} else {
		duration += 1; // 最終ティックを消化できるよう 1ms だけ余分に追加する
	}

	return duration;
}
