const path = require("path");
const fs = require("fs");
const { cat } = require("shelljs");
const execSync = require("child_process").execSync;

console.log("start to generate engineFilesVersion.json");
execSync('rm -f ./www/public/external/engineFilesV*.js');
const stdout = execSync('npm list --depth=0 --json');
const json = JSON.parse(stdout.toString());
const v1Version = json.dependencies.aev1.version;
const v2Version = json.dependencies.aev2.version;
const v3Version = json.dependencies.aev3.version;

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

