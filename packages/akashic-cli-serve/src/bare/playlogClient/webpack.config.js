const webpack = require("webpack");
const path = require("path");
const packageJson = require("./package.json");
const version = packageJson.version.replace(/[\.-]/g, "_");

module.exports = {
	mode: "development",
	target: "node",
	entry: path.resolve(__dirname, "index.ts"),
	output: {
		path: path.resolve(__dirname, "../../../www/public/external"),
		filename: `playlogClientV${version}.js`,
		library: `playlogClientV${version}`,
		libraryTarget: "umd",
		globalObject: "window"
	},
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: "ts-loader"
					}
				]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			"Promise": "es6-promise"
		})
	]
};
