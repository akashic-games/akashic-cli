const foo = require("./foo");

const main = () => {
	const array = [1, 2];
	array.includes(1);

	const obj1 = {a: 1, b: 2};
	const obj2 = {c: 10, d: 20};
	const obj3 = {...obj1, ...obj2};				

	return {
		x: foo()
	};
}

module.exports = main;
