const path = require("path");

module.exports = ({config}) => {
	// Remove the existing css rule
	// See: https://github.com/storybookjs/storybook/issues/6319
	config.module.rules = config.module.rules.filter(f => f.test.toString() !== '/\\.css$/');

	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		loaders: [require.resolve("ts-loader")],
		include: [
			path.resolve(__dirname, "../src/client"),
			path.resolve(__dirname, "../src/common")
		]
	});

	config.module.rules.push({
		test: /\.css$/,
		loaders: [
			require.resolve("style-loader"),
			{
				loader: require.resolve("css-loader"),
				options: {
					modules: {
						localIdentName: "[local]--[hash:base64:5]"
					},
				},
			},
		],
		include: [
			path.resolve(__dirname, "../src/client"),
			path.resolve(__dirname, "../src/common")
		]
	});
	config.resolve.extensions.push(".ts", ".tsx");
	return config;
};
