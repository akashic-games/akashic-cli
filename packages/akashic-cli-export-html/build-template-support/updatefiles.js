var UglifyJS = require('uglify-js');
var saveLicense = require('uglify-save-license');
var path = require("path");
var fs = require("fs");

function minify(filepath) {
	return UglifyJS.minify(filepath, {
		mangle: false,
		output: {
			comments: saveLicense,
			beautify: true
		}
	});
};

var templateName = process.argv[2];
if (!templateName) process.exit(1);

var target = process.argv[3];

var files;
switch (target) {
	case "all":
		files = [
			"js/akashic-engine.js",
			"node_modules/@akashic/game-driver/build/game-driver.js",
			"node_modules/@akashic/game-storage/build/game-storage.js",
			"node_modules/@akashic/pdi-browser/build/pdi-browser.js"
		];
		break;
	case "engine":
		files = ["js/akashic-engine.js"];;
		break;
	default:
		process.exit(1);
}

files.forEach(filepath => {
	const outputPath = path.resolve(process.cwd(), "../../templates", templateName, "js", path.basename(filepath, ".js") + ".strip.js");
	fs.writeFileSync(outputPath, minify(filepath).code);
});
