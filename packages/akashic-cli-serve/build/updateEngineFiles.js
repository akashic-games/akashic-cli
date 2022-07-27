const path = require("path");
const fs = require("fs");

console.log("start to generate engineFilesVersion.json");
const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8"));
let v1Version = "";
let v2Version = "";
let v3Version = "";

for (let key of Object.keys(json.devDependencies)) {
	const value = json.devDependencies[key];
	if (/^npm:@akashic\/engine\-files@1\.\d+\.\d+/.test(value)) {
		v1Version = value.split("@")[2];
	}
	if (/^npm:@akashic\/engine\-files@2\.\d+\.\d+/.test(value)) {
		v2Version = value.split("@")[2];
	}
	if (/^npm:@akashic\/engine\-files@3\.\d+\.\d+/.test(value)) {
		v3Version = value.split("@")[2];
	}
};

const versions = {
	v1: {
		version: v1Version,
		fileName: `engineFilesV${v1Version.replace(/[\.-]/g, "_")}.js`
	},
	v2: {
		version: v2Version,
		fileName: `engineFilesV${v2Version.replace(/[\.-]/g, "_")}.js`
	},
	v3: {
		version: v3Version,
		fileName: `engineFilesV${v3Version.replace(/[\.-]/g, "_")}.js`
	}
};

const versionFIlePath = path.resolve(__dirname, "..", "config", "engineFilesVersion.json");
fs.writeFileSync(versionFIlePath, JSON.stringify(versions, null, 2));
console.log("end to generate files")

try {
	console.log("start to copy engineFiles.js");
	for (let key of Object.keys(versions)) {
		const version = versions[key];
		const dest = path.resolve(__dirname, "..", "www", "public", "external", version.fileName);
		if (fs.existsSync(dest)) continue;

		const engineFilePath = path.resolve(`./node_modules/ae${key}/dist/raw/release/full/${version.fileName}`);
		fs.copyFileSync(engineFilePath, dest);
	}
	console.log("end to copy engineFiles.js");
} catch(e) {
	console.error(e);
}
