import * as cmn from "@akashic/akashic-cli-commons";
import * as fs from "fs";
import * as path from "path";

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
export async function writeLicenseTextFile(source: string, dest: string, filePaths: string[]): Promise<boolean> {
    const libPkgJsonPaths = cmn.NodeModules.listPackageJsonsFromScriptsPath(source, filePaths);
    const licenseInfos = await makeLicenseInfo(source, libPkgJsonPaths);
    if (!libPkgJsonPaths.length || !licenseInfos.length) return false;

    let textAry: string[] = [];
    licenseInfos.forEach(obj => {
        textAry.push(`# ${obj.name}`);
        textAry.push("");
        textAry.push(obj.licenseText);
    });
    const body = textAry.join("\n");

    cmn.Util.mkdirpSync(dest);
    fs.writeFileSync(path.resolve(dest, "thirdpary_license.txt"), body);
    return true;
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
            if (/LICENSE\-\w+$/i.test(file)) {
                console.warn(`[WARNING]: The license of ${pkgJson.name} will not be included in thirdparty_license.txt since akashic export doesn't know its license file name "${file}".You may need to follow the license by yourself.`);
                return false;
            }
        });
        if (!licenseFile) continue;
        const licensePath = path.join(path.dirname(pkgJsonPath), licenseFile);

        if (fs.existsSync(licensePath) && validateLicense(pkgJson.name, pkgJson.license)) {
            const text = fs.readFileSync(licensePath, "utf-8");
            licenseInfos.push({
                name: pkgJson.name,
                type:pkgJson.license, 
                licenseText: text
            });
        }
    };
    return licenseInfos;
}

function validateLicense(libName: string, license: string): boolean {
    // MIT/ISC 以外のライセンスは警告
    if (!/(MIT|ISC)/i.test(license)) {
        console.warn(`[WARNING]: The license of ${libName} will not be included in thirdparty_license.txt since akashic export doesn't know its license "${license}". You may need to follow the license by yourself.`);
        return false;
    }

    return true;
}
