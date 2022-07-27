const path = require("path");
const fs = require("fs");

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
	console.log("start to copy engineFiles.js");
	for (let key of Object.keys(versions)) {
		const entryPath = require.resolve(`ae${key}`);
		const rootPath = path.dirname(entryPath); // index.js と package.json が同層にあることが前提
		const version = require(path.join(rootPath, "package.json")).version;
		const fileName = `engineFilesV${version.replace(/[\.-]/g, "_")}.js`;
		const engineFilesPath = path.join(rootPath, `dist/raw/release/full/${fileName}`);

		versions[key].version = version;
		versions[key].fileName = fileName;

		const destPath = path.resolve(__dirname, "..", "www", "public", "external", fileName);
		if (fs.existsSync(destPath)) continue;
		fs.copyFileSync(engineFilesPath, destPath);
	}
	console.log("end to copy engineFiles.js");

	console.log("start to generate engineFilesVersion.json");
	const versionFIlePath = path.resolve(__dirname, "..", "config", "engineFilesVersion.json");
	fs.writeFileSync(versionFIlePath, JSON.stringify(versions, null, 2));
	console.log("end to generate files");
} catch (e) {
	console.error(e);
}
