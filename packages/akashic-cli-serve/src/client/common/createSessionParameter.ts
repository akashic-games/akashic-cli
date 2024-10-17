import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";
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
		// FIXME playlog で isolatedModules を考慮したのち削除。
		// @ts-expect-error src/clent/ は isolatedModules: true なので const enum の MessageEventIndex がエラーになるが、
		// 実際は playlog が preserveConstEnums でビルドされているため問題にならない。
		ret[playlog.MessageEventIndex.Data].parameters.service = "nicolive";
	}

	return ret;
}
