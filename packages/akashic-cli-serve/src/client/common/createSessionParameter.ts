import { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";
import * as playlog from "@akashic/playlog";

export function createSessionParameter(service: ServiceType): playlog.Event {
	const ret: playlog.MessageEvent = [
		32,
		0,
		":akashic",
		{
			"type": "start",
			"parameters": {
				"mode": "multi"
			}
		}
	];

	if (service !== "none") {
		ret[playlog.MessageEventIndex.Data].parameters.service = service;
	}

	return ret;
}
