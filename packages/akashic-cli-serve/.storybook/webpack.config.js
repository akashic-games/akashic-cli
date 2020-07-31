const path = require("path");

module.exports = (config, env) => {
	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		include: [
			path.resolve(__dirname, "../src/client"),
			path.resolve(__dirname, "../src/common")
		],
		use: [{
			loader: require.resolve("ts-loader")
		}]
	});
	config.module.rules.push({
		test: /\.css$/,
		include: [
			path.resolve(__dirname, "../src/client"),
			path.resolve(__dirname, "../src/common")
		],
		use: [
			{
				loader: "style-loader"
			},
			{
				loader: "css-loader",
				options: {
					modules: {
						localIdentName: "[local]--[hash:base64:5]"
					}
				}
			}
		]
	});
	config.resolve.extensions.push(".ts", ".tsx");
	return config;
};
