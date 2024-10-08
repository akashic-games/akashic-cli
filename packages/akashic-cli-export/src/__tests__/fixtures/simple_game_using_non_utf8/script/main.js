var foo = require("./foo");

module.exports = function () {
	return {
		y: foo()
	};
}
