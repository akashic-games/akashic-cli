var MockTemplateFile = function (obj) {
	this._obj = obj;
};

MockTemplateFile.prototype.load = function () {
	return Promise.resolve();
};

MockTemplateFile.prototype.save = function () {
	return Promise.resolve();
};

MockTemplateFile.prototype.isValidKey = function (key) {
	return !!this._obj[key];
};

MockTemplateFile.prototype.isValidValue = function (key, value) {
	return true;
};

MockTemplateFile.prototype.getItem = function (key) {
	return Promise.resolve(this._obj[key]);
};

MockTemplateFile.prototype.setItem = function (key, value) {
	this._obj[key] = value;
	return Promise.resolve();
};

MockTemplateFile.prototype.deleteItem = function (key) {
	delete this._obj[key];
	return Promise.resolve();
};

module.exports = MockTemplateFile;
