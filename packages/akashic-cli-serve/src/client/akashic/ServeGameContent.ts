import { Trigger } from "@akashic/trigger";
import { EDumpItem } from "../common/types/EDumpItem";

function getMatrixFromRoot(e: ae.ELike | null, camera: ae.CameraLike | null): ae.MatrixLike | null {
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
		visible: !(e.state & ae.EntityStateFlags.Hidden),
		cssColor: (e.cssColor != null) ? e.cssColor : null,
		text: (e.text != null) ? e.text : null
	};
}

export class ServeGameContent {
	readonly agvGameContent: agv.GameContent;
	onTick: Trigger<agv.GameLike>;
	private _game: agv.GameLike;
	private _highlightedEntityId: number | null;

	constructor(agvGameContent: agv.GameContent) {
		this.agvGameContent = agvGameContent;
		this._game = null!;
		this._highlightedEntityId = null;
		this.onTick = new Trigger<agv.GameLike>();
	}

	setup(): void {
		this._game = this.agvGameContent.getGame();
		const game = this._game;
		const renderOriginal = game.render;
		const self = this;
		game.render = function (camera?: ae.CameraLike) {
			const gameModified = game._modified;
			const ret = renderOriginal.apply(this, arguments);
			if ("_modified" in game && !gameModified) return; // AEv3 は画面更新が不要ならなにもしない。

			// エンティティハイライト描画
			// TODO 子孫要素の包含矩形描画 (or サイズ 0 のエンティティの表示方法検討
			const eid = self._highlightedEntityId;
			if (eid == null)
				return ret;
			const e = (eid >= 0) ? game.db[eid] : game._localDb[eid];
			if (!e)
				return ret;
			const renderer = game.renderers[0];  // TODO 0番だけで描画するのは暫定。現実的には0しかない。
			renderer.begin();
			renderer.save();
			const mat = getMatrixFromRoot(e, camera || game.focusingCamera)._matrix;
			renderer.transform(mat);
			renderer.fillRect(0, 0, e.width, e.height, "rgba(255, 0, 0, 0.3)");
			renderer.restore();
			mat[0] = 1;
			mat[3] = 1;
			renderer.transform(mat);
			renderer.fillRect(e.width/2 - 2, e.height/2 - 2,  4, 4, "rgba(0, 255, 255, 1)");
			renderer.restore();
			renderer.end();
			return ret;
		};

		const tickOriginal = game.tick;
		game.tick = function (_advanceAge: boolean, _omittedTickCount?: number) {
			self.onTick.fire(game);
			return tickOriginal.apply(this, arguments);
		};
	}

	dumpEntities(): EDumpItem[] {
		if (!this._game || !this._game.scene())
			return [];
		return (this._game.scene().children || []).map(makeEDumpItem);
	}

	getRawEntity(eid: number): any {
		return (eid >= 0) ? this._game.db[eid] : this._game._localDb[eid];
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
}
