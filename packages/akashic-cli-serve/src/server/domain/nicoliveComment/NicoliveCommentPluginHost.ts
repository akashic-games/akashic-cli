import type { AMFlow } from "@akashic/amflow";
import { TickIndex, type Tick, type MessageEvent, EventCode } from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import type { NicoliveCommentConfig } from "./NicoliveCommentConfig";
import type { NicoliveComment, NicoliveCommentPlugin } from "./NicoliveCommentPlugin";

const DEFAULT_FIELDS: (keyof NicoliveComment)[] = ["comment", "userID", "isAnonymous", "isOperatorComment"];
const NULL_COMMENT: NicoliveComment = { comment: "", command: "" };

export class NicoliveCommentPluginHost {
	onStartStop: Trigger<boolean> = new Trigger();
	readonly plugin: NicoliveCommentPlugin;

	protected config: NicoliveCommentConfig;
	protected amflow: AMFlow;
	protected filter: Set<keyof NicoliveComment> = new Set();

	protected started: boolean = false;
	protected planned: boolean = false;
	protected plan: Map<number, NicoliveComment[]> = new Map();

	constructor(config: NicoliveCommentConfig, amflow: AMFlow) {
		this.config = config;
		this.amflow = amflow;

		this.plugin = {
			start: (opts, callback) => {
				if (this.started)
					throw new Error("NicoliveCommentPlugin already started.");

				this.filter = new Set(opts?.fields ?? DEFAULT_FIELDS);

				amflow.onTick(this._handleTick);
				if (callback)
					setImmediate(callback);
				this.started = true;
				this.planned = false;
				this.onStartStop.fire(true);
			},

			stop: () => {
				amflow.offTick(this._handleTick);
				this.started = false;
				this.onStartStop.fire(false);
			}
		};
	}

	protected _setupPlan(startAge: number): void {
		if (this.planned) return;
		this.planned = true;

		const { plan, config } = this;
		const { templates } = config;
		plan.clear();

		objectForEach(templates, (templ) => {
			const { startBy, comments } = templ;
			if (!startBy || startBy === "manual") return;

			const base = startBy === "pluginStart" ? startAge : 0;
			let lastFrame = base;
			comments.forEach(c => {
				const comment = { ...NULL_COMMENT, ...c };
				const frame = lastFrame = (comment.frame != null) ? base + comment.frame : lastFrame;
				if (frame >= startAge)
					arrayMapAdd(plan, frame, filterProperty(comment, this.filter));
			});
		});
	}

	protected _handleTick: (tick: Tick) => void = tick => {
		const age = tick[TickIndex.Frame];
		if (!this.planned)
			this._setupPlan(age);

		const comments = this.plan.get(age);
		if (comments?.length) {
			this.amflow.sendEvent(createCommentMessageEvent(comments));
		}
	};
}

function objectForEach<T extends object>(obj: T, fun: (val: T[keyof T], key: keyof T) => void): void {
	(Object.keys(obj) as (keyof T)[]).forEach(key => fun(obj[key], key));
}

function arrayMapAdd<K, V>(map: Map<K, V[]>, k: K, v: V): void {
	if (map.has(k))
		map.get(k)?.push(v);
	else
		map.set(k, [v]);
}

function createCommentMessageEvent(comments: NicoliveComment[]): MessageEvent {
	return [
		EventCode.Message,
		0,
		":akashic",
		{
			type: "nicoservice:stream:comment",
			comments
		}
	];
}

function filterProperty<T extends object>(o: T, filter: Set<keyof T>): Partial<T> {
	const ret: Partial<T> = {};
	objectForEach(o, (v, k) => {
		if (filter.has(k))
			ret[k] = v;
	});
	return ret;
};
