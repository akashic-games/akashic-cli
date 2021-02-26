var external = require("external");
var json = require("../text/test.json");

function main() {
	return {
		x: external(),
		y: json.value
	};
}

module.exports = main;
