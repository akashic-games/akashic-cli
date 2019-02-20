var path = require("path");
["v1", "v2"].forEach(function(version) {
	console.log(version + ": start to check akashic-library-version");
	var originalPackageJson = require(path.join(__dirname, "..", "templates", "template-export-html-" + version, "package.json"));
	var versions = {};
	["dependencies", "devDependencies", "optionalDependencies"].forEach(function(item) {
		for (var libName in (originalPackageJson[item] || {})) {
			versions[libName] = originalPackageJson[item][libName];
		}
	});
	var copiedVersionsJson = require(path.join(__dirname, "..", "templates", "template-export-html-" + version, "js", "versions.json"));
	for (var libName in copiedVersionsJson) {
		if (copiedVersionsJson[libName] !== versions[libName]) {
			console.error(`Expected ${libName}@${copiedVersionsJson[libName]} to be v${versions[libName]}`);
			process.exit(1);
		} else {
			console.log(`OK: ${libName}@${versions[libName]}`);
		}
	}
	console.log(`${version}: end to check akashic-library-version`);
});
console.log("complete to check akashic-library-version");
