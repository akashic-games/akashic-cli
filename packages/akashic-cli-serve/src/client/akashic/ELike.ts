export interface ELike {
	id: number;
	children?: ELike[];
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
