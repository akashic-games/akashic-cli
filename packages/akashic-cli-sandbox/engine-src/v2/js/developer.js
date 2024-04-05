/**
 * param.isReplay: boolean
 * param.replayDuration: number
 * param.timeKeeper: TimeKeeper
 */
function setupDeveloperMenu(param) {
	var gdr = engineFiles.gameDriver;
	var defaultTotalTimeLimit = 85; // 85秒をデフォルトの制限時間としてあつかう。

	// loocalStorageにメニューの位置、サイズを保存している
	var config = {};
	if ("localStorage" in window) {
		var saved = JSON.parse(localStorage.getItem("akashic-sandbox-config"));
		if (saved) {
			config = saved;
		}
	}
	if (config.size == null) {
		config.size = {
			right: {width: "400px", height: "100%"},
			bottom: {width: "100%", height: "300px"}
		};
	}
	if (config.isPositionRight == null) {
		config.isPositionRight = true;
	}
	if (config.showGrid == null) {
		config.showGrid = false;
	}
	if (config.omitInterpolatedTick == null) {
		config.omitInterpolatedTick = false;
	}
	if (isNaN(parseInt(config.totalTimeLimit, 10))) {
		config.totalTimeLimit = defaultTotalTimeLimit;
	}
	if (config.warningMeddlingAkashic == null) {
		config.warningMeddlingAkashic = true;
	}
	if (config.sendsSessionParameter == null) {
		config.sendsSessionParameter = false;
	}
	if (config.mode == null) {
		config.mode = "single";
	}

	var sandboxConfig = window.sandboxDeveloperProps.sandboxConfig;

	// sandbox.config.js で warn 設定が記述されていたら、対象のチェックボックスを押せないようにする
	if (sandboxConfig.warn && (sandboxConfig.warn.useDate !== undefined || sandboxConfig.warn.useMathRandom !== undefined)) {
		config.isWarnSpecifiedInConfig = true;

		if (sandboxConfig.warn.useDate !== undefined) {
			config.warnUseDate = sandboxConfig.warn.useDate;
		}
		if (sandboxConfig.warn.useMathRandom !== undefined) {
			config.warnUseMathRandom = sandboxConfig.warn.useMathRandom;
		}
	} else {
		config.isWarnSpecifiedInConfig = false;
	}

	config.autoSendEvents = config.autoSendEvents || !!sandboxConfig.autoSendEventName;
	config.eventsToSend = !!sandboxConfig.autoSendEventName ? JSON.stringify(sandboxConfig.events[sandboxConfig.autoSendEventName]) : config.eventsToSend;
	saveConfig();

	var events = {};
	if (sandboxConfig.events) {
		Object.keys(sandboxConfig.events).forEach(function (name) {
			events[name] = JSON.stringify(sandboxConfig.events[name]);
		});
	}

	var props = window.sandboxDeveloperProps;
	var amflow = props.amflow;

	// 各viewの情報
	var views = {
		'general-view': {title: "General", show: true},
		'events-view': {title: "Events", show: false},
		'camera-view': {title: "Cameras", show: false},
		'e-view': {title: "E", show: false},
		'niconico-view': {title: "Niconico", show: false},
		'playlog-view': {title: "Replay", show: false},
		'snapshot-view': {title: "Snapshot", show: false}
	};

	// game.jsonの情報
	function getNicoLiveConfig() {
		const environment = props.game._configuration.environment;
		if (environment === undefined) {
			return null;
		}
		// niconico は非推奨なので、nicolive の方を優先的に利用する
		return environment.nicolive ?? (environment.niconico ?? null);
	}
	const nicoliveConfig = getNicoLiveConfig();
	const preferredTotalTimeLimit = nicoliveConfig?.preferredSessionParameters?.totalTimeLimit ?? defaultTotalTimeLimit;

	// vue.jsにバインドするデータ
	var data = {
		showMenu: sandboxConfig.showMenu ? sandboxConfig.showMenu : false,
		players: [],
		selfId: props.sandboxPlayer.id,
		selfName: props.sandboxPlayer.name,
		path: props.path,
		gameId: props.gameId,
		events: events,
		cameras: [],
		focusingCameraIndex: undefined,
		inputPlayerName: null,
		inputPlayerId: null,
		config: config,
		entities: [], // {className: string, id: number, children: Array}
		entityRect: {
			enable: false,
			show: false,
			withChildren: false,
			rectStyle: {top: "0px", left: "0px", width: "0px", height: "0px"}
		},
		targetEntity: null,
		snapshots: null,
		snapshotPreview: null,
		profiler: {
			show: (window.location.search.indexOf("profiler=1") >= 0), // todo: リファクタリング時にクエリオプションのパースを統一する
			expand: false
		},
		isPaused: false,
		isReplay: param.isReplay,
		currentTime: 0,
		replayDuration: param.replayDuration,
		replayDone: false,
		playlog: {
			list: [] // {name: string, url: string}
		},
		views: views,
		isIchibaContent: function() {
			if (!nicoliveConfig || !nicoliveConfig.supportedModes) {
				return false;
			}
			return nicoliveConfig.supportedModes.length > 0;
		}(),
		rankingGameState: {
			score: "N/A",
			playThreshold: "N/A",
			clearThreshold: "N/A"
		},
		remainingTime: "N/A",
		preferredTotalTimeLimit: preferredTotalTimeLimit,
		isStopGame: false,
		modeList: [
			{text: "ひとりで遊ぶ(single)", value: "single"},
			{text: "ランキング(ranking)", value: "ranking"}
		],
		isShowingErrorDialog: false,
		dialogMessage: "",
		dialogTitle: "",
		dialogBody: "",
		dialogReferenceUrl: null,
		dialogReferenceMessage: null
	};

	function showErrorDialog(err) {
		data.isShowingErrorDialog = true;
		data.dialogTitle = !!err.isHideTitle ? "" : "エラーが発生しました";
		data.dialogBody = !!err.isHideBody ? "" : "Developer Tool などでエラー内容を確認の上修正してください。";
		data.dialogMessage = err.message;
	}

	function showAkashicWarnDialog(err) {
		data.isShowingErrorDialog = true;
		data.dialogTitle = "Akashic非推奨機能が使用されました";
		data.dialogMessage = err.message;
		data.dialogBody = "Developer Tool などでエラー内容を確認の上修正してください。";
		data.dialogReferenceMessage = err.referenceMessage;
		data.dialogReferenceUrl = err.referenceUrl;
	}

	function hideErrorDialog() {
		data.isShowingErrorDialog = false;
	}

	window.addEventListener("error", function(ev) {
		showErrorDialog(ev.error);
	});

	window.addEventListener("akashicWarning", function(ev) {
		showAkashicWarnDialog(ev.error);
	});

	window.addEventListener("onunhandledrejection", function(ev) {
		showErrorDialog(ev.error);
	});

	if (config.autoJoin && !param.isReplay) {
		// NOTE: この時点でgame._loadedにgame._start()がハンドルされている必要がある
		// スナップショットから復元時はloadedが発火しないのでJOINは行われない
		props.game._loaded.addOnce(function() {
			var p = props.sandboxPlayer;
			data.players.push({player: {id: p.id, name: p.name}, self: true});
			amflow.sendEvent([0 /* Join */,  3, p.id, p.name, null ]);
		});
	}

	// Events タブの "ゲーム開始時にEventを自動送信" と NicoNico タブの "セッションパラメータを送る" が両方有効になった場合
	// エラーを出力し、Eventタブの "ゲーム開始時にEventを自動送信" を無効とする。
	if (config.autoSendEvents && (config.sendsSessionParameter && data.isIchibaContent)) {
		var err = {
			message: `NicoNico タブの"セッションパラメータを送る"と Events タブの"ゲーム開始時にEventを自動送信"を両方同時に有効にすることはできません。Events タブの"ゲーム開始時にEventを自動送信"を無効にしました。`,
			isHideTitle: true,
			isHideBody: true
		}
		showErrorDialog(err);
		config.autoSendEvents = false;
	}

	if (config.autoSendEvents && !param.isReplay) {
		props.game._loaded.addOnce(function () {
			sendEvents();
		});
	}

	if (config.sendsSessionParameter && data.isIchibaContent && !param.isReplay) {
		var totalTimeLimit = config.usePreferredTotalTimeLimit ? data.preferredTotalTimeLimit : parseInt(config.totalTimeLimit, 10);

		if (isNaN(totalTimeLimit)) {
			totalTimeLimit = defaultTotalTimeLimit;
		}
		// ランキング用イベントを送信する。
		var sessionParameters = {
			"mode": config.mode
		};
		if (config.mode === "ranking") {
			sessionParameters["totalTimeLimit"] = totalTimeLimit;
			// 前の仕様ではtotalTimeLimitより25秒程度短いgameTimeLimitが送られていたので、互換性のためにtotalTimeLimitと一緒に送っておく。
			sessionParameters["gameTimeLimit"] = totalTimeLimit - 25;
		}
		props.game._loaded.addOnce(function () {
			amflow.sendEvent([0x20, 0, "dummy", {
				"type": "start",
				"parameters": sessionParameters
			}]);
		});
		if (config.mode === "ranking") {
			var gameStartTime = Date.now();
			var intervalId = setInterval(function () {
				var currentRemainingTime = totalTimeLimit - (Date.now() - gameStartTime) / 1000;
				data.remainingTime = currentRemainingTime > 0 ? Math.ceil(currentRemainingTime) : 0;
			}, 1000 / props.game.fps);
			setTimeout(function () {
				data.remainingTime = 0;
				clearInterval(intervalId);
				if (config.stopsGameOnTimeout) {
					if (props.game && props.game.audio) {
						// 音を明示的に止める。
						Object.keys(props.game.audio).forEach(function (key) {
							props.game.audio[key].stopAll();
						});
					}
					props.driver.stopGame();
					// akashic-sandboxがゲームを止めたことをユーザーに明示するために、強制的にメニューを開いてメッセージを表示する。
					data.isStopGame = true;
					data.showMenu = true;
					var elements = document.getElementsByClassName("dev-menu-view");
					for (var i = 0; i < elements.length; i++) {
						var element = elements[i];
						data.views[element.id].show = element.id === "niconico-view";
						element.style.display = data.views[element.id].show ? "block" : "none";
					}
				}
			}, totalTimeLimit * 1000);
		}
	}

	// 歯車ボタン
	var devBtn = document.querySelector("#dev-btn");
	devBtn.addEventListener("click", function() {
		data.showMenu = !data.showMenu;
	});


	// 設定をlocalStorageに保存する関数
	function saveConfig() {
		if ("localStorage" in window) {
			localStorage.setItem("akashic-sandbox-config", JSON.stringify(config));
		}
	}

	// プレイヤーをジョインさせる関数
	function joinGame() {
		var playerId = data.inputPlayerId;
		var playerName = data.inputPlayerName;
		if (!playerId) {
			alert("Player IDを入力してください");
			return;
		}
		for (var i = 0; i < data.players.length; ++i) {
			if (data.players[i].player.id === playerId) {
				alert("Player ID: \"" + playerId + "\"は既に参加しています。");
				return;
			}
		}
		if (playerId === data.selfId && inputPlayerName !== data.selfName) {
			alert("Player ID: \"" + playerId + "\"のPlayer Nameは\"" + data.selfName + "\"になります。");
			playerName = data.selfName;
		}
		data.players.push({
			player: { id: playerId, name: playerName },
			self: (playerId === props.game.selfId)
		});
		data.inputPlayerId = data.inputPlayerName = null;
		amflow.sendEvent([0 /* Join */,  3, playerId, playerName, null ]);
	}

	// プロファイラーの各種設定
	// この値は次回の redrawProfilerCanvas() 呼び出し時に適用される
	var profilerSettings = {
		expand: data.profiler.expand,
		width: 170,
		margin: 5,
		padding: 5,
		align: "vertical", // 縦並び
		// align: "horizontal", // 横並び
		bgColor: "white",
		fontColor: "black",
		fontSize: 17,
		fontMaxColor: "deeppink",
		fontMinColor: "dodgerblue",
		fontMinMaxColor: "gray",
		graphColor: "lavender",
		graphWidth: 3,
		graphWidthMargin: 1,
		graphPadding: 5
	};

	// note: プロファイラー表示処理の範囲をわかりやすくするため {} で囲んでいる
	{
		var s = {};
		var updateProfilerConfig = function() {
			s = Object.create(profilerSettings);
		};

		var profilerData = {
			fps: {
				name: "fps",
				data: [],
				max: 0,
				min: Number.MAX_VALUE
			},
			skipped: {
				name: "skipped",
				data: [],
				max: 0,
				min: Number.MAX_VALUE
			},
			interval: {
				name: "interval",
				data: [],
				max: 0,
				min: Number.MAX_VALUE
			},
			frame: {
				name: "frame",
				data: [],
				max: 0,
				min: Number.MAX_VALUE
			},
			rendering: {
				name: "rendering",
				data: [],
				max: 0,
				min: Number.MAX_VALUE
			}
		};

		var profilerCanvas = document.getElementById("profilerCanvas");
		profilerCanvas.addEventListener("click", function() {
			toggleProfilerCanvasSize();
		});
		profilerCanvas.style.display = data.profiler.show ? "block" : "none";

		var profilerCanvasContext = profilerCanvas.getContext("2d");

		// todo: SimpleProfilerのコンストラクタパラメータにgetValueTriggerを与えるように修正
		props.driver._gameLoop._clock._profiler._calculateProfilerValueTrigger.add(function(value) {
			var deltaX;
			var deltaY;
			if (s.align === "vertical") {
				deltaX = 0;
				deltaY = s.height + s.margin;
			} else {
				deltaX = s.width + s.margin;
				deltaY = 0;
			}
			updateProfilerData(profilerData.fps,       value.framePerSecond,    deltaX * 0, deltaY * 0, 2);
			updateProfilerData(profilerData.skipped,   value.skippedFrameCount, deltaX * 1, deltaY * 1, 1);
			updateProfilerData(profilerData.interval,  value.rawFrameInterval,  deltaX * 2, deltaY * 2, 1);
			updateProfilerData(profilerData.frame,     value.frameTime,         deltaX * 3, deltaY * 3, 1);
			updateProfilerData(profilerData.rendering, value.renderingTime,     deltaX * 4, deltaY * 4, 1);
		});

		var updateProfilerData = function(profilerData, profileValue, x, y, fixed) {
			profilerData.data.unshift(profileValue.ave);
			drawGraph(profilerData, profileValue, x, y, fixed);
		};
		var drawText = function(text, x, y, color, maxWidth) {
			profilerCanvasContext.fillStyle = color;
			profilerCanvasContext.fillText(text, x, y, maxWidth);
		};
		var drawGraph = function(profilerData, profilerValue, x, y, fixed) {
			profilerCanvasContext.fillStyle = s.bgColor;
			profilerCanvasContext.fillRect(x, y, s.width, s.height);
			profilerCanvasContext.fillStyle = s.graphColor;
			var min = Number.MAX_VALUE;
			var max = 0;
			for (var i = 0; i < profilerData.data.length; ++i) {
				var offsetX = s.width - i * (s.graphWidth + s.graphWidthMargin) - s.graphWidth - s.graphPadding;
				var data = profilerData.data[i];
				if (data < min) {
					min = data;
				}
				if (data > max) {
					max = data;
				}
				if (offsetX < s.graphWidth + s.graphPadding / 2) {
					profilerData.data.pop();
					break;
				}
			}
			if (min < profilerData.min) profilerData.min = min;
			if (profilerData.max < max) profilerData.max = max;

			var areaHeight = s.height - s.graphPadding * 2;
			var rate = max > areaHeight ? areaHeight / max : 1;
			for (var i = 0; i < profilerData.data.length; ++i) {
				var offsetX = s.width - i * (s.graphWidth + s.graphWidthMargin) - s.graphWidth - s.graphPadding;
				var height = profilerData.data[i] * rate;
				profilerCanvasContext.fillRect(
					x + offsetX,
					y + s.height - height - s.graphPadding,
					s.graphWidth,
					height
				);
			}
			var valueOffsetX = s.width * 0.6;
			var maxWidth = valueOffsetX - s.padding;
			var maxValueWidth = (s.width - valueOffsetX) - s.padding;
			drawText(profilerData.name + ":", x + s.padding, y + s.padding + s.fontSize, s.fontColor, maxWidth);
			drawText(profilerValue.ave.toFixed(fixed), x + valueOffsetX, y + s.padding + s.fontSize, s.fontColor, maxValueWidth);
			drawText(max.toFixed(fixed), x + valueOffsetX, y + s.padding + s.fontSize * 2, s.fontMaxColor, maxValueWidth);
			drawText(min.toFixed(fixed), x + valueOffsetX, y + s.padding + s.fontSize * 3, s.fontMinColor, maxValueWidth);
			var min_max = " " + profilerData.min.toFixed(0) + "-" + profilerData.max.toFixed(0);
			drawText(min_max, x + s.padding, y + s.padding + s.fontSize * 2.5, s.fontMinMaxColor, maxWidth);
		};

		// profilerSettings の設定にもとづいたプロファイラーを描画する
		function redrawProfilerCanvas() {
			updateProfilerConfig();
			var width;
			var height;
			s.height = s.fontSize * 3 + s.padding * 2;
			if (s.align === "vertical") {
				width = s.width;
				height = (s.height + s.margin) * Object.keys(profilerData).length - s.margin;
			} else {
				width = (s.width + s.margin) * Object.keys(profilerData).length - s.margin;
				height = s.height;
			}
			profilerCanvas.width = width;
			profilerCanvas.height = height;
			if (s.expand) {
				profilerCanvas.style.width = width * 1.5 + "px";
				profilerCanvas.style.height = height * 1.5 + "px";
			} else {
				profilerCanvas.style.width = width + "px";
				profilerCanvas.style.height = height + "px";
			}
			profilerCanvasContext.font = s.fontSize + "px sans-serif";
		}

		var profilerCheckBox = document.getElementById("show-profiler");
		// プロファイラー情報の表示をトグル表示する関数
		function toggleProfiler() {
			if (!data.profiler.show) {
				profilerCanvas.style.display = "block";
				profilerCheckBox.checked = true;
			} else {
				profilerCanvas.style.display = "none";
				profilerCheckBox.checked = false;
			}
			data.profiler.show = !data.profiler.show;
		}

		// プロファイラー情報の拡縮をトグルする関数
		function toggleProfilerCanvasSize() {
			profilerSettings.expand = !s.expand;
			redrawProfilerCanvas();
		}

		profilerCheckBox.checked = data.profiler.show;
		redrawProfilerCanvas();
	}

	// g.Game.tickを上書きする。
	var originalTickFunc = props.game.tick;
	props.game.tick = function (advanceAge, omittedTickCount) {
		if (data.isIchibaContent && props.game.vars && props.game.vars.gameState) {
			// ユーザーに値の型も意識させるため、JSON.stringifyを使用する。
			data.rankingGameState.score = getJsonStringifiedValue(props.game.vars.gameState.score);
			data.rankingGameState.playThreshold = getJsonStringifiedValue(props.game.vars.gameState.playThreshold);
			data.rankingGameState.clearThreshold = getJsonStringifiedValue(props.game.vars.gameState.clearThreshold);
		}
		return originalTickFunc.apply(props.game, arguments);
	};

	// g.Camera2Dを上書き
	/**
	 * Akashicゲームコンテンツ内で生成されたg.Camera2Dの一覧を取得する手段が無いため、
	 * g.Camera2Dのコンストラクタを無理やり上書きしている。
	 */
	var camera2D = g.Camera2D;
	var cameras = [];
	function registerCamera(cam) {
		data.cameras.push({id: cam.id, name: cam.name, local: cam.local});
		cameras.push(cam);
	}
	g.Camera2D = function () {
		camera2D.apply(this, arguments);
		registerCamera(this);
	};
	// staticメンバを再現
	Object.keys(camera2D).forEach(function (key) {
		g.Camera2D[key] = camera2D[key];
	});
	// staticメンバを再現してもデシリアライズは正常に動作しない
	// (オリジナルのコンストラクタを使ってしまう)のでさらに無理やり上書きする。
	g.Camera2D.deserialize = function (ser, game) {
		var ret = camera2D.deserialize(ser, game);
		registerCamera(ret);
		return ret;
	};
	g.Camera2D.prototype = camera2D.prototype;

	// g.Game#focusingCameraをsetter/getter化することで、コンテンツ側からのfocusingCameraの変更を感知
	Object.defineProperty(props.game, "focusingCamera", {
		set: function(c) {
			data.focusingCameraIndex = cameras.indexOf(c);
		},
		get: function() {
			return cameras[data.focusingCameraIndex];
		}
	});

	// viewを表示する関数
	// v-showで上手くやるべきかもしれない
	function renderView(vm) {
		var viewElms = vm.$el.querySelectorAll(".dev-menu-view");
		for (var i = 0; i < viewElms.length; i++) {
			var el = viewElms[i];
			el.style.display = data.views[el.id].show ? "block" : "none";
		}
	}

	// g.Eから {className: string, id: number, children: Array} を作る
	function createEntityObject(e) {
		var obj = {id: e.id, className: e.constructor.name, children: []};
		if (e.children && e.children.length > 0) {
			e.children.forEach(function(c) {
				obj.children.push(createEntityObject(c));
			});
		}
		return obj;
	}

	// 親エンティティを辿り、掛けあわせたマトリックスを返す
	function parentsMatrix(e, focusingCamera) {
		if (e.parent && e.parent.getMatrix) {
			var m1 = e.parent.getMatrix();
			var m2 = parentsMatrix(e.parent, focusingCamera);
			if (m2) {
				return m1.multiplyNew(m2);
			}
			return m1;
		} else {
			if (focusingCamera) {
				return focusingCamera.getMatrix();
			}
			return undefined;
		}
	}

	// g.E#_calculateBoundingRectを改造したもので、hidden状態のエンティティの包含矩形の計算、子孫エンティティを計算対象に含めるかどうかの指定ができる
	// NOTE: g.E#_calculateBoundingRectが実装クラスによりオーバーライドされる可能性があるためakashic-engineにデバッグ用の包含矩形計算機能を入れる方が良い
	function calculateEntityBoundingRect(entity, parentsMatrix, withChildren) {
		var matrix = entity.getMatrix();
		if (parentsMatrix) {
			matrix = parentsMatrix.multiplyNew(matrix);
		}

		var thisBoundingRect = {left: 0, right: entity.width, top: 0, bottom: entity.height};

		var targetCoordinates = [
			{x: thisBoundingRect.left, y: thisBoundingRect.top},
			{x: thisBoundingRect.left, y: thisBoundingRect.bottom},
			{x: thisBoundingRect.right, y: thisBoundingRect.top},
			{x: thisBoundingRect.right, y: thisBoundingRect.bottom}
		];
		var convertedPoint = matrix.multiplyPoint(targetCoordinates[0]);
		var result = {left: convertedPoint.x, right: convertedPoint.x, top: convertedPoint.y, bottom: convertedPoint.y};
		for (var i = 1; i < targetCoordinates.length; ++i) {
			convertedPoint = matrix.multiplyPoint(targetCoordinates[i]);
			if (result.left > convertedPoint.x)
				result.left = convertedPoint.x;
			if (result.right < convertedPoint.x)
				result.right = convertedPoint.x;
			if (result.top > convertedPoint.y)
				result.top = convertedPoint.y;
			if (result.bottom < convertedPoint.y)
				result.bottom = convertedPoint.y;
		};
		if (withChildren && entity.children !== undefined) {
			for (var i = 0; i < entity.children.length; ++i) {
				var nowResult = calculateEntityBoundingRect(entity.children[i], matrix, true);
				if (nowResult) {
					if (result.left > nowResult.left)
						result.left = nowResult.left;
					if (result.right < nowResult.right)
						result.right = nowResult.right;
					if (result.top > nowResult.top)
						result.top = nowResult.top;
					if (result.bottom < nowResult.bottom)
						result.bottom = nowResult.bottom;
				}
			};
		}
		return result;
	}

	function updateEntityList() {
		var entities = props.game.scene().children;
		data.entities = [];
		entities.forEach(function(e) {
			data.entities.push(createEntityObject(e));
		});
	}

	function insertEventString (str) {
		data.config.eventsToSend = str;
	}

	function sendEventsWithValue(str) {
		var es = [];
		try {
			es = JSON.parse(str);
		} catch (e) {
			alert(e);
			console.log(e);
		}
		es.forEach(function (e) { amflow.sendEvent(e); });
	}

	function sendEvents() {
		if (!config.eventsToSend) {
			console.log("No events to send.");
			return;
		}
		sendEventsWithValue(config.eventsToSend);
	}

	function focusBoundingRect(id) {
		if (!data.entityRect.enable) {
			return;
		}
		var e = null;
		if (id < 0) {
			e = props.game._localDb[id];
		} else {
			e = props.game.db[id];
		}
		if (!e) {
			return;
		}
		// NOTE: fitToWindowすると破綻する
		var container = document.getElementById("container");
		var offsetTop = container ? container.offsetTop : 0;
		var rect = calculateEntityBoundingRect(e, parentsMatrix(e, props.game.focusingCamera), data.entityRect.withChildren);
		var s = data.entityRect.rectStyle;
		if (rect) {
			// 2 はフォーカス用divのボーダーサイズ
			s.top = offsetTop + (rect.top - 2) + "px";
			s.left = (rect.left - 2) + "px";
			s.width = (rect.right - rect.left) + "px";
			s.height = (rect.bottom - rect.top) + "px";
		}
		data.entityRect.show = true;
	}

	function unfocusBoundingRect() {
		data.entityRect.show = false;
		var s = data.entityRect.rectStyle;
		s.top = s.left = s.width = s.height = "0px";
	}

	function updateTargetEntity(id) {
		var e = null;
		if (id < 0) {
			e = props.game._localDb[id];
		} else {
			e = props.game.db[id];
		}
		if (e) {
			data.targetEntity = {
				className: e.constructor.name,
				id: id,
				local: e.local,
				touchable: e.touchable,
				visible: e.visible(),
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height,
				angle: e.angle,
				opacity: e.opacity,
				destroyed: e.destroyed()
			};
		} else {
			data.targetEntity = null;
		}
	}

	var SNAPSHOT_PREFIX = "akss:" + props.gameId + "/";
	var snapshots = {};
	var snapshotsList = [];

	// ゲームコンテンツからのスナップショット保存要求をハンドル
	var saveSnapshotOriginal = props.game.saveSnapshot;
	props.game.saveSnapshot = function(gameSnapshot) {
		// browser-engineのGame#saveSnapshot()を実行
		saveSnapshotOriginal.apply(props.game, arguments);

		if (!gameSnapshot) return;

		var time = new Date();
		var y = time.getFullYear();
		var m = time.getMonth();
		m = m < 10 ? "0" + m : m;
		var d = time.getDate();
		d = d < 10 ? "0" + d : d;
		var h = time.getHours();
		h = h < 10 ? "0" + h : h;
		var min = time.getMinutes();
		min = min < 10 ? "0" + min : min;
		var s = time.getSeconds();
		s = s < 10 ? "0" + s : s;

		var name = y + "-" + m + "-" + d + "-" + h + "-" + min + "-" + s;
		var snapshot = {
			age: props.game.age,
			randGenSer: props.game.random[0].serialize(),
			gameSnapshot: gameSnapshot,
			players: data.players
		};
		addSnapshotsList(name, snapshot);

		// LocalStorageに保存
		localStorage.setItem(SNAPSHOT_PREFIX + name, JSON.stringify(snapshot));
	};

	// LocalStorageに保存されているスナップショットの一覧
	for (i in localStorage) {
		if (i.indexOf(SNAPSHOT_PREFIX) !== -1) {
			addSnapshotsList(i.split("/")[1], JSON.parse(localStorage.getItem(i)));
		}
	}
	data.snapshots = snapshotsList;

	// スナップショットリストの追加 (Vue.js)
	function addSnapshotsList(name, data) {
		snapshots[name] = data;
		snapshotsList.push({
			name: name,
			data: JSON.stringify(data, null, "  ")
		});
	}

	// スナップショットの削除 (Vue.js + LocalStorage)
	function removeSnapshot(name) {
		localStorage.removeItem(SNAPSHOT_PREFIX + name);
		snapshotsList = snapshotsList.filter(function(e) {
			return e.name !== name;
		});
		delete snapshots[name];
		data.snapshots = snapshotsList;
	}

	// Grid表示
	var gridCheckBox = document.getElementById("show-grid");
	var gridCanvas = document.getElementById("gridCanvas");
	setupGrid();
	resizeGrid();
	drawGrid();
	function setupGrid() {
		if (config.showGrid === true) {
			gridCheckBox.checked = true;
			gridCanvas.style.display = "block";
		}
		gridCanvas.width = props.game.width;
		gridCanvas.height = props.game.height;
		gridCanvas.style.width = props.game.width + "px";
		gridCanvas.style.height = props.game.height + "px";
	}
	function resizeGrid() {
		var container = document.getElementById("container");
		var node = container.lastChild.firstChild;
		gridCanvas.style.transformOrigin = node.style.transformOrigin;
		gridCanvas.style.transform = node.style.transform;
		gridCanvas.style.left = node.parentElement.style.left;
		gridCanvas.style.top = node.parentElement.style.top;
	}
	function drawGrid() {
		var context = gridCanvas.getContext("2d");
		context.save();
		context.strokeStyle = "#CCC";
		context.setLineDash([3, 3]);
		drawGridLine(20, 20);
		context.strokeStyle = "#AAA";
		context.setLineDash([]);
		drawGridLine(100, 100);
		context.restore();

		function drawGridLine(gridWidth, gridHeight) {
			var x, y;
			context.beginPath();
			for (x = 0.5; x <= props.game.width; x += gridWidth) {
				context.moveTo(x, 0);
				context.lineTo(x, props.game.height);
			}
			for (y = 0.5; y <= props.game.height; y += gridHeight) {
				context.moveTo(0, y);
				context.lineTo(props.game.width, y);
			}
			context.stroke();
		}
	}
	function toggleGrid() {
		if (gridCheckBox.checked) {
			gridCanvas.style.display = "block";
			config.showGrid = true;
		} else {
			gridCanvas.style.display = "none";
			config.showGrid = false;
		}
		saveConfig();
	}

	var omitInterpolatedTickCheckBox = document.getElementById("omit-interpolated-tick");
	setupOmitInterpolatedTick();
	function setupOmitInterpolatedTick() {
		if (config.omitInterpolatedTick) {
			omitInterpolatedTickCheckBox.checked = true;
			changeDriverState({ loopConfiguration: { omitInterpolatedTickOnReplay: true } });
		}
	}
	function toggleOmitInterpolatedTick() {
		if (omitInterpolatedTickCheckBox.checked) {
			changeDriverState({ loopConfiguration: { omitInterpolatedTickOnReplay: true } });
			config.omitInterpolatedTick = true;
		} else {
			changeDriverState({ loopConfiguration: { omitInterpolatedTickOnReplay: false } });
			config.omitInterpolatedTick = false;
		}
		saveConfig();
	}

	// time 更新
	function updateCurrentTime() {
		data.currentTime = param.timeKeeper.now();
	}
	props.game._sceneChanged.add(function (scene) {
		if (!scene.update.contains(updateCurrentTime)) {
			scene.update.add(updateCurrentTime);
		}
	});

	var PLAYLOG_PREFIX = "akpl:" + props.gameId + "/";
	var playlogList = [];
	if (param.isReplay) {
		// プレイログ再生時はディベロッパーメニューを強制表示
		// note: views["general-view"].showがtrueかつ他のviewsのメンバのshowがfalseである、という前提条件で無理やり対応
		views["general-view"].show = false;
		views["playlog-view"].show = true;
		data.showMenu = true;
	}
	function savePlaylog() {
		var name = +new Date();
		var dump = amflow.dump();
		var jsonData = JSON.stringify({
			tickList: dump.tickList,
			startPoints: dump.startPoints
		});
		if (localStorage.getItem(PLAYLOG_PREFIX + name)) {
			if (!window.confirm("同名のリプレイ情報がすでに存在します。上書きしてもよろしいでしょうか？")) {
				return;
			}
			_removePlaylog(name);
		}
		localStorage.setItem(PLAYLOG_PREFIX + name, jsonData);
		var url = dumpPlaylog(name);
		data.playlog.list.push({name: name, url: url});
	}
	function reloadPlaylog(name) {
		var currentUrl = location.protocol + "//" + location.host + location.pathname;
		if (name) {
			window.location.href = currentUrl + "?playlog=" + name;
		} else {
			window.location.href = currentUrl;
		}
	}
	function changeDriverState(arg, callback) {
		props.driver.changeState(arg, function (err) {
			if (err) {
				console.log(err);
			}
			if (callback) {
				callback(err);
			}
		});
	}
	function rewindReplay() {
		param.timeKeeper.setTime(0);
		updateCurrentTime();
	}
	function playPauseReplay() {
		if (data.isPaused) {
			param.timeKeeper.start();
			data.isPaused = false;
		} else {
			param.timeKeeper.pause();
			data.isPaused = true;
		}
	}
	function onClickTimeProgress(ev) {
		var progress = document.getElementById("dev-menu-time-progress");
		var targetTime = Math.floor(ev.offsetX * progress.max / progress.offsetWidth);
		param.timeKeeper.setTime(targetTime);
	}
	function accelerateReplay() {
		param.timeKeeper.setRate(param.timeKeeper.getRate() * 2);
	}
	function decelerateReplay() {
		param.timeKeeper.setRate(param.timeKeeper.getRate() / 2);
	}
	function playFromHere() {
		if (props.amflow.dropAfter) {
			props.amflow.dropAfter(props.game.age);
		}
		props.driver.stopGame();
		props.driver.changeState({
			driverConfiguration: {
				executionMode: gdr.ExecutionMode.Active,
				playToken: gdr.MemoryAmflowClient.TOKEN_ACTIVE
			},
			loopConfiguration: {
				playbackRate: 1,  // 実行速度もリセットしておく
				loopMode: gdr.LoopMode.Realtime,
				delayIgnoreThreshold: 6,  // Ugh! GameLoopがデフォルト値にリセットする方法を提供するべき
				jumpTryThreshold: 90000
			}
		}, function (err) {
			if (err) {
				console.log(err);
				return;
			}
			data.isReplay = false;
			props.driver.setNextAge(props.game.age);
			props.driver.startGame();
		});
	}
	function removePlaylog(name) {
		if (!window.confirm("リプレイ情報を削除しますか？"))
			return;
		_removePlaylog(name);
	}
	function _removePlaylog(name) {
		localStorage.removeItem(PLAYLOG_PREFIX + name);
		playlogList = playlogList.filter(function(e) {
			if (e.name === name)
				window.URL.revokeObjectURL(e.url);
			return e.name !== name;
		});
		data.playlog.list = playlogList;
	}
	function dumpPlaylog(name) {
		var playlog = localStorage.getItem(PLAYLOG_PREFIX + name);
		if (!playlog) return;
		var blob = new Blob([ playlog ], { type : "application/x-download" });
		return URL.createObjectURL(blob);
	}
	var loader = document.getElementById("load-playlog-handler");
	loader.addEventListener("change", function (e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function (ev) {
			if (localStorage.getItem(PLAYLOG_PREFIX + file.name)) {
				if (!window.confirm("同名のリプレイ情報がすでに存在します。上書きしてもよろしいでしょうか？")) {
					return;
				}
				_removePlaylog(file.name);
			}
			localStorage.setItem(PLAYLOG_PREFIX + file.name, ev.target.result);
			var url = dumpPlaylog(file.name);
			data.playlog.list.push({name: file.name, url: url});
		};
	}, false);

	// LocalStorageに保存されているプレイログの一覧
	for (i in localStorage) {
		if (i.indexOf(PLAYLOG_PREFIX) !== -1) {
			var name = i.split("/")[1];
			var url = dumpPlaylog(name);
			playlogList.push({
				name: name,
				url: url
			});
		}
	}
	data.playlog.list = playlogList;

	function getJsonStringifiedValue(value) {
		try {
			var stringifiedValue = JSON.stringify(value);
			return stringifiedValue === undefined ? "undefined" : stringifiedValue;
		} catch (e) {
			return "N/A (circular reference)";
		}
	}

	Vue.component("entity-list-item", {
		template: "#entity-list-item-template",
		props: {
			model: Object,
			index: Number
		},
		data: function () {
			return {
				open: false
			};
		},
		computed: {
			hasChildren: function () {
				if (this.model.children && this.model.children.length > 0) {
					return true;
				}
				return false;
			}
		},
		methods: {
			toggle: function () {
				this.open = !this.open;
			},
			selectEntity: function() {
				updateTargetEntity(this.model.id);
			},
			focusEntity: function() {
				focusBoundingRect(this.model.id);
			},
			unfocusEntity: function() {
				unfocusBoundingRect();
			}
		}
	});

	var vm = new Vue({
		el: "#dev-container",
		data: data,
		ready: function(v) {
			// v-show/v-ifだと一瞬メニューが見えてしまうため、".dev-menu-hide"を初期状態で付けている
			// それを外して表示制御をv-showに任せる
			var e = document.getElementById("dev-menu");
			e.className = e.className.replace(/dev-menu-hide/g, "");
			// interact.js によるリサイズ処理
			interact("#dev-menu")
				.resizable({
					preserveAspectRatio: true,
					edges: { left: true, top: true }
				})
				.on("resizemove", function (event) {
					if (data.config.isPositionRight) {
						data.config.size.right.width  = event.rect.width + "px";
					} else {
						data.config.size.bottom.height = event.rect.height + "px";
					}
					saveConfig();
				});
			renderView(this);
		},
		methods: {
			leaveGame: function(index) {
				var p = {id: data.players[index].player.id, name: data.players[index].player.name};
				data.players.$remove(data.players[index]);
				amflow.sendEvent([1 /* Leave */,  3, p.id ]);
			},
			toggleMenu: function() {
				data.showMenu = !data.showMenu;
			},
			closeMenu: function() {
				data.showMenu = false;
			},
			togglePosition: function() {
				data.config.isPositionRight = !data.config.isPositionRight;
				saveConfig();
			},
			changeView: function(target) {
				for (id in data.views) {
					data.views[id].show = false;
				}
				target.show = true;
				renderView(this);
			},
			toggleBackground: function() {
				var bg = document.body.style.backgroundColor;
				document.body.style.backgroundColor = bg ? "" : "black";
			},
			togglePreventDefault: function() {
				saveConfig();
			},
			toggleWarningMeddlingAkashic: function() {
				saveConfig();
			},
			toggleProfiler: toggleProfiler,
			fitToWindow: function() {
				// setOffsetしないとメニューにゲーム画面が被って、メニューサイズを変更しようとするとバグるのでとりあえず true
				window.sandboxDeveloperProps.utils.fitToWindow(true);
				resizeGrid();
			},
			revertSize: function(){
				window.sandboxDeveloperProps.utils.revertViewSize();
				resizeGrid();
			},
			captureScreen: 	function(e) {
				var cvs = document.getElementsByTagName("canvas");
				e.srcElement.setAttribute("href", cvs.item(1).toDataURL());
			},
			joinGame: joinGame,
			saveSnapshot: function() {
				// スナップショット要求の発火
				if (props.game.snapshotRequest) {
					props.game.snapshotRequest.fire();
				}
			},
			removeSnapshot: removeSnapshot,
			loadSnapshot: function(name) {
				console.log("snapshot loaded: " + name);
				var snapshot = snapshots[name];

				// developerメニューの把握するカメラを全リセット
				data.cameras = [];
				cameras = [];
				// プレイヤー情報を再現 (この復元はゲームコンテンツのプレイヤー情報の復元とは関係がない)
				data.players = snapshot.players;

				props.game._reset({
					age: snapshot.age,
					randGen: g.XorshiftRandomGenerator.deserialize(snapshot.randGenSer)
				});
				props.game._loadAndStart({ snapshot: snapshot.gameSnapshot });
			},
			previewSnapshot: function(index, name) {
				data.snapshotPreview = {
					name: name,
					data: snapshotsList[index].data
				};
			},
			savePlaylog: savePlaylog,
			reloadPlaylog: reloadPlaylog,
			rewindReplay: rewindReplay,
			playPauseReplay: playPauseReplay,
			onClickTimeProgress: onClickTimeProgress,
			accelerateReplay: accelerateReplay,
			decelerateReplay: decelerateReplay,
			playFromHere: playFromHere,
			removePlaylog: removePlaylog,
			setFocusingCamera: function(index) {
				var c = cameras[index];
				if (props.game.focusingCamera !== c) {
					props.game.focusingCamera = c;
				} else {
					props.game.focusingCamera = undefined;
				}
				// TODO: GAMEDEV-2414, GAMEDEV-2415
				props.game.modified = true;
			},
			updateEntityList: updateEntityList,
			consoleDump: function() {
				var e = data.targetEntity;
				if (e.local) {
					console.log(props.game._localDb[e.id]);
				} else {
					console.log(props.game.db[e.id]);
				}
			},
			onEventsToSendChanged: function() {
				saveConfig();
			},
			onAutoSendEventsChanged: function() {
				if (config.sendsSessionParameter && data.isIchibaContent) {
					config.sendsSessionParameter = false; //NicoNico タブのセッションパラメータを送るを無効化
					var err = {
						message: `Events タブの "ゲーム開始時にEventを自動送信" と NicoNico タブの "セッションパラメータを送る" を両方同時に有効にすることはできません。NicoNicoタブの "セッションパラメータを送る" 機能を無効にしました。`,
						isHideTitle: true,
						isHideBody: true
					}
					showErrorDialog(err);
				}
				saveConfig();
			},
			insertEventString: insertEventString,
			sendEvents: sendEvents,
			sendEventsWithValue: sendEventsWithValue,
			onAutoJoinChanged: function() {
				saveConfig();
			},
			onSendsSessionParameterChanged: function() {
				if (config.autoSendEvents && config.eventsToSend) {
					config.autoSendEvents = false; // Events タブのゲーム開始時にEventを自動送信を無効化
					var err = {
						message: `NicoNico タブの "セッションパラメータを送る" と Events タブの "ゲーム開始時にEventを自動送信" を両方同時に有効にすることはできません。Eventsタブの "ゲーム開始時にEventを自動送信" 機能を無効にしました。`,
						isHideTitle: true,
						isHideBody: true
					}
					showErrorDialog(err);
				}
				saveConfig();
			},
			onModeChanged: function() {
				saveConfig();
			},
			onTotalTimeLimitChanged: function() {
				saveConfig();
			},
			onStopGameChanged: function() {
				saveConfig();
			},
			onUsePreferredTotalTimeLimitChanged: function () {
				saveConfig();
			},
			toggleGrid: toggleGrid,
			toggleOmitInterpolatedTick: toggleOmitInterpolatedTick,
			hideErrorDialog: hideErrorDialog
		}
	});
};
