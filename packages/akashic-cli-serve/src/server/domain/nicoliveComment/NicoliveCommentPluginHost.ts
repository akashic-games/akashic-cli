import type { AMFlow } from "@akashic/amflow";
import { TickIndex, type Tick } from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import { callOrThrow } from "../../../common/callOrThrow.js";
import { createNicoliveCommentEvent } from "../../../common/PlaylogShim.js";
import type { NicoliveCommentConfig, NicoliveCommentConfigComment } from "../../../common/types/NicoliveCommentConfig.js";
import type { NicoliveCommentEventComment, NicoliveCommentPlugin } from "../../../common/types/NicoliveCommentPlugin.js";

const VALID_FIELDS: string[] = [
	"comment",
	"userID",
	"isAnonymous",
	"isOperatorComment",
	"command",
] satisfies (keyof NicoliveCommentEventComment)[];
const DEFAULT_FIELDS: (keyof NicoliveCommentEventComment)[] = ["comment", "userID", "isAnonymous", "isOperatorComment"];
const NULL_COMMENT: NicoliveCommentEventComment = { comment: "", command: "" };

export class NicoliveCommentPluginHost {
	onStartStop: Trigger<boolean> = new Trigger();
	readonly plugin: NicoliveCommentPlugin;

	protected config: NicoliveCommentConfig;
	protected amflow: AMFlow;
	protected filter: Set<keyof NicoliveCommentEventComment> = new Set();

	protected started: boolean = false;
	protected planned: boolean = false;
	protected plan: Map<number, NicoliveCommentEventComment[]> = new Map();

	constructor(config: NicoliveCommentConfig, amflow: AMFlow) {
		this.config = config;
		this.amflow = amflow;

		this.plugin = {
			start: (opts, callback) => {
				if (this.started) {
					callOrThrow(callback, new Error("NicoliveCommentPlugin already started."));
					return;
				}

				if (opts?.fields) {
					const invalidFileds = opts.fields.filter(f => VALID_FIELDS.indexOf(f) === -1);
					if (invalidFileds.length) {
						callOrThrow(callback, new Error(`nicoliveComment.start(): invalid fields ${JSON.stringify(invalidFileds)}.`));
						return;
					}
				}

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

	planToSendByTemplate(name: string): boolean {
		const comments = this.config.templates?.[name]?.comments;
		if (!Array.isArray(comments) || comments.length === 0) {
			console.warn(`NicoliveCommentPluginHost: no template named '${name}'`);
			return false;
		}
		return this._planToSendImpl(comments);
	}

	planToSend(c: NicoliveCommentEventComment): boolean {
		return this._planToSendImpl([{ comment: "", ...c }]);
	}

	protected _planToSendImpl(comments: NicoliveCommentConfigComment[]): boolean {
		const { amflow } = this;

		if (!this.started) {
			console.warn("NicoliveCommentPluginHost: plugin not started.");
			return false;
		}

		const replan = (tick: Tick): void => {
			amflow.offTick(replan);

			const age = tick[TickIndex.Frame];
			if (!this.planned)
				this._setupPlan(age);

			const base = age + 1; // age は今既に来ている tick なので次の tick から送る
			let lastFrame = base;
			comments.forEach(c => {
				const comment = { ...NULL_COMMENT, ...c };
				const frame = lastFrame = (comment.frame != null) ? base + comment.frame : lastFrame;
				arrayMapAdd(this.plan, frame, filterProperty(comment, this.filter));
			});
		};

		amflow.onTick(replan);
		return true;
	}

	protected _setupPlan(startAge: number): void {
		if (this.planned) return;
		this.planned = true;

		const { plan, config } = this;
		const { templates } = config;
		plan.clear();

		if (!templates)
			return;

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
			this.amflow.sendEvent(createNicoliveCommentEvent(comments));
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

function filterProperty<T extends object>(o: T, filter: Set<keyof T>): Partial<T> {
	const ret: Partial<T> = {};
	objectForEach(o, (v, k) => {
		if (filter.has(k))
			ret[k] = v;
	});
	return ret;
};
