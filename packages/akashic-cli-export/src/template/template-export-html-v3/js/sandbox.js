window.addEventListener("load", function() {

	start();

	function start() {
		// TODO WebGL有効化
		// // webgl=1でRendererを問答無用でWebGLのみにする
		// if (getParameterByName("webgl")) {
		// 	conf.renderers = ["webgl"];
		// }

		var sandboxPlayer = { id: "9999", name: "sandbox-player" };
		var sandboxPlayId = "sandboxDummyPlayId";

		var pdiBrowser = engineFiles.pdiBrowser;
		var gdr = engineFiles.gameDriver;

		var amflowClient = new gdr.MemoryAmflowClient({
			playId: sandboxPlayId
		});

		var sandboxConfig;
		if (window.__akashic__.autoSendEventName === true || typeof window.__akashic__.autoSendEventName === "string") {
			sandboxConfig = window.__akashic__.sandboxConfigFunc();
			var autoSendEventName = window.__akashic__.autoSendEventName;
			if (autoSendEventName === true) {
			  autoSendEventName = sandboxConfig.autoSendEventName || sandboxConfig.autoSendEvents;
			}
			if (!!sandboxConfig && autoSendEventName && sandboxConfig.events && sandboxConfig.events[autoSendEventName]) {
				sandboxConfig.events[autoSendEventName].forEach(function (ev){amflowClient.sendEvent(ev)});
			}
		}

		var gameArguments;
		if (window.__akashic__.autoGivenArgsName) { 
			if (!sandboxConfig) 
				sandboxConfig = window.__akashic__.sandboxConfigFunc();
			gameArguments = sandboxConfig.arguments[window.__akashic__.autoGivenArgsName];
		}

		var audioPlugins;
		if (location.protocol !== "file:") {
			// 特にSafariの制約(user activationなしでは音が鳴らない)回避のため、可能ならWebAudioを使う
			audioPlugins = [pdiBrowser.WebAudioPlugin, pdiBrowser.HTMLAudioPlugin];
		} else {
			// file:の場合ブラウザによってCORSの制約にひっかかるWebAudioは避ける
			audioPlugins = [pdiBrowser.HTMLAudioPlugin];
		}
		var elem = document.getElementById("container");
		var pf = new pdiBrowser.Platform({
			amflow: amflowClient,
			containerView: elem,
			audioPlugins: audioPlugins,
			// iframe 下の場合 preventDefault すると iframe 領域外での mousemove が通知されなくなってしまうので無効化
			disablePreventDefault: true
		});
		elem.addEventListener("touchstart", function (ev) {
			// disablePreventDefault の場合 touchstart のデフォルト処理を止めないと mousestart が二重になる場合がある
			ev.preventDefault();
		});

		pf.loadGameConfiguration = function(url, callback) {
			try {
				var gameJsonText = window.gLocalAssetContainer["game.json"];
				gameJsonText = decodeURIComponent(gameJsonText);
				callback(null, JSON.parse(gameJsonText));
			} catch(error) {
				callback(error, null);
			}
		};

		pf._resourceFactory.createScriptAsset = function(id, assetPath) {
			return new LocalScriptAssetV3(id, assetPath);
		};

		var createTextAsset = function(id, assetPath) {
			return new LocalTextAssetV3(id, assetPath);
		};
		if (typeof LocalTextAssetV3 !== "undefined") {
			pf._resourceFactory.createTextAsset = createTextAsset;
		}

		driver = new gdr.GameDriver({
			platform: pf,
			player: sandboxPlayer,
			errorHandler: function (e) { console.log("ERRORHANDLER:", e); }
		});

		driver.gameCreatedTrigger.add(function (game) {
			if (window.optionProps.magnify) {
				resize(game);
				window.addEventListener("resize", function() {
					resize(game);
				});
			}
			injectGameExternalStorage(game);
		});

		function resize(game) {
			if (!pf.containerController) return;
			var viewportSize = {
				width: window.innerWidth || document.documentElement.clientWidth,
				height: window.innerHeight || document.documentElement.clientHeight
			};
			var gameScale = Math.min(
				viewportSize.width / game.width,
				viewportSize.height / game.height
			);
			var gameSize = {
				width: Math.floor(game.width * gameScale),
				height: Math.floor(game.height * gameScale)
			};
			pf.containerController.changeScale(gameScale, gameScale);
			var gameOffset = {
				x: Math.floor((viewportSize.width - gameSize.width) / 2),
				y: Math.floor((viewportSize.height - gameSize.height) / 2)
			};
			pf.containerController.inputHandlerLayer.setOffset(gameOffset);
		}

		driver.initialize({
			configurationUrl: "game.json",
			assetBase: "./",
			gameArgs: gameArguments,
			driverConfiguration: {
				playId: sandboxPlayId,
				playToken: "dummyToken",
				executionMode: gdr.ExecutionMode.Active
			},
			loopConfiguration: {
				loopMode: gdr.LoopMode.Realtime
			}
		}, function (e) {
			if (e) {
				throw e;
			}
			setAtsumaruHook();
			driver.startGame();
		});

		function setAtsumaruHook() {
			try {
				if (typeof window !== "undefined" && window.RPGAtsumaru) {
					var volume = window.RPGAtsumaru.volume.getCurrentValue();
					pf.setMasterVolume(volume);
					window.RPGAtsumaru.volume.changed.subscribe(function(newVolume) {
						pf.setMasterVolume(newVolume);
					});
	
					window.RPGAtsumaru.screenshot.setScreenshotHandler(function() {
						var canvas = pf.getPrimarySurface().canvas;
						var pngData = canvas.toDataURL("image/png");
						return Promise.resolve(pngData);
					});
				}
			} catch (error) {
				console.error(error);
			}
		}

		function injectGameExternalStorage(game) {
			// TODO: game.external.contentStorage に GameExternalStorage を inject する。
		}
	}
});
