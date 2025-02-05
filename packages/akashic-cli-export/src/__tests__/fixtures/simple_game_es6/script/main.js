const foo = require("./foo");

const _hoge = 3 ** 2;

const main = () => {
	return {
		x: foo()
	};
}

module.exports = main;
