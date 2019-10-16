
function getMatrixFromRoot(e: ae.ELike | null, focusingCamera: ae.CameraLike | null): ae.MatrixLike | null {
	if (!e || !e.getMatrix)
		return focusingCamera ? focusingCamera.getMatrix() : null;

	// akashic-engine の凶悪仕様(matrixのダーティフラグを立てるのは利用側の責務)対応
	if (e._matrix) {
		e._matrix._modified = true;
	}

	var m1 = e.getMatrix();
	var m2 = getMatrixFromRoot(e.parent, focusingCamera);
	return m2 ? m2.multiplyNew(m1) : m1;
}

export class ServeGameContent {
	readonly agvGameContent: agv.GameContent;
	private _game: agv.GameLike;
	private _highlightedEntityId: number;

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
			renderer.fillRect(0, 0, Math.max(e.width, 1), Math.max(e.height, 1), "rgba(255, 0, 0, 0.3)");
			renderer.end();
			return ret;
		};
	}

	getRawEntity(eid: number): any {
		return (eid >= 0) ? this._game.db[eid] : this._game._localDb[eid];
	}

	changeHighlightedEntity(id: number | null): void {
		if (this._highlightedEntityId === id)
			return;

		this._highlightedEntityId = id;
		if (this._game)
			this._game.render();  // tick が止まっているとrender()が来ないので明示的に呼ぶ
	}
}
