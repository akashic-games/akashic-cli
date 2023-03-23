import * as fs from "fs";
import * as path from "path";
import type { ModuleMainScriptsMap } from "@akashic/game-configuration";

export function MockListModuleMainScripts(packageJsonFiles: string[]): ModuleMainScriptsMap {
    if (packageJsonFiles.length === 0) return {};
    const moduleMainScripts: any = {};

    for (let i = 0; i < packageJsonFiles.length; i++) {
        const packageJsonFile = packageJsonFiles[i];
        const packageJsonData = fs.readFileSync(packageJsonFile, "utf-8");
        let mainScript: string = "";
        let moduleName: string = "";
        try {
            const d = JSON.parse(packageJsonData);
            // NOTE: 本来のロジック require.resolve が mock できないためテスト用に拡張子を返すだけのロジックへ
            const mainScriptName = d.main.split(".").pop() === "js" ? d.main : d.main + ".js";
            mainScript = path.join(path.dirname(packageJsonFile), mainScriptName);
            moduleName = d.name;
        } catch (e) {
        }
        if (moduleName && moduleName !== "" && mainScript && mainScript !== "") {
            moduleMainScripts[moduleName] = mainScript.replace(/\\/g, "/");
        }
    }
    return moduleMainScripts;
}
    