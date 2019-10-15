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
	state: number;
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
		state: e.state
	};
}
