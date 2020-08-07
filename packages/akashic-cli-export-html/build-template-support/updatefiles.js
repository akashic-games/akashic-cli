var UglifyJS = require('uglify-js');
var saveLicense = require('uglify-save-license');
var path = require("path");
var fs = require("fs");

function minify(code) {
	return UglifyJS.minify(code, {
		mangle: false,
		output: {
			comments: saveLicense,
			beautify: true
		}
	});
};

var templateName = process.argv[2];
if (!templateName) process.exit(1);

var files = [
	"node_modules/@akashic/game-storage/build/game-storage.js",
];

files.forEach(filepath => {
	const outputPath = path.resolve(__dirname, "../templates", templateName, "js", path.basename(filepath, ".js") + ".strip.js");
	// uglify-jsのminify関数は引数としてファイルパスではなくソースコード文字列を受け取る仕様になっているので、事前にソースコード文字列を取得する
	const code = fs.readFileSync(path.resolve(__dirname, "../templates", templateName, filepath)).toString();
	fs.writeFileSync(outputPath, minify(code).code);
});
