window.addEventListener("load", function() {
	var resource = new client.ResourceFactory();
	resource.createScriptAsset = function(id, assetPath) {
		return new SandboxScriptAsset(id, assetPath);
	}

	function onLoadGameConfiguration(asset) {
		if (!window.maxAge || window.maxAge != parseInt(window.maxAge) || window.maxAge <= 0) {
			window.alert("invalid maxAge:" + window.maxAge);
			return;
		}

		var conf = JSON.parse(asset.data);
		var browser = new client.BrowserGame("scene", conf.width, conf.height, document.getElementById("container"));

		// 扱えるパラメータ
		console.log("window.maxAge=" + window.maxAge);
		console.log("window.renderPerFrame=" + window.renderPerFrame);
		console.log("window.loopCount=" + window.loopCount);

		var game;
		var beginTime = +(new Date());
		if (window.renderPerFrame!==undefined && window.maxAge!==undefined) { // 他のパラメータはoptional
			game = new Game(conf, resource, "/test/");
			browser.start(game, "/test/");
			game.loopCount = window.loopCount!==undefined ? window.loopCount : game.loopCount;
			game.startCheck(window.maxAge, window.renderPerFrame, function() {
				var elapse = +(new Date()) - beginTime;
				document.location.href = "/next/?elapse=" + elapse;
			});
		} else {
			console.log("use derived Game class");
			game = new client.Game(conf, resource, "/test/");
			game.beforeTickTrigger.handle(function(age) {
				if (age == window.maxAge) {
					var elapse = +(new Date()) - beginTime;
					document.location.href = "/next/?elapse=" + elapse;
				}
			});
			browser.start(game, "/test/");
		}
	}

	resource.createTextAsset("", "./game.json")._load({
		_onAssetLoad: onLoadGameConfiguration,
		_onAssetError: function () {
			throw new Error("Could not read game.json");
		}
	});
});
client.AudioPluginRegistry.addPlugin(client.WebAudioPlugin, client.HTMLAudioPlugin);
window.KeyboardOperationPlugin = client.KeyboardOperationPlugin;
window.TestMouseFlickOperationPlugin = client.TestMouseFlickOperationPlugin;
