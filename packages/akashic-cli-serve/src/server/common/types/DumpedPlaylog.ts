import { TickList } from "@akashic/playlog";
import { StartPoint } from "@akashic/amflow";

export interface DumpedPlaylog {
	tickList: TickList;
	startPoints: StartPoint[];
}
