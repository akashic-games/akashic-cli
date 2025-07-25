import { createRequire } from "module";
import path from "path";

export type SandboxRuntimeVersion = "1" | "2" | "3";

const require = createRequire(import.meta.url);

export function resolveEngineFilesVariable(version: SandboxRuntimeVersion): string {
	let engineFilesVariable: string = "";
	if (version === "3" && process.env.ENGINE_FILES_V3_PATH) {
		const filename = path.basename(process.env.ENGINE_FILES_V3_PATH, ".js");
		engineFilesVariable = filename.replace(/[\.-]/g, "_");
	} else {
		const engineFilesPkgJson = require(`engine-files-v${version}/package.json`);
		engineFilesVariable = `engineFilesV${engineFilesPkgJson.version.replace(/[\.-]/g, "_")}`;
	}
	return engineFilesVariable;
}

export function resolveEngineFilesPath(version: SandboxRuntimeVersion): string {
	let engineFilesPath: string = "";
	if (version === "3" && process.env.ENGINE_FILES_V3_PATH) {
		engineFilesPath = path.resolve(process.cwd(), process.env.ENGINE_FILES_V3_PATH);
	} else {
		const engineFilesName = resolveEngineFilesVariable(version);
		const libName = `engine-files-v${version}`;
		const engineFilesPackagePath = path.dirname(require.resolve(libName, { paths: [require.resolve("@akashic/headless-driver")] }));
		engineFilesPath = path.join(engineFilesPackagePath, `dist/raw/debug/full/${engineFilesName}.js`);
	}
	return engineFilesPath;
}
