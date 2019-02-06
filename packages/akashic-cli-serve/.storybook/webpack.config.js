const path = require("path");

module.exports = (config, env) => {
	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		include: path.resolve(__dirname, "../src/client"),
		use: [{
			loader: require.resolve("ts-loader")
		}]
	});
	config.module.rules.push({
		test: /\.css$/,
		include: path.resolve(__dirname, "../src/client"),
		use: [
			{
				loader: "style-loader"
			},
			{
				loader: "css-loader",
				options: {
					localIdentName: "[local]--[hash:base64:5]",
					modules: true
				}
			}
		]
	});
	config.resolve.extensions.push(".ts", ".tsx");
	return config;
};
