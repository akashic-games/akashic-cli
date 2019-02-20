var path = require("path");
var fs = require("fs");

if (process.argv.length < 3) {
	console.error("Please enter command as follows: node generateAkashicVersionsFile.js version");
	console.error("ex: node generateAkashicVersionsFile.js v2");
	process.exit(1);
}

// バージョン取得
var version = process.argv[2];
if (! /^v[12]$/.test(version)) {
	console.error("please specify version(v1 or v2)");
	process.exit(1);
}

console.log(`generate versions file about ${version}`);
console.log("get version of each akashic-library");
var originalPackageJson = require(path.join(__dirname, "..", "templates", "template-export-html-" + version, "package.json"));
var libVersions = {};
["dependencies", "devDependencies", "optionalDependencies"].forEach(function(item) {
	for (var libName in (originalPackageJson[item] || {})) {
		libVersions[libName] = originalPackageJson[item][libName];
	}
});
var akashicLibDir = path.join(__dirname, "..", "templates", "template-export-html-" + version, "node_modules", "@akashic");
var akashicLibs = ["akashic-engine", "game-driver", "game-storage", "pdi-browser"];
var versions = {};
akashicLibs.forEach(function(libName) {
	var packageJson = require(path.join(akashicLibDir, libName, "package.json"));
	var keyName = "@akashic/" + libName;
	if (libVersions[keyName] !== packageJson["version"]) {
		console.error(`Expected ${keyName}@${packageJson["version"]} to be v${libVersions[keyName]}`);
		process.exit(1);
	}
	versions[keyName] = packageJson["version"];
	console.log(`${keyName}:${packageJson["version"]}`);
});

fs.writeFileSync(path.join(__dirname, "..", "templates", "template-export-html-" + version, "js", "versions.json"), JSON.stringify(versions, null, 2));
console.log("saved version of each akashic-library");
