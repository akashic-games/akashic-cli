import type * as amf from "@akashic/amflow";
import type * as realPlaylog from "@akashic/playlog";
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

export interface OnTickArguments {
	game: agv.GameLike;
	events: realPlaylog.Event[] | undefined;
}

export class ServeGameContent {
	readonly agvGameContent: agv.GameContent;
	onTick: Trigger<OnTickArguments>;
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
		this.onTick = new Trigger();
		this.onReset = new Trigger();
		this.onWarn = new Trigger();
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

		// renderer によっては実装依存で begin() でキャンバス内容がクリアされる場合がある。
		// そこで renderOriginal() の内部から元の begin()/end() が呼ばれないようそれぞれを no-op に差し替えた上で、
		// beginOriginal() -> renderOriginal() -> (ハイライト描画: 必要であれば) -> endOriginal() の順に実行することを保証する。
		// 各フック関数はフレームをまたいで再利用し、renderer が変わったときだけ original を更新する。
		let rendererOriginal: ae.RendererLike = null!;
		let rendererBeginOriginal: (() => void) = null!;
		let rendererEndOriginal: (() => void) = null!;
		const noop = (): void => { /* do nothing */ };

		game.render = function (camera?: ae.CameraLike) {
			const renderer = game.renderers[0]; // TODO 0番だけで描画するのは暫定。現実的には0しかない。

			// renderer が変わったときだけ更新 (通常は初回のみ)
			if (renderer !== rendererOriginal) {
				rendererOriginal = renderer;
				rendererBeginOriginal = renderer.begin.bind(renderer);
				rendererEndOriginal = renderer.end.bind(renderer);
			}

			// AEv3 において画面更新が不要ならなにもしない。
			if ("_modified" in game && !game._modified) {
				return renderOriginal.apply(this, [camera]);
			}

			renderer.begin = noop;
			renderer.end = noop;

			rendererBeginOriginal();
			const ret = renderOriginal.apply(this, [camera]);

			// エンティティハイライト描画
			// TODO 子孫要素の包含矩形描画 (or サイズ 0 のエンティティの表示方法検討
			const eid = self._highlightedEntityId;
			const highlightedEntity = (eid != null)
				? ((eid >= 0) ? (game.db.get?.(eid) ?? game.db[eid]) : (game._localDb.get?.(eid) ?? game._localDb[eid]))
				: null;

			if (highlightedEntity != null) {
				renderer.save();
				const mat = getMatrixFromRoot(highlightedEntity, camera || game.focusingCamera);
				if (mat != null) {
					renderer.transform(mat._matrix);
					renderer.fillRect(0, 0, highlightedEntity.width, highlightedEntity.height, "rgba(255, 0, 0, 0.3)");
					const anchorSize = 4;
					const anchorX = highlightedEntity.anchorX == null ? 0 : highlightedEntity.anchorX;
					const anchorY = highlightedEntity.anchorY == null ? 0 : highlightedEntity.anchorY;
					renderer.restore();
					const anchor = mat.multiplyPoint({ x: highlightedEntity.width * anchorX, y: highlightedEntity.height * anchorY });
					const color = (highlightedEntity.anchorX == null || highlightedEntity.anchorY == null)
						? "rgba(0, 0, 255, 1)"
						: "rgba(0, 255, 255, 1)";
					renderer.fillRect(anchor.x - anchorSize / 2, anchor.y - anchorSize / 2, anchorSize, anchorSize, color);
				}
			}

			rendererEndOriginal();

			renderer.begin = rendererBeginOriginal;
			renderer.end = rendererEndOriginal;

			return ret;
		};

		const tickOriginal = game.tick;
		game.tick = function (advanceAge: boolean, omittedTickCount?: number, events?: playlog.EventLike[]) {
			// EventLike は AkashicGameViewWeb.d.ts の記述の都合上導入した型なので、外部に渡す時は本物の playlog に読み替える
			const evs = events as unknown as realPlaylog.Event[] | undefined;
			self.onTick.fire({ game, events: evs });

			return tickOriginal.call(this, advanceAge, omittedTickCount, events);
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

	sendEvents(events: realPlaylog.Event[]): void {
		this.agvGameContent.sendEvents(events);
	}

	makeScreenShotData(): string {
		return this.agvGameContent._element._gameContainerHtmlElement.getElementsByTagName("canvas")[0].toDataURL();
	}
}
