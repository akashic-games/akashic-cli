const webpack = require("webpack");
const path = require("path");

module.exports = {
	mode: "development",
	target: "node",
	entry: {
		"whatwg-fetch": "whatwg-fetch",
		app: "./src/client/bootstrapRoot.tsx",
		frame: "./src/client/bootstrap.tsx"
	},
	output: {
		path: path.resolve(__dirname, "../../www/public/js"),
		filename: "[name].index.js"
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
