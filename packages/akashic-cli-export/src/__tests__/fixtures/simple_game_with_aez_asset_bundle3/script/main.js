var foo = require("./foo");
var json = require("../text/test.json");
var hogeA = require("@hoge/testmodule/lib/ModuleA");

function main() {
	hogeA();
	return {
		x: foo(),
		y: json.value
	};
}

module.exports = main;
