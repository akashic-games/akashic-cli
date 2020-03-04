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
	private _game: agv.GameLike;
	private _highlightedEntityId: number | null;

	constructor(agvGameContent: agv.GameContent) {
		this.agvGameContent = agvGameContent;
		this._game = null!;
		this._highlightedEntityId = null;
	}

	setup(tickHandler: (game: agv.GameLike) => void): void {
		this._game = this.agvGameContent.getGame();
		const game = this._game;
		const renderOriginal = game.render;
		const self = this;
		game.render = function (camera?: ae.CameraLike) {
			const ret = renderOriginal.apply(this, arguments);

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
			renderer.end();
			return ret;
		};

		const tickOriginal = game.tick;
		game.tick = function (_advanceAge: boolean, _omittedTickCount?: number) {
			tickHandler(game);
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
		if (this._game)
			this._game.render();  // tick が止まっているとrender()が来ないので明示的に呼ぶ
	}

	getEntityIdByPoint(x: number, y: number): number | null {
		const game = this._game;
		const pointSource = game.scene().findPointSourceByPoint({ x, y }, true, game.focusingCamera);
		return (pointSource && pointSource.target) ? pointSource.target.id : null;
	}
}
