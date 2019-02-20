var Prompt = require("prompt");

var originalPromptGet = null;
module.exports = {
	mock: function(config) {
		originalPromptGet = Prompt.get;
		Prompt.get = function(schema, func) {
			func(undefined, config);
		};
	},
	restore: function() {
		if (originalPromptGet) {
			Prompt.get = originalPromptGet;
			originalPromptGet = null;
		}
	}
}
