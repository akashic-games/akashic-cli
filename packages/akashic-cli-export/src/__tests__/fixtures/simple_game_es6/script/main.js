const foo = require("./foo");

const main = () => {
	const x = 3 ** 2;
	return {
		x: foo()
	};
}

module.exports = main;
