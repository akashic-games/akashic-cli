import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

// npm-shrinkwrap.json の生成中の実行を抑止する。generateShrinkwrapJson.js を参照
if (process.env.SKIP_SETUP) {
    process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const versions = {
	v1: {
		version: "",
		fileName: ""
	},
	v2: {
		version: "",
		fileName: ""
	},
	v3: {
		version: "",
		fileName: ""
	}
};

try {
	console.log("start to copy engineFiles");
	for (let key of Object.keys(versions)) {
		const entryPath = require.resolve(`engine-files-${key}`);
		const rootPath = path.dirname(entryPath); // index.js と package.json が同層にあることが前提
		const version = require(path.join(rootPath, "package.json")).version;
		const fileName = `engineFilesV${version.replace(/[\.-]/g, "_")}.js`;
		const engineFilesPath = path.join(rootPath, `dist/raw/debug/full/${fileName}`);

		versions[key].version = version;
		versions[key].fileName = fileName;

		const destPath = path.resolve(__dirname, "..", "www", "public", "external", fileName);
		fs.copyFileSync(engineFilesPath, destPath);
	}
	console.log("end to copy engineFiles");

	console.log("start to generate engineFilesVersion.json");
	const versionFilePath = path.resolve(__dirname, "..", "config", "engineFilesVersion.json");
	const versionFileDir = path.dirname(versionFilePath);
	if (!fs.existsSync(versionFileDir)) {
		fs.mkdirSync(versionFileDir);
	}
	fs.writeFileSync(versionFilePath, JSON.stringify(versions, null, 2));
	console.log("end to generate files");
} catch (e) {
	console.error(e);
	process.exit(1);
}
