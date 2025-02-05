var external = require("external");
var foo = require("foo");
var hoge = require("hoge");
var json = require("../text/test.json");

foo();
hoge();

function main() {
	return {
		x: external(),
		y: json.value
	};
}

module.exports = main;
