var path = require("path");
var fs = require("fs");
var fetch = require("node-fetch");
var execSync = require("child_process").execSync;

console.log("start to generate files");
var jsonPath = path.join(__dirname, "..", "config", "engineFilesVersion.json");
var currentVersions = {
	v1: {
		version: "",
		fileName: ""
	},
	v2: {
		version: "",
		fileName: ""
	}
};
if (fs.existsSync(jsonPath)) {
	currentVersions = require(jsonPath);
}
var v1Version = execSync(`npm info @akashic/engine-files@for_ae1x version`).toString().replace("\n", "");
var v2Version = execSync(`npm info @akashic/engine-files@latest version`).toString().replace("\n", "");

console.log("start to generate engineFilesVersion.json");
var versions = {
	v1: {
		version: v1Version,
		fileName: `engineFilesV${v1Version.replace(/\./g, "_")}.js`
	},
	v2: {
		version: v2Version,
		fileName: `engineFilesV${v2Version.replace(/\./g, "_")}.js`
	}
};
fs.writeFileSync(jsonPath, JSON.stringify(versions, null, 2));
console.log("end to generate engineFilesVersion.json");

// v1,v2のうち、バージョンが更新されたもののjsファイルのみをダウンロード
var promises = Object.keys(versions).filter(v => versions[v].version !== currentVersions[v].version).map(v  => {
	var version = versions[v].version;
	var fileName = versions[v].fileName;
	console.log(`start to download engineFiles (v${version})`);
	fetch(`https://github.com/akashic-games/engine-files/releases/download/v${version}/${fileName}`).then(res => {
		return new Promise((resolve, reject) => {
			var fileStream = fs.createWriteStream(path.join(__dirname, "..", "www", "external", fileName));
			res.body.pipe(fileStream);
			res.body.on("error", (err) => {
				reject(err);
			});
			fileStream.on("finish", () => {
				resolve();
			});
		});
	}).then(() => console.log(`end to download engineFiles (v${version})`));
});
Promise.all(promises)
	.then(() => console.log("end to generate files"))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
