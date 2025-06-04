import type { AMFlow } from "@akashic/amflow";
import { TickIndex, type Tick } from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import { callOrThrow } from "../../../common/callOrThrow.js";
import { createNamagameCommentEvent } from "../../../common/PlaylogShim.js";
import type { NamagameCommentConfig, NamagameCommentConfigComment } from "../../../common/types/NamagameCommentConfig.js";
import type { NamagameCommentEventComment, NamagameCommentPlugin } from "../../../common/types/NamagameCommentPlugin.js";

export class NamagameCommentPluginHost {
	onStartStop: Trigger<boolean> = new Trigger();
	readonly plugin: NamagameCommentPlugin;

	protected config: NamagameCommentConfig;
	protected amflow: AMFlow;
	protected fps: number;

	protected started: boolean = false;
	protected planned: boolean = false;
	protected plan: Map<number, NamagameCommentEventComment[]> = new Map();

	constructor(config: NamagameCommentConfig, amflow: AMFlow, fps: number) {
		this.config = config;
		this.amflow = amflow;
		this.fps = fps;

		this.plugin = {
			start: (_opts, callback) => {
				if (this.started) {
					callOrThrow(callback, new Error("NamagameCommentPlugin already started."));
					return;
				}

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
			console.warn(`NamagameCommentPluginHost: no template named '${name}'`);
			return false;
		}
		return this._planToSendImpl(comments);
	}

	planToSend(c: NamagameCommentEventComment): boolean {
		return this._planToSendImpl([c]);
	}

	protected _planToSendImpl(comments: NamagameCommentConfigComment[]): boolean {
		const { amflow } = this;

		if (!this.started) {
			console.warn("NamagameCommentPluginHost: plugin not started.");
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
				const frame = lastFrame = (c.frame != null) ? base + c.frame : lastFrame;
				const comment = { ...c, isAnonymous: !!c.isAnonymous, vpos: c.vpos ?? frameToVpos(frame, this.fps) };
				arrayMapAdd(this.plan, frame, comment);
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
				const frame = lastFrame = (c.frame != null) ? base + c.frame : lastFrame;
				if (frame >= startAge) {
					const comment = { ...c, isAnonymous: !!c.isAnonymous, vpos: c.vpos ?? frameToVpos(frame, this.fps) };
					arrayMapAdd(plan, frame, comment);
				}
			});
		});
	}

	protected _handleTick: (tick: Tick) => void = tick => {
		const age = tick[TickIndex.Frame];
		if (!this.planned)
			this._setupPlan(age);

		const comments = this.plan.get(age);
		if (comments?.length) {
			this.amflow.sendEvent(createNamagameCommentEvent(comments));
		}
	};
}

function frameToVpos(frame: number, fps: number): number {
	return (frame * (1000 / fps) * 10); // 10 倍してミリ秒をセンチ秒に
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
