import type { IRectangle } from "maxrects-packer";

export interface PackTarget<T = void> {
	name: string;
	width: number;
	height: number;
	data: T;
}

export interface PackedRect<T = void> extends PackTarget<T> {
	x: number;
	y: number;
}

export interface PackResult<T = void> {
	width: number;
	height: number;
	rects: PackedRect<T>[];
}

interface MaxRectsPackerTarget<T> extends PackedRect<T>, IRectangle {
	area: number;
	hash: string;
}

/**
 * 与えられた矩形群のうち、小さい矩形をパッキングする。
 *
 * できるだけ矩形の数が減るように、この関数はできるだけ面積の小さい矩形を優先的に詰め込む。
 * ただし実行効率上、必ず小さい方の矩形から順にパッキングされるとは限らない。
 *
 * @param targets 敷き詰めを試みる矩形群。
 * @param width 敷き詰め結果画像の最大幅。
 * @param height 敷き詰め結果画像の最大高さ。
 */
export async function packSmallRects<T = void>(targets: PackTarget<T>[], width: number, height: number): Promise<PackResult<T> | null> {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { MaxRectsPacker } = await import("maxrects-packer");

	let tgts: MaxRectsPackerTarget<T>[] = targets.map(t => ({
		...t,
		area: t.width * t.height,
		x: 0, // maxrects-packer の型に合わせるため必要な値 (README を見る限り不要だが IRectangle に必要) 。
		y: 0, // 同上。
		hash: t.name // 不要だが、あると maxrects-packer の packing 結果が安定する値。
	}));

	// サイズ昇順で詰めていって、理論的上限 (width * height) を少し超えるであろう矩形群までを対象にパッキングする。
	tgts.sort((a, b) => a.area - b.area);
	let i = 0;
	for (let areaAcc = 0; i < tgts.length && areaAcc < width * height; ++i) {
		areaAcc += tgts[i].area;
	}
	tgts = tgts.slice(0, i);
	if (tgts.length === 0) return null;

	const packer = new MaxRectsPacker<MaxRectsPackerTarget<T>>(width, height, 2, {
		smart: true,
		pot: false,
		square: false,
		allowRotation: false,
		tag: true
	});
	packer.addArray(tgts);
	const bins = packer.bins;

	// 一枚に収まらない場合があるので、もっとも画像を詰め込まれた bin を敷き詰め結果として返す。
	const bin = bins.reduce((a, b) => ((a.rects.length >= b.rects.length) ? a : b), bins[0]!);

	if (bin.rects.length <= 1) return null;
	return { width: bin.width, height: bin.height, rects: bin.rects };
}
