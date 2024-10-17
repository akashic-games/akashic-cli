import type * as amf from "@akashic/amflow";
import { Trigger } from "@akashic/trigger";
import type { EDumpItem } from "../common/types/EDumpItem";
import type { ProfilerValue } from "../common/types/Profiler";
import type { RuntimeWarning } from "./RuntimeWarning";

// akashic-engine の g.EntityStateFlags のうち、必要な部分のコピー。
//
// serve からは akashic-engine の定義を直接参照できないため必要。
// なお同じ役割の AkashicGameViewWeb.d.ts は d.ts のため型しか置けない。値を伴う enum, const enum は書けないので暫定的にここ (利用箇所) で定義する。
// TODO AkashicGameViewWeb.d.ts との関係整理
const enum EntityStateFlags {
	Hidden = 1
}

function getMatrixFromRoot(e: ae.ELike | undefined, camera: ae.CameraLike | undefined): ae.MatrixLike | null {
	if (!e || !e.getMatrix)
		return camera ? camera.getMatrix() : null;

	// akashic-engine の凶悪仕様(matrixのダーティフラグを立てるのは利用側の責務)対応
	if (e._matrix) {
		e._matrix._modified = true;
	}

	const m1 = e.getMatrix();
	const m2 = getMatrixFromRoot(e.parent, camera);
	return m2 ? m2.multiplyNew(m1) : m1;
}

// Mobx にゲーム内の値を触らせないようコピーする (class なのでコピーしなくても大丈夫？　要検証)
function makeEDumpItem(e: ae.ELike): EDumpItem {
	return {
		constructorName: e.constructor ? e.constructor.name : "",
		id: e.id,
		children: (e.children || []).map(makeEDumpItem),
		x: e.x,
		y: e.y,
		width: e.width,
		height: e.height,
		opacity: e.opacity,
		angle: e.angle,
		scaleX: e.scaleX,
		scaleY: e.scaleY,
		anchorX: e.anchorX,
		anchorY: e.anchorY,
		local: e.local,
		touchable: e.touchable,
		visible: !(e.state & EntityStateFlags.Hidden),
		cssColor: (e.cssColor != null) ? e.cssColor : null,
		text: (e.text != null) ? e.text : null
	};
}

export class ServeGameContent {
	readonly agvGameContent: agv.GameContent;
	onTick: Trigger<agv.GameLike>;
	onReset: Trigger<amf.StartPoint>;
	onWarn: Trigger<RuntimeWarning>;
	private _game: agv.GameLike;
	private _gameDriver: agv.GameDriverLike;
	private _highlightedEntityId: number | null;

	constructor(agvGameContent: agv.GameContent) {
		this.agvGameContent = agvGameContent;
		this._game = null!;
		this._gameDriver = null!;
		this._highlightedEntityId = null;
		this.onTick = new Trigger<agv.GameLike>();
		this.onReset = new Trigger<amf.StartPoint>();
		this.onWarn = new Trigger<RuntimeWarning>();
	}

	get id(): number {
		return this.agvGameContent.id;
	}

	setup(): void {
		this._game = this.agvGameContent.getGame();
		this._gameDriver = this.agvGameContent.getGameDriver();

		const self = this;
		const game = this._game;
		const renderOriginal = game.render;
		game.render = function (camera?: ae.CameraLike) {
			const gameModified = game._modified;
			const ret = renderOriginal.apply(this, [camera]);
			if ("_modified" in game && !gameModified) return ret; // AEv3 は画面更新が不要ならなにもしない。

			// エンティティハイライト描画
			// TODO 子孫要素の包含矩形描画 (or サイズ 0 のエンティティの表示方法検討
			const eid = self._highlightedEntityId;
			if (eid == null)
				return ret;
			const e = (eid >= 0) ? (game.db.get?.(eid) ?? game.db[eid]) : (game._localDb.get?.(eid) ?? game._localDb[eid]);
			if (!e)
				return ret;
			const renderer = game.renderers[0];  // TODO 0番だけで描画するのは暫定。現実的には0しかない。
			renderer.begin();
			renderer.save();
			const mat = getMatrixFromRoot(e, camera || game.focusingCamera);
			if (mat != null) {
				renderer.transform(mat._matrix);
				renderer.fillRect(0, 0, e.width, e.height, "rgba(255, 0, 0, 0.3)");
				const anchorSize = 4;
				const anchorX = e.anchorX == null ? 0 : e.anchorX;
				const anchorY = e.anchorY == null ? 0 : e.anchorY;
				renderer.restore();
				const anchor = mat.multiplyPoint({ x: e.width * anchorX, y: e.height * anchorY });
				const color = (e.anchorX == null || e.anchorY == null) ? "rgba(0, 0, 255, 1)" : "rgba(0, 255, 255, 1)";
				renderer.fillRect(anchor.x - anchorSize / 2, anchor.y - anchorSize / 2, anchorSize, anchorSize, color);
			}
			renderer.end();
			return ret;
		};

		const tickOriginal = game.tick;
		game.tick = function (_advanceAge: boolean, _omittedTickCount?: number, _events?: playlog.EventLike[]) {
			self.onTick.fire(game);
			return tickOriginal.apply(this, [_advanceAge, _omittedTickCount, _events]);
		};

		const gameDriver = this._gameDriver;
		const resetOriginal = gameDriver._gameLoop?.reset;
		if (resetOriginal) {
			gameDriver._gameLoop.reset = function (startPoint: amf.StartPoint) {
				self.onReset.fire(startPoint);
				return resetOriginal.apply(this, [startPoint]);
			};
		}
	}

