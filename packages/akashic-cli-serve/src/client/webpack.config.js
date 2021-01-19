const webpack = require("webpack");
const path = require("path");

module.exports = {
	mode: "development",
	target: "node",
	entry: ["whatwg-fetch", "./src/client/bootstrap.tsx"],
	output: {
		path: path.resolve(__dirname, "../../www/public/js"),
		filename: "index.js"
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader"
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader",
						options: { esModule: false }
					}, {
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: "[local]--[hash:base64:5]"
							}
						}
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
