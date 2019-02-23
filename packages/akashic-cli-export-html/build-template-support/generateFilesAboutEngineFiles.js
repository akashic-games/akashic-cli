var path = require("path");
var fs = require("fs");
var fetch = require("node-fetch");
var execSync = require("child_process").execSync;

console.log("start to generate files");
var v1Version = execSync(`npm info @akashic/engine-files@for_ae1x version`).toString().replace("\n", "");
var v2Version = execSync(`npm info @akashic/engine-files@latest version`).toString().replace("\n", "");

console.log("start to generate engineFilesVersion.json");
var versions = {
	v1: v1Version,
	v2: v2Version
};
fs.writeFileSync(path.join(__dirname, "..", "templates", "engineFilesVersion.json"), JSON.stringify(versions, null, 2));
console.log("end to generate engineFilesVersion.json");

var promises = Object.keys(versions).map(majorVersion => {
	var fileName = `engineFilesV${versions[majorVersion].replace(/\./g, "_")}.js`;
	return Promise.resolve().then(() => {
		console.log(`start to download engineFiles (v${versions[majorVersion]})`);
		return fetch(`https://github.com/akashic-games/engine-files/releases/download/v${versions[majorVersion]}/${fileName}`);
	}).then(res => {
		return new Promise((resolve, reject) => {
			var fileName = `engineFilesV${versions[majorVersion].replace(/\./g, "_")}.js`;
			var fileStream = fs.createWriteStream(
				path.join(__dirname, "..", "templates", `template-export-html-${majorVersion}`, "js", fileName)
			);
			res.body.pipe(fileStream);
			res.body.on("error", (err) => {
				reject(err);
			});
			fileStream.on("finish", function() {
				resolve();
			});
		});
	}).then(() => {console.log(`end to download engineFiles (v${versions[majorVersion]})`);});
});
Promise.all(promises)
	.then(() => {console.log("end to generate files");})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
