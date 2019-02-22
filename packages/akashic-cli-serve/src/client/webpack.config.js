const webpack = require("webpack");
const path = require("path");

module.exports = {
	mode: "development",
	target: "node",
	entry: ["whatwg-fetch", "./src/client/bootstrap.tsx"],
	output: {
		path: path.resolve(__dirname, "../../www/js"),
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
						loader: "style-loader"
					}, {
						loader: "css-loader",
						options: {
							localIdentName: "[local]--[hash:base64:5]",
							modules: true
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
