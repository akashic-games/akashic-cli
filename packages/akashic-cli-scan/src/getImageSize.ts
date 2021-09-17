import * as fs from "fs";
import { extname } from "path";
import { imageSize } from "image-size";
import { parseSync } from "svgson";

export interface ISize {
	width: number | undefined;
	height: number | undefined;
}

const validSizeRegExp = /^(\d+)(?:px)?$/;

export function getImageSize(path: string): ISize | null {

	// NOTE: image-size は SVG ファイルのサイズとして常に viewPort を基準にしているようなので独自にサイズ情報を取得する
	if (extname(path) === ".svg") {
		const parsed = parseSync(fs.readFileSync(path, { encoding: "utf-8" }));
		const attr = parsed.attributes;

		// 1. ルートに width, height 属性が存在しない場合はサポート外
		if (attr.width == null || attr.height == null) {
			return null;
		}
		// 2. ルートの width, height が "px" 以外の単位の場合はサポート外
		if (!validSizeRegExp.test(attr.width) || !validSizeRegExp.test(attr.height)) {
			return null;
		}

		const width = parseInt(attr.width.replace(validSizeRegExp, "$1"), 10);
		const height = parseInt(attr.height.replace(validSizeRegExp, "$1"), 10);

		return {
			width,
			height
		};
	}

	return imageSize(path);
}
