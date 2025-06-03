import type { StartPoint } from "@akashic/amflow";
import type { TickList } from "@akashic/playlog";

/**
 * akashic-cli-serve 独自の playlog 形式。
 */
export interface DumpedPlaylog {
	tickList: TickList;
	startPoints: StartPoint[];

	/**
	 * akashic-cli-serve 拡張。
	 */
	__serve?: {
		/**
		 * プレイの時間 (ms)。
		 */
		duration?: number;
	};
}
