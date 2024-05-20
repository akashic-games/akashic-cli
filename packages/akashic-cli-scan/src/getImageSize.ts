import * as fs from "fs";
import { basename, extname } from "path";
import { imageSize } from "image-size";
import { parseSync } from "svgson";

export interface ISize {
	width: number | undefined;
	height: number | undefined;
}

const validSizeRegExp = /^(\d+(:?\.\d+)?)(?:px)?$/;

export function getImageSize(path: string): ISize | null {

	// NOTE: image-size は SVG ファイルのサイズとして常に viewPort を基準にしているようなので独自にサイズ情報を取得する
	if (extname(path) === ".svg") {
		const parsed = parseSync(fs.readFileSync(path).toString("utf-8"));
		const attr = parsed.attributes;

		// 1. ルートに width, height 属性が存在しない場合はサポート外
		if (attr.width == null || attr.height == null) {
			return null;
		}
		// 2. ルートの width, height が "px" 以外の単位の場合はサポート外
		if (!validSizeRegExp.test(attr.width) || !validSizeRegExp.test(attr.height)) {
			return null;
		}

		// 3. サブピクセルの場合は小数点以下を切り捨て
		const width = parseInt(attr.width.replace(validSizeRegExp, "$1"), 10);
		const height = parseInt(attr.height.replace(validSizeRegExp, "$1"), 10);

		return {
			width,
			height
		};
	}

	let size: ISize | null = null;
	try {
		size = imageSize(path);
	} catch (e) {
		// CMYK ベースのカラープロファイル画像の場合、image-size でエラーとなる。エラーメッセージがわかりにくいためメッセージを差し替え。
		if (e.message === "Corrupt JPG, exceeded buffer limits") {
			const message = `Failed to get image size of ${basename(path)}. The image may not be in sRGB format.`;
			throw new Error(message);
		}
		throw e;
	}
	return size;
}
