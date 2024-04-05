window.addEventListener("load", function() {
	var devMode = !(window.location.search.indexOf("devmode=disable") >= 0);

	// copy from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
	// fps=xを抽出するための適当なコード
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	function getGamePath(callback) {
		// ゲームのパスからgameIdを生成する
		var xhr = new XMLHttpRequest();
		xhr.open("get", "/basepath/", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				callback(xhr.responseText);
			}
		};
		xhr.send();
	}

	getGamePath(start);

	function fitToWindow(center) {
		var pf = window.sandboxDeveloperProps.driver._platform;
		if (!pf.containerController) return;
		var parentView = document.getElementById("container").parentElement;
		parentView.style.margin = "0px";
		parentView.style.padding = "0px";
		parentView.style.overflow = "hidden";
		var viewportSize = {
			width: window.innerWidth || document.documentElement.clientWidth,
			height: window.innerHeight || document.documentElement.clientHeight
		};
		fitToSize(viewportSize, center);
	}

	function revertViewSize() {
		var pf = window.sandboxDeveloperProps.driver._platform;
		var parentView = document.getElementById("container").parentElement;
		parentView.style.margin = window.sandboxDeveloperProps.utils.defaultStyle.margin;
		parentView.style.padding = window.sandboxDeveloperProps.utils.defaultStyle.padding;
		parentView.style.overflow = window.sandboxDeveloperProps.utils.defaultStyle.overflow;
		fitToSize(window.sandboxDeveloperProps.utils.defaultSize);
	}

	function fitToSize(viewportSize, center) {
		var pf = window.sandboxDeveloperProps.driver._platform;
		var game = window.sandboxDeveloperProps.game;
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
			x: !!center ? Math.floor((viewportSize.width - gameSize.width) / 2) : 0,
			y: !!center ? Math.floor((viewportSize.height - gameSize.height) / 2) : 0
		};
		pf.containerController.inputHandlerLayer.setOffset(gameOffset);
	}

	function start(gamePath) {
		// TODO WebGL有効化
		// // webgl=1でRendererを問答無用でWebGLのみにする
		// if (getParameterByName("webgl")) {
		// 	conf.renderers = ["webgl"];
		// }

		// 本来であればgameIdはBIGINTとして扱われるので数値だけども、とりあえずmd5を使う
		var sandboxGameId = md5(gamePath);
		var sandboxPlayer = { id: "9999", name: "sandbox-player" };
		var sandboxPlayId = "sandboxDummyPlayId";
		var sandboxConfig = window.sandboxDeveloperProps.sandboxConfig;

		window.sandboxDeveloperProps = {
			game: null,
			driver: null,
			amflow: null,
			gameId: sandboxGameId,
			path: gamePath,
			sandboxPlayer: sandboxPlayer,
			sandboxConfig: sandboxConfig,
			utils: {
				fitToWindow: fitToWindow,
				revertViewSize: revertViewSize,
				defaultSize: {
					width: null,
					height: null
				},
				defaultStyle: {
					margin: null,
					padding: null,
					overflow: null
				}
			}
		};

		// preventDefaultを抑制するかを確認するためだけにLocalStorageの設定を読み込む
		var disablePreventDefault = false;
		if (devMode && ("localStorage" in window)) {
			var saved = JSON.parse(localStorage.getItem("akashic-sandbox-config"));
			if (saved) {
				disablePreventDefault = !!saved.disablePreventDefault;
			}
		}

		var pdiBrowser = engineFiles.pdiBrowser;
		var gdr = engineFiles.gameDriver;

		// var executionMode = gdr.ExecutionMode.Active;
		var playlogName = getParameterByName("playlog");

		var playlog;
		if (playlogName) {
			var playlogStr = localStorage.getItem("akpl:" + sandboxGameId + "/" + playlogName);
			if (playlogStr) {
				playlog = JSON.parse(playlogStr);
			} else {
				console.log("cannot load playlog: " + playlogName);
			}
		}

		var amflowClient = new gdr.MemoryAmflowClient({
			playId: sandboxPlayId,
			tickList:  playlog ? playlog.tickList : null,
			startPoints: playlog ? playlog.startPoints : null
		});
		var isReplay = !!playlog;
		var replayDuration = null;
		if (isReplay) {
			var fps = playlog.startPoints[0].data.fps;
			var replayLastTime = null;
			var replayLastAge = playlog.tickList[1];
			var ticksWithEvents = playlog.tickList[2];
			loop: for (var i = ticksWithEvents.length - 1; i >= 0; --i) {
				var tick = ticksWithEvents[i];
				var pevs = tick[1];
				for (var j = 0; j < pevs.length; ++j) {
					if (pevs[j][0] === 2) { // TimestampEvent
						replayLastTime = (pevs[j][3] /* Timestamp */) + (replayLastAge - tick[0]) * 1000 / fps;
						break loop;
					}
				}
			}
			replayDuration = (replayLastTime == null) ? (replayLastAge * 1000 / fps) : replayLastTime;
		}

		var pf = new pdiBrowser.Platform({
			amflow: amflowClient,
			containerView: document.getElementById("container"),
			audioPlugins: [pdiBrowser.WebAudioPlugin, pdiBrowser.HTMLAudioPlugin],
			disablePreventDefault: disablePreventDefault
		});

		// TODO: カスタマイズできるようにする？
		pf._resourceFactory.createScriptAsset = function(id, assetPath) {
			return new SandboxScriptAsset(id, assetPath);
		};

		// 一部のエッジケースでSafariのみ描画されないという問題が発生するので、ゲーム開発者が開発中に気づけるようにg.Renderer#drawImage()でエラーを投げる処理を差し込む
		// funcにはg.Surfaceを返す関数が渡されることを想定している
		function createMeddlingWrappedSurfaceFactory (func) {
			return function() {
				var surface = func.apply(this, arguments);
				// Safariで範囲外描画時に問題が発生するのはCanvas要素なので、surfaceがCanvasでなければ範囲外描画警告は行わない
				if (surface._drawable.constructor.name !== "HTMLCanvasElement") {
					return surface;
				}
				var originalRenderer = surface.renderer;
				var renderer = null;
				surface.renderer = function () {
					// surface.renderer() はコンテンツから描画のたびに呼び出されるが戻り値は現実的に固定なので、ここでの surface.renderer() の上書きは一度しか適用しない
					if (renderer) {
						return renderer;
					}
					renderer = originalRenderer.apply(this);
					var originalDrawImage = renderer.drawImage;
					renderer.drawImage = function (surface, offsetX, offsetY, width, height, _destOffsetX, _destOffsetY) {
						if (!sandboxConfig.warn || sandboxConfig.warn.drawOutOfCanvas !== false) {
							if (offsetX < 0 || offsetX + width > surface.width || offsetY < 0 || offsetY + height > surface.height) {
								// ref. https://github.com/akashic-games/akashic-engine/issues/349
								var message = "drawImage(): out of bounds."
									+ `The source rectangle bleeds out the source surface (${surface.width}x${surface.height}).`
									+ "This is not a bug but warned by akashic sandbox"
									+ "to prevent platform-specific rendering trouble.";
								console.warn(message);
								window.dispatchEvent(new ErrorEvent("akashicWarning", { error: { message: message } }));
							}
						}
						if (!sandboxConfig.warn || sandboxConfig.warn.drawDestinationEmpty !== false) {
							if (width <= 0 || height <= 0) {
								var message = "drawImage(): nothing to draw."
									+ "Either width or height is less than or equal to zero."
									+ "This is not a bug but warned by akashic sandbox"
									+ "to prevent platform-specific rendering trouble.";
								console.warn(message);
								window.dispatchEvent(new ErrorEvent("akashicWarning", { error: { message: message } }));
							}
						}
						originalDrawImage.apply(this, arguments);
					}
					return renderer;
				}
				return surface;
			};
		}
		pf.getPrimarySurface = createMeddlingWrappedSurfaceFactory(pf.getPrimarySurface);
		pf._resourceFactory.createSurface = createMeddlingWrappedSurfaceFactory(pf._resourceFactory.createSurface);

		driver = new gdr.GameDriver({
			platform: pf,
			player: sandboxPlayer,
			errorHandler: function (e) { console.log("ERRORHANDLER:", e); }
		});

		var timeKeeper = new TimeKeeper(replayDuration);

		driver.gameCreatedTrigger.handle(function (game) {
			enableLogger(game);
			window.sandboxDeveloperProps.game = game;
			window.sandboxDeveloperProps.driver = driver;
			window.sandboxDeveloperProps.amflow = amflowClient;
			window.sandboxDeveloperProps.utils.defaultSize.width = pf.containerController.surface.width;
			window.sandboxDeveloperProps.utils.defaultSize.height = pf.containerController.surface.height;

			parentElement = document.getElementById("container").parentElement;
			window.sandboxDeveloperProps.utils.defaultStyle.margin = parentElement.style.margin;
			window.sandboxDeveloperProps.utils.defaultStyle.padding = parentElement.style.padding;
			window.sandboxDeveloperProps.utils.defaultStyle.overflow = parentElement.style.overflow;

			const environment = window.sandboxDeveloperProps.game._configuration.environment;
			const enableWebAssembly = environment?.features?.includes("WebAssembly");
			if (!enableWebAssembly) {
				Object.defineProperty(window, "WebAssembly", {
					get: function() {
						throw new Error("If you use WebAssembly, please add \"environment.features:[\"WebAssembly\"]\" to game.json");
					}
				});
			}

			if (getParameterByName("bg")) {
				document.body.style.backgroundColor = "black";
				pf.getPrimarySurface()._drawable.style.backgroundColor = "white";
			}
			if (getParameterByName("fit")) {
				window.sandboxDeveloperProps.utils.fitToWindow();
			}
			if (devMode) {
				setupDeveloperMenu({
					isReplay: isReplay,
					replayDuration: replayDuration,
					timeKeeper: timeKeeper
				});
			}
		});

		var profiler;
		if (devMode) {
			// todo: sandboxのリファクタリング時に getValueTrigger を与えるように修正
			profiler = new gdr.SimpleProfiler({
				interval: 200
			});
		}

		driver.initialize({
			configurationUrl: "/configuration/",
			assetBase: "/game/",
			driverConfiguration: {
				playId: sandboxPlayId,
				playToken: isReplay ? gdr.MemoryAmflowClient.TOKEN_PASSIVE : gdr.MemoryAmflowClient.TOKEN_ACTIVE,
				executionMode: isReplay ? gdr.ExecutionMode.Passive : gdr.ExecutionMode.Active
			},
			loopConfiguration: isReplay ? {
				loopMode: gdr.LoopMode.Replay,
				delayIgnoreThreshold: Number.MAX_VALUE,
				jumpTryThreshold: Number.MAX_VALUE,
				targetTimeFunc: timeKeeper.now.bind(timeKeeper)
			} : {
				loopMode: gdr.LoopMode.Realtime
			},
			profiler: profiler
		}, function (e) {
			if (e) {
				console.log(e);
				throw e;
			}
			timeKeeper.start();
			driver.startGame();
		});
	}
});
