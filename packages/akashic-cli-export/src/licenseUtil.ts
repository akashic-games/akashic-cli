import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cmn from "@akashic/akashic-cli-commons";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

interface LicenseInfo {
	name: string;
	type: string;
	licenseText: string;
}

export const LICENSE_TEXT_PREFIX  = "// For the library license, see library_license.txt.\n\n";

/**
 * ライブラリのライセンスファイルをまとめて library_license.txt へ書き出す
 *
 * @param source コンテンツの game.json があるディレクトリパス
 * @param dest 出力先
 * @param filePaths ファイルパスの配列
 * @param engineFilesVersion engineFiles のバージョン。akashic 関連のライセンス情報を含める場合に指定する
 */
export async function writeLicenseTextFile(
	source: string,
	dest: string,
	filePaths: string[],
	engineFilesVersion?: string
): Promise<boolean> {
	const libPkgJsonPaths = cmn.NodeModules.listPackageJsonsFromScriptsPath(source, filePaths);
	let licenseInfos = await makeLicenseInfo(source, libPkgJsonPaths);
	if (!engineFilesVersion && (!libPkgJsonPaths.length || !licenseInfos.length)) return false;

	if (engineFilesVersion) {
		const akashicLicenseInfos = await makeAkashicLibsLicenseInfo(engineFilesVersion);
		licenseInfos = [...licenseInfos, ...akashicLicenseInfos];
	}

	const textAry: string[] = [];
	licenseInfos.forEach(obj => {
		textAry.push(`# ${obj.name}`);
		textAry.push("");
		textAry.push(obj.licenseText);
	});
	const body = textAry.join("\n");

	cmn.Util.mkdirpSync(dest);
	fs.writeFileSync(path.resolve(dest, "library_license.txt"), body);
	return true;
}

async function makeAkashicLibsLicenseInfo(engineFilesVersion: string): Promise<LicenseInfo[]> {
	const rootPath = path.resolve(__dirname, "..", "..", "..");
	const headlessDriverPath = require.resolve("@akashic/headless-driver");
	const engineFilesPackageDir = path.dirname(require.resolve(`engine-files-v${engineFilesVersion}`, {paths: [headlessDriverPath]}));
	const engineFilesPackageJson = require(`${engineFilesPackageDir}/package.json`);

	const libNames = Object.keys(engineFilesPackageJson.dependencies);
	const libPkgJsonPaths = [];
	for (const name of libNames) {
		try {
			const libPath = require.resolve(path.join(name, "package.json"));
			libPkgJsonPaths.push(libPath);
		} catch (e) {
			// do noting
		}
	};
	return await makeLicenseInfo(rootPath, libPkgJsonPaths);
}

async function makeLicenseInfo(source: string, pkgJsonPaths: string[]): Promise<LicenseInfo[]> {
	const licenseInfos: LicenseInfo[] = [];
	for (const p of pkgJsonPaths) {
		const pkgJsonPath = path.resolve(source, p);
		const pkgJson = await cmn.FileSystem.readJSON<any>(pkgJsonPath);

		const files = fs.readdirSync(path.dirname(pkgJsonPath));
		const licenseFile = files.find((file) => {
			// 仕様上はあらゆる拡張子が許されているが、テキストファイルに取り込むのでここでは .txt と .md のみ考慮する
			if (/^LICEN[SC]E$/i.test(file) || /^LICEN[SC]E.(txt|md)$/i.test(file)) {
				return true;
			}
			// LICENSE-LGPL のようなファイルは機械的に扱えないので警告を出力
			if (/^LICEN[SC]E[^a-z]/i.test(file)) {
				console.warn(
					`[WARN]: Detected a license-like file "${file}" in ${pkgJson.name} but ignored (not included in library_license.txt) ` +
					"because akashic export doesn't know how it should be handled. You may need to follow the license by yourself."
				);
				return false;
			}
		});
		if (!licenseFile) continue;
		const licensePath = path.join(path.dirname(pkgJsonPath), licenseFile);

		if (fs.existsSync(licensePath) && isAutoIncludableLicense(pkgJson.name, pkgJson.license)) {
			let text = fs.readFileSync(licensePath, "utf-8");

			if (!/[\r\n|\n|\r]$/.test(text)) {
				text += "\n";
			};
			licenseInfos.push({
				name: pkgJson.name,
				type:pkgJson.license,
				licenseText: text
			});
		}
	};
	return licenseInfos;
}

function isAutoIncludableLicense(libName: string, license: string): boolean {
	// MIT/ISC 以外のライセンスは警告
	if (/(MIT|ISC)/i.test(license)) {
		return true;
	} else {
		console.warn(
			`[WARN]: The license of ${libName} will not be included in library_license.txt ` +
			`since akashic export doesn't know its license "${license}". You may need to follow the license by yourself.`
		);
		return false;
	}
}
