import * as cmn from "@akashic/akashic-cli-commons";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

interface LicenseInfo { 
    name: string;
    type: string;
    licenseText: string;
}

export const LICENSE_TEXT_PREFIX  = "// For the library license, see thirdpary_license.txt.\n\n";

/**
 * ライブラリのライセンスファイルをまとめて thirdpary_license.txt へ書き出す
 * 
 * @param source コンテンツの game.json があるディレクトリパス
 * @param dest 出力先
 * @param filePaths ファイルパスの配列
 */
export function writeLicenseTextFile(source: string, dest: string, filePaths: string[]): boolean {
    const libPkgJsonPaths = cmn.NodeModules.listPackageJsonsFromScriptsPath(source, filePaths);
    const licenseInfos = makeLicenseInfo(source, libPkgJsonPaths);
    if (!libPkgJsonPaths.length || !licenseInfos.length) return false;

    let textAry: string[] = [];
    licenseInfos.forEach(obj => {
        textAry.push(`# ${obj.name}`);
        textAry.push("");
        textAry.push(obj.licenseText);
    });
    const body = textAry.join("\n");

    fs.writeFileSync(path.resolve(dest, "thirdpary_license.txt"), body);
    return true;
}

function makeLicenseInfo(source: string, pkgJsonPaths: string[]): LicenseInfo[] {
    const licenseInfos: LicenseInfo[] = [];
    pkgJsonPaths.forEach( p => {
        const pkgJsonPath = path.resolve(source, p);
        const pkgJson = require(pkgJsonPath);
        // LICENSE ファイルは root 直下のファイルを部分一致で取得
        const files = fs.readdirSync(path.dirname(pkgJsonPath));
        const licenseFile = files.find((file) => /LICENSE/.test(file));
        if (!licenseFile) return;
        const licensePath = path.join(path.dirname(pkgJsonPath), licenseFile);

        if (fs.existsSync(licensePath)) {
            const text = fs.readFileSync(licensePath, "utf-8");
            licenseInfos.push({
                name: pkgJson.name,
                type:pkgJson.license, 
                licenseText: text
            });
        }
    });
    return licenseInfos;
}
