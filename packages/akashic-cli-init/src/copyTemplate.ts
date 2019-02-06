import * as fs from "fs-extra";
import * as path from "path";
import { InitParameterObject } from "./InitParameterObject";
import { TemplateConfig, CopyListItem } from "./TemplateConfig";

/**
 * ローカルテンプレートをカレントディレクトリにコピーする
 */
export function copyTemplate(templateConfig: TemplateConfig, param: InitParameterObject): Promise<string> {
	return runTemplateConfig(templateConfig, param)
		.then(() => getGameJsonPath(templateConfig, param));
}

/**
 * TemplateConfig に従ってコピーする
 */
function runTemplateConfig(templateConfig: TemplateConfig, param: InitParameterObject): Promise<void> {
	const srcDirPath = path.join(param._realTemplateDirectory, param.type);
	const dstDirPath = param.cwd;
	if (templateConfig.files) {
		return Promise.resolve()
			.then(() => copyFiles(templateConfig.files, srcDirPath, dstDirPath, param));
	} else {
		return copyAllTemplateFiles(param);
	}
}

/**
 * 指定したファイルをコピーする
 */
function copyFiles(copyFiles: CopyListItem[], srcDir: string, dstDir: string, param: InitParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			if (!param.forceCopy) {
				const existFiles: string[] = [];
				copyFiles.forEach(file => {
					const destFile = file.dst ? path.join(file.dst, file.src) : file.src;
					if (fs.existsSync(path.join(dstDir, destFile))) {
						existFiles.push(destFile);
					}
				});
				if (existFiles.length > 0) {
					const errorMessage = `aborted to copy files, because followings already exist. [${existFiles.join(", ")}]`;
					reject(new Error(errorMessage));
					return;
				}
			}
			copyFiles.forEach(file => {
				const dest = file.dst || "";
				if (file.src.indexOf("..") !== -1 || (dest.indexOf("..") !== -1))
					throw(new Error("template.json has an invalid file name"));
				fs.copySync(
					path.join(srcDir, file.src),
					path.join(dstDir, dest, file.src),
					{clobber: param.forceCopy}
				);
				param.logger.info(`copied ${file.src}.`);
			});
		} catch (err) {
			reject(err);
			return;
		}
		resolve();
	});
}

/**
 * ディレクトリ以下のファイルを単純にコピーする。
 * - ディレクトリ直下の template.json は無視。
 * - ディレクトリ直下に game.json が存在する前提。
 */
function copyAllTemplateFiles(param: InitParameterObject): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const srcDirPath = path.join(param._realTemplateDirectory, param.type);
		const dstDirPath = param.cwd;
		fs.readdir(srcDirPath, (err, files) => {
			if (err) {
				reject(err);
				return;
			}
			if (!param.forceCopy) {
				const existFiles = files.filter(fileName => fs.existsSync(path.join(dstDirPath, fileName)));
				if (existFiles.length > 0) {
					const errorMessage = `aborted to copy files, because followings already exist. [${existFiles.join(", ")}]`;
					reject(new Error(errorMessage));
					return;
				}
			}
			try {
				files.forEach(fileName => {
					const srcPath = path.join(srcDirPath, fileName);
					const dstPath = path.join(dstDirPath, fileName);
					if (fileName !== "template.json") {
						fs.copySync(srcPath, dstPath, {clobber: param.forceCopy});
						param.logger.info(`copied ${fileName}.`);
					}
				});
			} catch (err) {
				reject(new Error(`failed to copy template`));
				return;
			}
			// const gameJsonPath = path.join(dstDirPath, "game.json");
			resolve();
		});
	});
}

/**
 * game.json の場所を取得する
 */
function getGameJsonPath(templateConfig: TemplateConfig, param: InitParameterObject): Promise<string> {
	const gameJsonPath = path.join(param.cwd, templateConfig.gameJson || "game.json");
	return Promise.resolve(gameJsonPath);
}
