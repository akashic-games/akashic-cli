const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;

console.log("start to generate engineFilesVersion.json");
execSync('rm -f ./www/public/external/engineFilesV*.js');
const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8"));
const v1Version = json.devDependencies.aev1.split("@")[2];
const v2Version = json.devDependencies.aev2.split("@")[2];
const v3Version = json.devDependencies.aev3.split("@")[2];

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

		const engineFilePath = path.resolve(`./node_modules/ae${key}/dist/raw/release/full/${version.fileName}`);
		fs.copyFileSync(engineFilePath, dest);
	}
	console.log("end to copy engineFiles.js");
} catch(e) {
	console.error(e);
}