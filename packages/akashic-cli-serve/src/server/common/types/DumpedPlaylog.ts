import type { StartPoint } from "@akashic/amflow";
import type { TickList } from "@akashic/playlog";

export interface DumpedPlaylog {
	tickList: TickList;
	startPoints: StartPoint[];
}
