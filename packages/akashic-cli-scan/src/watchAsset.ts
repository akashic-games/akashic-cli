import * as path from "path";
import * as chokidar from "chokidar";
import type { ScanAssetParameterObject} from "./scanAsset.js";
import { scanAsset, _completeScanAssetParameterObject } from "./scanAsset.js";
import { audioAssetFilter, imageAssetFilter } from "./scanUtils.js";



function scanAssetWithCallback(param: ScanAssetParameterObject, cb: (error: Error | null) => void): void {
	scanAsset(param).then(() => cb(null)).catch(cb);
}

export function watchAsset(p: ScanAssetParameterObject, cb: (err: Error | null) => void): void {
	const param = _completeScanAssetParameterObject(p);

	param.logger.info("Start Watching Directories of Asset");
	const watcher = chokidar.watch(param.cwd, { persistent: true, ignoreInitial: true, ignored: "**/node_modules/**/*" });
	const handler = (filePath: string): void => {
		if (
			param.assetScanDirectoryTable.image.some(dir => filePath.indexOf(path.join(param.cwd, dir)) !== -1)
			|| param.assetScanDirectoryTable.audio.some(dir => filePath.indexOf(path.join(param.cwd, dir)) !== -1)
			|| param.assetScanDirectoryTable.script.some(dir => filePath.indexOf(path.join(param.cwd, dir)) !== -1)
			|| param.assetScanDirectoryTable.text.some(dir => filePath.indexOf(path.join(param.cwd, dir)) !== -1)
			|| filePath.indexOf(path.join(param.cwd, "assets")) !== -1 // akashic-cli-scanではassetsディレクトリもasset用のディレクトリとして扱われる
		) {
			scanAssetWithCallback(param, cb);
		}
	};
	const changeHandler = (filePath: string): void => {
		// スクリプトやテキストは変更してもgame.jsonに記載されている情報に影響が無いので、changeではimageアセットとaudioアセットのみ対象とする。
		if (
			param.assetScanDirectoryTable.image.some(dir => filePath.indexOf(path.join(param.cwd, dir)) !== -1)
			|| param.assetScanDirectoryTable.audio.some(dir => filePath.indexOf(path.join(param.cwd, dir)) !== -1)
			|| (filePath.indexOf(path.join(param.cwd, "assets")) !== -1 && (audioAssetFilter(filePath) || imageAssetFilter(filePath)))
		) {
			scanAssetWithCallback(param, cb);
		}
	};
	// watch開始時にgame.jsonのasstesの内容と実際のアセットの内容に誤差が無いかの確認を兼ねてscanAsset関数を実行する
	watcher.on("ready", () => {
		scanAssetWithCallback(param, cb);
	});
	watcher.on("add", handler);
	watcher.on("unlink", handler);
	watcher.on("change", changeHandler);
}
