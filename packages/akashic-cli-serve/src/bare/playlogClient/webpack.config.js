const webpack = require("webpack");
const path = require("path");

module.exports = {
	mode: "development",
	target: "node",
	entry: "./src/bare/playlogClient/index.ts",
	output: {
		path: path.resolve(__dirname, "../../../www/public/external"),
		filename: "playlogClientV0_0_1.js",
		library: "playlogClientV0_0_1",
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
