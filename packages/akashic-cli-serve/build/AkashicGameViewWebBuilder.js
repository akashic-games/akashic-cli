const browserify = require("browserify");
const saveLicense = require('uglify-save-license');
const UglifyJS = require('uglify-js');
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

function minify(filepath) {
	return UglifyJS.minify(filepath, {
		mangle: true,
		output: {
			comments: saveLicense
		},
		compress: {
			sequences: false
		}
	});
}

function build(inputFilePath, outputFilePath, propertyName) {
	const browserify = path.join(__dirname, "..", "node_modules", ".bin", "browserify");
	execSync(`${browserify} ${inputFilePath} -s ${propertyName} > ${outputFilePath}`);
	fs.writeFileSync(outputFilePath, minify(outputFilePath).code);
}

const inputPath = path.resolve(__dirname + "/../node_modules/@akashic/akashic-gameview-web/lib/index.js");
const outputPath = path.resolve(__dirname + "/../www/external/akashic-gameview-web.strip.js");
build(inputPath, outputPath, "agv");
