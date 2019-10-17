import { ELike } from "../akashic/ELike";

export interface EDumpItem {
	constructorName: string;
	id: number;
	children?: EDumpItem[];
	x: number;
	y: number;
	width: number;
	height: number;
	opacity: number;
	angle: number;
	scaleX: number;
	scaleY: number;
	anchorX?: number;
	anchorY?: number;
	local?: boolean;
	touchable: boolean;
	visible: boolean;

	// TODO 内部実装への依存の扱い検討。エンジン側にデバッグ用インターフェースが必要？

	// FilledRect
	cssColor?: string;
	// Label
	text?: string;
	// Sprite
	image?: HTMLImageElement; // especially for ImageAssetSurface
	srcWidth?: number;
	srcHeight?: number;
	srcX?: number;
	srcY?: number;
}

export function makeEDumpItem(e: ELike): EDumpItem {
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
		visible: !(e.state & 1),  // 1 === g.EntityStateFlags.Hidden
		cssColor: (e.cssColor != null) ? e.cssColor : null,
		text: (e.text != null) ? e.text : null,
		image: (e.surface != null && e.surface._drawable instanceof HTMLImageElement) ? e.surface._drawable : null,
		srcWidth: (e.srcWidth != null) ? e.srcWidth : null,
		srcHeight: (e.srcHeight != null) ? e.srcHeight : null,
		srcX: (e.srcX != null) ? e.srcX : null,
		srcY: (e.srcY != null) ? e.srcY : null
	};
}