	setContentArea(area: agv.ContentArea): void {
		this.agvGameContent.setContentArea(area);
	}

	/**
	 * ゲームを外部からリセットできるか。
	 * v2 系以前は外部からリセットするメソッドがないため false を返す。
	 */
	isResettable(): boolean {
		return !!this._gameDriver._gameLoop?.reset;
	}

	/**
	 * ゲームをリセットする。
	 *
	 * isResettable() が偽の場合、何もしない。
	 * onReset はこれと独立に、内部契機のリセットで fire されることもあるので注意。
	 *
	 * @param startPoint リセットに使うスタートポイント
	 */
	reset(startPoint: amf.StartPoint): void {
		this._gameDriver._gameLoop?.reset?.(startPoint);
	}

	getGameVars<T>(propertyName: string): Promise<T> {
		return new Promise(resolve => {
			this.agvGameContent.getGameVars(propertyName, value => {
				resolve(value);
			});
		});
	}

	dumpEntities(): EDumpItem[] {
		if (!this._game || !this._game.scene())
			return [];
		return (this._game.scene().children || []).map(makeEDumpItem);
	}

	getRawEntity(eid: number): any {
		return (eid >= 0) ? (this._game.db.get?.(eid) ?? this._game.db[eid]) : (this._game._localDb.get?.(eid) ?? this._game._localDb[eid]);
	}

	changeHighlightedEntity(eid: number | null): void {
		if (this._highlightedEntityId === eid)
			return;
		this._highlightedEntityId = eid;
		if (this._game) {
			// AEv3 では _modified フラグが false の場合 render() が画面更新をスキップするため、 true を設定して必ず描画させる。
			if ("_modified" in this._game)
				this._game._modified = true;
			this._game.render();  // tick が止まっているとrender()が来ないので明示的に呼ぶ
		}
	}

	getEntityIdByPoint(x: number, y: number): number | null {
		const game = this._game;
		const pointSource = game.scene().findPointSourceByPoint({ x, y }, true, game.focusingCamera);
		return (pointSource && pointSource.target) ? pointSource.target.id : null;
	}

	setProfilerValueTrigger(cb: (value: ProfilerValue) => void): void {
		const gameDriver = this.agvGameContent.getGameDriver();
		if (!gameDriver) {
			this.agvGameContent.addContentLoadListener(() => this.setProfilerValueTrigger(cb));
			return;
		}

		// 全体的に内部プロパティなので、存在しない場合に備えて ?. をつけておく。
		// 特に _gameLoop は実際に存在しない場合がある (--debug-untrusted) 。
		if (gameDriver._gameLoop?._clock?._profiler?._calculateProfilerValueTrigger) {
			const trigger = gameDriver._gameLoop._clock._profiler._calculateProfilerValueTrigger;
			if (typeof trigger.add !== "undefined") {
				trigger.add(cb);
			} else {
				// addメソッドが無いケースはv1コンテンツの場合のみの想定で、この時handleメソッドは必ず存在する
				trigger.handle(cb);
			}
		} else {
			console.warn("_callculateProfilerValueTriger is not defined. It's not supported in --debug-untrusted");
		}
	}

	sendEvents(events: playlog.EventLike[]): void {
		this.agvGameContent.sendEvents(events);
	}

	makeScreenShotData(): string {
		return this.agvGameContent._element._gameContainerHtmlElement.getElementsByTagName("canvas")[0].toDataURL();
	}
}
