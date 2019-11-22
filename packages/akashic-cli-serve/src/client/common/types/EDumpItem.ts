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
}
