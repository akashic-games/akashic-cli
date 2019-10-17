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

	// FilledRect
	cssColor?: string;

	// Label
	text?: string;

	// Sprite (not used yet)
	surface?: any; // TODO SurfaceLike
	srcWidth?: number;
	srcHeight?: number;
	srcX?: number;
	srcY?: number;
}
