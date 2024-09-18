var foo = require("./foo");
var hoge = require("@hoge/testmodule/lib");

function main() {
	return {
		x: foo()
	};
}

module.exports = main;
