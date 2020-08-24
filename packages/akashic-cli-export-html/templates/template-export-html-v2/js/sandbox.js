window.addEventListener("load", function() {

	start("exportHTML");

	function start(gamePath) {
		// TODO WebGL有効化
		// // webgl=1でRendererを問答無用でWebGLのみにする
		// if (getParameterByName("webgl")) {
		// 	conf.renderers = ["webgl"];
		// }

		// 本来であればgameIdはBIGINTとして扱われるので数値だけども、export html用なのでgamePathをそのまま使う
		var sandboxGameId = gamePath;
		var sandboxPlayer = { id: "9999", name: "sandbox-player" };
		var sandboxPlayId = "sandboxDummyPlayId";
		var storage = new gameStorage.GameStorage(window.localStorage, { gameId: sandboxGameId });

		var pdiBrowser = engineFiles.pdiBrowser;
		var gdr = engineFiles.gameDriver;

		var amflowClient = new gdr.MemoryAmflowClient({
			playId: sandboxPlayId,
			putStorageDataSyncFunc: storage.set.bind(storage),
			getStorageDataSyncFunc: function (readKeys) {
				var svs = storage.load(readKeys);
				// StorageValue[][]からStorageData[]に変換する
				// TODO: StorageValue[][]が返ってくる必然性はない。game-storage側の仕様を変えるべき。
				return readKeys.map(function (k, i) { return { readKey: k, values: svs[i] }; });
			}
		});

		if (window.__akashic__.autoSendEventName === true || typeof window.__akashic__.autoSendEventName === "string") {
			var sandboxConfig = window.__akashic__.sandboxConfigFunc();
			var autoSendEventName = window.__akashic__.autoSendEventName;
			if (autoSendEventName === true) {
			  autoSendEventName = sandboxConfig.autoSendEventName || sandboxConfig.autoSendEvents;
			}
			if (!!sandboxConfig && autoSendEventName && sandboxConfig.events && sandboxConfig.events[autoSendEventName]) {
				sandboxConfig.events[autoSendEventName].forEach(function (ev){amflowClient.sendEvent(ev)});
			}
		}

		var audioPlugins;
		if (location.protocol !== "file:") {
			// 特にSafariの制約(user activationなしでは音が鳴らない)回避のため、可能ならWebAudioを使う
			audioPlugins = [pdiBrowser.WebAudioPlugin, pdiBrowser.HTMLAudioPlugin];
		} else {
			// file:の場合ブラウザによってCORSの制約にひっかかるWebAudioは避ける
			audioPlugins = [pdiBrowser.HTMLAudioPlugin];
		}
		var pf = new pdiBrowser.Platform({
			amflow: amflowClient,
			containerView: document.getElementById("container"),
			audioPlugins: audioPlugins
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
			return new LocalScriptAsset(id, assetPath);
		};

		var createTextAsset = function(id, assetPath) {
			return new LocalTextAsset(id, assetPath);
		};
		if (typeof LocalTextAsset !== "undefined") {
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
			driver.startGame();
		});
	}
});
