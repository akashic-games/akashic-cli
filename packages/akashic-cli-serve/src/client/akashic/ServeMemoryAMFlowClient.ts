import type * as amflow from "@akashic/amflow";
import { MemoryAmflowClient } from "@akashic/amflow-util/lib/MemoryAmflowClient";
import type * as playlog from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";

export class ServeMemoryAmflowClient extends MemoryAmflowClient {
	onPutStartPoint: Trigger<amflow.StartPoint> = new Trigger();

	getStartedAt(): number | null {
		return this._startPoints[0]?.timestamp ?? null;
	}

	enqueueEvent(event: playlog.Event): void {
		this.sendEvent(event);
	}

	getStartPointPromise(opts: amflow.GetStartPointOptions): Promise<amflow.StartPoint> {
		return new Promise((resolve, reject) => {
			this.getStartPoint(opts, (err, sp) => {
				void (err ? reject(err) : resolve(sp!));
			});
		});
	}

	putStartPoint(startPoint: amflow.StartPoint, callback: (error: Error | null) => void): void {
		this.onPutStartPoint.fire(startPoint);
		return super.putStartPoint(startPoint, callback);
	}
}
