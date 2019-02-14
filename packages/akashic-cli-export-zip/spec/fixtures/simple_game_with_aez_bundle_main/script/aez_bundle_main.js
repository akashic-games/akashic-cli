var foo = require("./foo");
var json = require("../text/test.json");

function main() {
	return {
		x: foo(),
		y: json.value
	};
}

module.exports = main;
