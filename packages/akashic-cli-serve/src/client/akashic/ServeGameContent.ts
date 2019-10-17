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

/*
TODO use original implementation for exclude E option
function findPointSourceByPoint(
	e: ae.ELike,
	point: ae.PointLike,
	m: ae.MatrixLike,
	findUntouchable: boolean,
	findHidden: boolean,
	camera?: CameraLike
): ELike | null {
	if (!findHidden && e.state & ae.EntityStateFlags.Hidden)
		return null;
	const cams = e._targetCameras;
	if (cams && cams.length > 0 && (!camera || cams.indexOf(camera) === -1))
		return null;
	m = m ? m.multiplyNew(e.getMatrix()) : e.getMatrix().clone();
	const p = m.multiplyInverseForPoint(point);
	if (e._hasTouchableChildren || (findUntouchable && e.children && e.children.length)) {
		if (!e.shouldFindChildrenByPoint(p))
			continue;
		for (let i = e.children.length - 1; i >= 0; --i) {
			const child = e.children[i];
			if (!findUntouchable && !child._touchable && !child._hasTouchableChildren)
				continue;
			const result = findPointSourceByPoint(child, point, m, findUntouchable, findHidden, camera);
			if (result)
				return result;
		}
	}
	return ((findUntouchable || e._touchable) && (0 <= p.x && e.width > p.x && 0 <= p.y && e.height > p.y)) ? e : null;
};
*/

export class ServeGameContent {
	readonly agvGameContent: agv.GameContent;
	private _game: agv.GameLike;
	private _highlightedEntityId: number | null;

	constructor(agvGameContent: agv.GameContent) {
		this.agvGameContent = agvGameContent;
		this._game = null!;
		this._highlightedEntityId = null;
	}

	setup(): void {
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
			const mat = getMatrixFromRoot(e, camera || game.focusingCamera)._matrix;
			renderer.transform(mat);
			renderer.fillRect(0, 0, e.width, e.height, "rgba(255, 0, 0, 0.3)");
			renderer.end();
			return ret;
		};
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
