"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonState = exports.MainGameScene = exports.createMainGameScene = void 0;

var akashic_label_1 = require("@akashic-extension/akashic-label");

var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

var SceneBase_1 = require("../SceneBase");

var StateManager_1 = require("../../StateManager");

var MainGameBehavior_1 = require("./MainGameBehavior");

var UserTouchState_1 = require("../../types/UserTouchState");

var MessageEventType_1 = require("../../types/MessageEventType");

var Field_1 = require("../../entity/Field");

var Snake_1 = require("../../entity/Snake");

var assetIds_1 = require("../../assetIds");

var Food_1 = require("../../entity/Food");

var Jewel_1 = require("../../entity/Jewel");

var utils_1 = require("../../commonUtils/utils");

var PopupNotice_1 = require("../../entity/PopupNotice");

var ScorePanel_1 = require("../../entity/ScorePanel");

var TimePanel_1 = require("../../entity/TimePanel");

var MiniMap_1 = require("../../entity/MiniMap");

var DashingGauge_1 = require("../../entity/DashingGauge");

var StateRoleChecker_1 = require("../../utils/StateRoleChecker");

function createMainGameScene(stateManager) {
  var foodCharsAsset = g.game.assets.foodAvailableChars;
  var foodChars = JSON.parse(foodCharsAsset.data).foodAvailableChars;
  var assetIds = [];
  assetIds.push.apply(assetIds, assetIds_1.snakeAssetIds);
  assetIds.push.apply(assetIds, assetIds_1.uiAssetIds);
  assetIds.push.apply(assetIds, assetIds_1.fontAssetIds);
  assetIds.push.apply(assetIds, assetIds_1.audioAssetIds);
  assetIds.push.apply(assetIds, assetIds_1.effectAssetIds);
  var mainGameScene = new MainGameScene({
    game: g.game,
    stateManager: stateManager,
    assetIds: assetIds,
    foodChars: foodChars
  });
  return mainGameScene;
}

exports.createMainGameScene = createMainGameScene;

var MainGameScene =
/** @class */
function (_super) {
  __extends(MainGameScene, _super);

  function MainGameScene(param) {
    var _this = _super.call(this, param) || this;

    _this.stateManager = param.stateManager;
    _this.timeline = new akashic_timeline_1.Timeline(_this);
    _this.foodChars = param.foodChars;
    _this.localParameter = {
      noticeList: [],
      remainGameTimer: null,
      remainTime: _this.stateManager.sessionParameter.config.time.limit,
      timePanel: null,
      killCountPanel: null,
      lengthCountPanel: null,
      preKillCount: 0,
      preLengthCount: 0,
      rankingPanel: null,
      topPlayerLabelList: [],
      broadcasterRankLabel: null,
      yourRankLabel: null,
      lastPointUpTime: -_this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps,
      startDoubleTapTime: -_this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps,
      dashingGauge: _this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps,
      dashingGaugeBar: null,
      respawnButton: null,
      broadcasterDisplayViewing: null,
      playerCountRank: 0,
      miniMap: null,
      jewelPop: null,
      pointDownMarker: null
    };
    _this.lastKillNoticeAge = _this.game.age;
    _this.killNoticeCount = 0;
    _this.maxKillNoticeCount = 2;

    _this.onLoad.add(function () {
      _this.setBehavior(new MainGameBehavior_1.MainGameBehavior({
        scene: _this,
        stateManager: _this.stateManager
      }));

      _this.setMessageEventListener();

      if (g.game.isActiveInstance()) _this.stateManager.setupInitLayout();
    });

    _this.onUpdate.add(function () {
      _this._updateScene();

      _this._updateDeadSnakeCamera();

      if (!!g.game.selfId && !!_this.stateManager.playerList[g.game.selfId] && !!_this.stateManager.playerList[g.game.selfId].uiState) {
        _this._updateInPlayer();
      }

      if (g.game.isActiveInstance()) {
        _this._updateInActiveInstance();
      }

      if (!!g.game.selfId && !_this.stateManager.playerList[g.game.selfId]) {
        _this._updateInNonPlayer();
      }
    });

    _this._setInterval();

    return _this;
  }

  MainGameScene.prototype.init = function (playerInitLayoutList) {
    this._applyInitPlayerLayoutData(playerInitLayoutList);

    this._createRoot();

    this._createBackground();

    this._createTouchArea();

    this._createPlayersSnakes(playerInitLayoutList);

    this._createDashGaugeBar();

    this._createUserNameLabels();

    this._createTimeView();

    this._createRankingView();

    this._createScoreView();

    this._createBroadcasterDisplayView();

    this._initJewel();

    this._createMiniMapView();

    this._createPointdownView();

    this._playBGM();

    this._setSE();

    if (!!this.stateManager.sessionParameter.config.debug && this.stateManager.sessionParameter.config.debug.skipLottery) {
      this._createDebugView();
    }
  };

  MainGameScene.prototype.setCountDownIntervalInActiveInstance = function () {
    var _this = this;

    if (this.localParameter.remainGameTimer != null || !this.stateManager.sessionParameter.config.time.isTimeBased) return;
    this.localParameter.remainGameTimer = this.setInterval(function () {
      if (_this.localParameter.remainTime == null) {
        if (_this.localParameter.remainGameTimer != null) {
          _this.clearInterval(_this.localParameter.remainGameTimer);

          _this.localParameter.remainGameTimer = null;
        }

        return;
      }

      if (_this.localParameter.remainTime <= 0) {
        if (_this.localParameter.remainGameTimer != null) {
          _this.clearInterval(_this.localParameter.remainGameTimer);

          _this.localParameter.remainGameTimer = null;
        }

        _this.stateManager.gameEndProcedure();
      }

      var time = --_this.localParameter.remainTime;

      if (time >= 0) {
        var message = {
          messageType: MessageEventType_1.MessageEventType.updateRemainTime,
          messageData: {
            remainTime: time
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      }
    }, 1000);
  };

  MainGameScene.prototype.receivePlayersInConflict = function (playersInConflict) {
    var _this = this;

    playersInConflict.forEach(function (info) {
      var deadPlayerId = info.deadPlayerId;
      var killerPlayerId = info.killerPlayerId;

      if (!!_this.stateManager.playerList[deadPlayerId] && !!_this.stateManager.playerList[deadPlayerId].snake && _this.stateManager.playerList[deadPlayerId].state === StateManager_1.PlayerState.playing) {
        ++_this.stateManager.playerList[killerPlayerId].killCount; // SE再生

        if (deadPlayerId === g.game.selfId || killerPlayerId === g.game.selfId || _this._isAudience(g.game.selfId) && (deadPlayerId === _this.stateManager.broadcaster.id || killerPlayerId === _this.stateManager.broadcaster.id)) {
          // 頭衝突時に2重にSEが再生されることを防ぐ
          _this.stateManager.audioAssets[StateManager_1.AudioType.Collision].stop();

          _this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Collision);
        } // キル通知作成


        if (g.game.age === _this.lastKillNoticeAge) {
          _this.killNoticeCount++;
        } else {
          _this.lastKillNoticeAge = g.game.age;
          _this.killNoticeCount = 0;
        }

        if (_this.killNoticeCount < _this.maxKillNoticeCount) {
          var killNotice = _this._createNotice(PopupNotice_1.NoticeType.Kill, killerPlayerId);

          _this._addNotice(killNotice);
        } // ユーザー名ラベルをhide


        _this.stateManager.userNameLabels[deadPlayerId].hide(); // ポップ、ダッシュゲージをhide


        if (deadPlayerId === g.game.selfId) {
          _this.localParameter.jewelPop.opacity = 0.0;

          _this.localParameter.dashingGaugeBar.hide();
        }

        _this._dropSnakeBody(deadPlayerId);

        _this.stateManager.playerList[deadPlayerId].state = StateManager_1.PlayerState.staging;

        _this.stateManager.playerList[deadPlayerId].snake.explosion();
      }
    });
  };

  MainGameScene.prototype.manageSnakeDestructionInActiveInstance = function (playersInConflict) {
    var _this = this;

    playersInConflict.forEach(function (info) {
      var deadPlayerId = info.deadPlayerId;

      if (!!_this.stateManager.playerList[deadPlayerId] && !!_this.stateManager.playerList[deadPlayerId].snake && _this.stateManager.playerList[deadPlayerId].state === StateManager_1.PlayerState.staging) {
        // キルされた時の演出
        _this.setTimeout(function () {
          _this._snakeDestructionEventFlow(deadPlayerId);
        }, 100 * (_this.stateManager.playerList[deadPlayerId].snake.segments.length + 1) + 800); // 爆破エフェクトが終わるまで待機

      }
    });
  };

  MainGameScene.prototype.snakeDestructionProcedure = function (deadPlayerId) {
    if (!!this.stateManager.playerList[deadPlayerId] && !!this.stateManager.playerList[deadPlayerId].snake && this.stateManager.playerList[deadPlayerId].state === StateManager_1.PlayerState.staging) {
      this.stateManager.playerList[deadPlayerId].destroySnake();
      if (this.stateManager.isGameOver) return; // 「放送者画面視聴中」

      if (deadPlayerId === g.game.selfId) {
        if (this._isAudience(g.game.selfId)) {
          this.localParameter.broadcasterDisplayViewing.show();
        }
      }

      if (deadPlayerId === g.game.selfId) {
        if (this.stateManager.isBroadcaster) {
          // 放送者リスポーンボタン表示
          if (this.stateManager.playerList[deadPlayerId].respawnTimes > 0) this._createRespawnView();else this._createAngelSnakeView();
        } else {
          // 視聴者リスポーンボタン表示
          if (this.stateManager.playerList[deadPlayerId].respawnTimes > 0) this._createRespawnView();else this._createUnableRespawnView();
        }
      }
    }
  };

  MainGameScene.prototype.modifyBroadcasterAngelSnake = function () {
    var _this = this;

    var angelSnake = this.stateManager.playerList[this.stateManager.broadcaster.id].snake;
    angelSnake.head.body._surface = g.SurfaceUtil.asSurface(this.assets["snake" + angelSnake.snakeType + "_head_death"]);
    angelSnake.head.opacity = 0.5;
    angelSnake.head.body.invalidate();
    angelSnake.segments.forEach(function (seg) {
      seg.body._surface = g.SurfaceUtil.asSurface(_this.assets.snake_body_death);
      seg.opacity = 0.5;
      seg.body.invalidate();
    });
  };

  MainGameScene.prototype.switchGoldenSnake = function (ownerId, stolenPlayerId) {
    var _this = this;

    if (!this.stateManager.playerList[ownerId].snake) return;

    if (stolenPlayerId != null) {
      var stolenSnake_1 = this.stateManager.playerList[stolenPlayerId].snake;
      stolenSnake_1.head.body._surface = g.SurfaceUtil.asSurface(this.assets["snake" + stolenSnake_1.snakeType + "_head_alive"]);
      stolenSnake_1.head.body.invalidate();
      stolenSnake_1.segments.forEach(function (seg) {
        if (seg.type === Snake_1.SnakeSegmentType.Jewel) return;
        seg.body._surface = g.SurfaceUtil.asSurface(_this.assets["snake" + stolenSnake_1.snakeType + "_body"]);
        seg.body.invalidate();
      });
    }

    var jewelOwnerSnake = this.stateManager.playerList[ownerId].snake;
    jewelOwnerSnake.head.body._surface = g.SurfaceUtil.asSurface(this.assets["snake" + jewelOwnerSnake.snakeType + "_head_gold"]);
    jewelOwnerSnake.head.body.invalidate();
    jewelOwnerSnake.segments.forEach(function (seg) {
      if (seg.type === Snake_1.SnakeSegmentType.Jewel) return;
      seg.body._surface = g.SurfaceUtil.asSurface(_this.assets.snake_body_gold);
      seg.body.invalidate();
    }); // お宝ゲット通知

    var jewelNotice = this._createNotice(PopupNotice_1.NoticeType.Jewel, ownerId);

    this._addNotice(jewelNotice); // お宝ゲットポップアップ/SE再生


    if (ownerId === g.game.selfId || this._isAudience(g.game.selfId) && ownerId === this.stateManager.broadcaster.id) {
      this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Jewel);
      this.timeline.create(this.localParameter.jewelPop).moveBy(0, -120, 200).con().fadeIn(150).wait(1000).moveBy(0, 120, 200).con().fadeOut(150);
    }
  };

  MainGameScene.prototype.rewriteRanking = function (rankingAccountData) {
    var _this = this; // 初期化（5人未満になった場合などにランキングがおかしくなるのを避ける）


    this.localParameter.topPlayerLabelList.forEach(function (label) {
      label.hide();
    });
    var numRanks = Math.min(rankingAccountData.length, 5);

    for (var rank = 0; rank < numRanks; ++rank) {
      var name_1 = utils_1.clampString(rankingAccountData[rank].name, 10, "…");
      var label = this.localParameter.topPlayerLabelList[rank];

      if (label.text !== name_1) {
        label.text = name_1;
        label.invalidate();
      }

      label.show();
    }

    var broadcasterRank = -1;
    rankingAccountData.forEach(function (account, i) {
      if (broadcasterRank !== -1) return;
      if (account.id === _this.stateManager.broadcaster.id) broadcasterRank = i;
    });
    this.localParameter.broadcasterRankLabel.text = broadcasterRank !== -1 ? "" + (broadcasterRank + 1) : "-";
    this.localParameter.broadcasterRankLabel.invalidate();

    if (!this.stateManager.isBroadcaster && !!this.stateManager.playerList[g.game.selfId]) {
      var yourRank_1 = -1;
      rankingAccountData.forEach(function (account, i) {
        if (yourRank_1 !== -1) return;
        if (account.id === g.game.selfId) yourRank_1 = i;
      });
      var yourRankLabel = this.localParameter.yourRankLabel;
      var yourRankText = yourRank_1 !== -1 ? "" + (yourRank_1 + 1) : "-";

      if (yourRankLabel.text !== yourRankText) {
        yourRankLabel.text = yourRankText;
        yourRankLabel.invalidate();
      }
    }
  };

  MainGameScene.prototype.rewriteTime = function (remainTime) {
    if (!this.stateManager.sessionParameter.config.time.isTimeBased) return;
    this.localParameter.remainTime = remainTime;
    this.localParameter.timePanel.updateTime(remainTime);
  };

  MainGameScene.prototype.showCountDown = function (countDownType) {
    var _this = this;

    var countDownAsset;

    switch (countDownType) {
      case MessageEventType_1.CountDownType.Start:
        this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Start);
        countDownAsset = this.assets.main_count_start;
        break;

      case MessageEventType_1.CountDownType.Three:
        this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Count);
        countDownAsset = this.assets.main_count_3;
        break;

      case MessageEventType_1.CountDownType.Two:
        this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Count);
        countDownAsset = this.assets.main_count_2;
        break;

      case MessageEventType_1.CountDownType.One:
        this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Count);
        countDownAsset = this.assets.main_count_1;
        break;

      default: // do nothing

    }

    var countDown = new g.Sprite({
      scene: this,
      src: countDownAsset,
      x: g.game.width / 2,
      y: g.game.height / 2,
      anchorX: 0.5,
      anchorY: 0.5,
      opacity: 0.0
    });
    this.userFollowingLayer.append(countDown);
    this.timeline.create(countDown).fadeIn(450, akashic_timeline_1.Easing.easeInExpo).wait(500).call(function () {
      _this.userFollowingLayer.remove(countDown);

      if (!countDown.destroyed()) countDown.destroy();
    });
  };

  MainGameScene.prototype.showFinishView = function () {
    this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Finish);
    var countDown = new g.Sprite({
      scene: this,
      src: this.assets.main_count_finish,
      x: g.game.width / 2,
      y: g.game.height / 2,
      anchorX: 0.5,
      anchorY: 0.5,
      opacity: 0.0
    });
    this.userFollowingLayer.append(countDown);
    this.timeline.create(countDown).fadeIn(450, akashic_timeline_1.Easing.easeInExpo); // リスポーンボタンが表示されていたら消す

    if (this.localParameter.respawnButton != null) {
      this.localParameter.respawnButton.destroy();
      this.localParameter.respawnButton = null;
    }
  };

  MainGameScene.prototype.showBroadcasterDisplayViewing = function () {
    var _this = this;

    if (this.stateManager.isBroadcaster || this.stateManager.isGameOver) return;
    var panel = new g.Sprite({
      scene: this,
      src: this.assets.main_deathpop,
      x: g.game.width / 2,
      y: g.game.height / 2,
      anchorX: 0.5,
      anchorY: 0.5,
      opacity: 0.0
    });
    this.userFollowingLayer.append(panel);
    this.timeline.create(panel).fadeIn(450, akashic_timeline_1.Easing.easeInExpo).wait(2000).fadeOut(450).call(function () {
      if (!panel.destroyed()) {
        _this.remove(panel);

        panel.destroy();
      }
    });
  };

  MainGameScene.prototype._updateScene = function () {
    var _this = this;

    Object.keys(this.stateManager.playerList).forEach(function (playerId) {
      if (!_this.stateManager.playerList[playerId] || !_this.stateManager.playerList[playerId].camera || !_this.stateManager.playerList[playerId].snake) return;
      var snake = _this.stateManager.playerList[playerId].snake;
      var state = _this.stateManager.playerList[playerId].uiState.state;

      if (StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[playerId].state, StateRoleChecker_1.StateRoleType.CanMoveType)) {
        // スネークの向き調整　サーバーインスタンスでのみ実行
        _this._manageSnakeHeadOnServerInstance(playerId, snake, state); // スネークの移動


        _this._updateSnake(playerId, snake, state);
      } // カメラの追従


      var playerCamera = _this.stateManager.playerList[playerId].camera;

      if (!playerCamera) {
        console.log("camera not found! id:", playerId);
        return;
      }

      playerCamera.x = snake.head.x - g.game.width / 2;
      playerCamera.y = snake.head.y - g.game.height / 2;
      playerCamera.modified(); // タッチレイヤーの追従

      if (playerId === g.game.selfId) {
        _this.userFollowingLayer.x = playerCamera.x;
        _this.userFollowingLayer.y = playerCamera.y;

        _this.userFollowingLayer.modified();
      }

      if (_this.stateManager.userNameLabels[playerId].visible()) {
        _this.stateManager.userNameLabels[playerId].x = snake.head.x - 150 - _this.userFollowingLayer.x;
        _this.stateManager.userNameLabels[playerId].y = snake.head.y - 100 - _this.userFollowingLayer.y;

        _this.stateManager.userNameLabels[playerId].modified();
      }
    });

    this._updateDashGauge();

    this._updateFieldRadius();
  }; //* * ゲーム参加者でのみ実行するupdateトリガー処理 */


  MainGameScene.prototype._updateInPlayer = function () {
    // ダッシュゲージ処理
    switch (this.stateManager.playerList[g.game.selfId].uiState.state) {
      case UserTouchState_1.UserTouchState.onDoubleTap:
        this._checkStopDashing();

        this.localParameter.dashingGauge = Math.max(0, this.localParameter.dashingGauge - 1);
        break;

      default:
        this.localParameter.dashingGauge = Math.min(this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps, this.localParameter.dashingGauge + this.stateManager.sessionParameter.config.snake.amountDashingGaugeRecoveryPerFrame);
    } // スコアカウント、ミニマップ処理


    switch (this.stateManager.playerList[g.game.selfId].state) {
      case StateManager_1.PlayerState.playing:
        this._updateKillCount(g.game.selfId);

        this._updateLengthCount(g.game.selfId);

        this._updateMiniMap(g.game.selfId);

        break;

      case StateManager_1.PlayerState.dead:
        this._updateKillCount(this.stateManager.broadcaster.id);

        this._updateLengthCount(this.stateManager.broadcaster.id);

        this._updateMiniMap(this.stateManager.broadcaster.id);

        break;

      case StateManager_1.PlayerState.ghost:
        this._updateKillCount(this.stateManager.broadcaster.id);

        this._updateLengthCount(this.stateManager.broadcaster.id);

        this._updateMiniMap(this.stateManager.broadcaster.id);

        break;

      case StateManager_1.PlayerState.invincible:
        this._updateKillCount(g.game.selfId);

        this._updateLengthCount(g.game.selfId);

        this._updateMiniMap(g.game.selfId);

        break;

      case StateManager_1.PlayerState.staging:
        this._updateKillCount(g.game.selfId);

        this._updateLengthCount(g.game.selfId);

        this._updateMiniMap(g.game.selfId);

        break;

      default: // do nothing

    }
  }; //* * サーバーインスタンスでのみ実行するupdateトリガー処理 */


  MainGameScene.prototype._updateInActiveInstance = function () {
    this.stateManager.checkEatenFoods(this.stage.nowWidth / 2);
    this.stateManager.checkEatenJewel();
    this.stateManager.checkSnakeCollision();
    this.stateManager.checkGameEnd();
    this.stateManager.updateRanking();
    this.stateManager.checkJewelOutsideField(this.stage.nowWidth / 2);
  }; //* * ゲーム不参加者でのみ実行するupdateトリガー処理 */


  MainGameScene.prototype._updateInNonPlayer = function () {
    this._updateNonPlayerCamera();

    this._updateKillCount(this.stateManager.broadcaster.id);

    this._updateLengthCount(this.stateManager.broadcaster.id);

    this._updateMiniMap(this.stateManager.broadcaster.id);
  };

  MainGameScene.prototype._updateSnake = function (playerId, snake, state) {
    var deg = (this.stateManager.playerList[playerId].uiState.direction / this.stateManager.sessionParameter.config.userInput.radianFineness * 360 + 90) % 360;
    var field = {
      width: this.stage.nowWidth,
      height: this.stage.nowHeight
    };
    snake.update({
      angle: deg,
      state: state,
      field: field
    });
  };

  MainGameScene.prototype._updateDeadSnakeCamera = function () {
    var _this = this;

    Object.keys(this.stateManager.playerList).forEach(function (playerId) {
      if (playerId !== _this.stateManager.broadcaster.id && _this.stateManager.playerList[playerId].state === StateManager_1.PlayerState.dead) {
        var playerCamera = _this.stateManager.playerList[playerId].camera;

        if (!playerCamera) {
          console.log("camera not found! id:", playerId);
          return;
        }

        var broadcasterId = _this.stateManager.broadcaster.id;

        if (!!_this.stateManager.playerList[broadcasterId].snake) {
          playerCamera.x = _this.stateManager.playerList[broadcasterId].snake.head.x - g.game.width / 2;
          playerCamera.y = _this.stateManager.playerList[broadcasterId].snake.head.y - g.game.height / 2;
          playerCamera.modified();
        }

        if (playerId === g.game.selfId) {
          _this.userFollowingLayer.x = playerCamera.x;
          _this.userFollowingLayer.y = playerCamera.y;

          _this.userFollowingLayer.modified();
        }
      }
    });
  };

  MainGameScene.prototype._updateNonPlayerCamera = function () {
    var playerCamera = this.stateManager.playerList[this.stateManager.broadcaster.id].camera;
    if (!playerCamera) return;
    this.userFollowingLayer.x = playerCamera.x;
    this.userFollowingLayer.y = playerCamera.y;
    this.userFollowingLayer.modified();
  };

  MainGameScene.prototype._updateKillCount = function (targetPlayerId) {
    var score = this.stateManager.playerList[targetPlayerId].killCount;
    this.localParameter.killCountPanel.updateScore(score);

    if (!this._isAudience(g.game.selfId)) {
      // 放送者画面に遷移した後に、前のキル数 preKillCount が更新されてしまい、リスポーン時に誤って演出が再生されてしまうのを防ぐ PR#195
      if (score > this.localParameter.preKillCount) {
        this.localParameter.killCountPanel.swell();
      }

      this.localParameter.preKillCount = score;
    }
  };

  MainGameScene.prototype._updateLengthCount = function (targetPlayerId) {
    if (!this.stateManager.playerList[targetPlayerId].snake || this.stateManager.playerList[targetPlayerId].state === StateManager_1.PlayerState.dead) return;
    var score = this.stateManager.playerList[targetPlayerId].snake.words.length;
    this.localParameter.lengthCountPanel.updateScore(score);

    if (score > this.localParameter.preLengthCount && (score % 10 === 0 || this.localParameter.preLengthCount % 10 > score % 10) // 新たな score が 10の倍数を飛び越えるケースがあるため
    ) {
      this.localParameter.lengthCountPanel.swell();
    }

    this.localParameter.preLengthCount = score;
  };

  MainGameScene.prototype._updateMiniMap = function (targetPlayerId) {
    var nowOwnerId = this.stateManager.jewelData.ownerId;
    var jewelCommonOffset;

    if (nowOwnerId != null) {
      // お宝所有者がいる場合
      if (!StateRoleChecker_1.checkStateRole(this.stateManager.playerList[nowOwnerId].state, StateRoleChecker_1.StateRoleType.CanDropType)) return;
      var segments = this.stateManager.playerList[nowOwnerId].snake.segments;
      var jewel = segments[segments.length - 1];
      if (!jewel || jewel.type !== Snake_1.SnakeSegmentType.Jewel) return;
      jewelCommonOffset = {
        x: jewel.x + jewel.body.x,
        y: jewel.y + jewel.body.y
      };
    } else {
      jewelCommonOffset = {
        x: this.stateManager.jewelData.jewel.jewel.x,
        y: this.stateManager.jewelData.jewel.jewel.y
      };
    }

    this.localParameter.miniMap.updateMap({
      yourPlayerInfo: this.stateManager.playerList[targetPlayerId],
      field: {
        width: this.stage.nowWidth,
        height: this.stage.nowHeight
      },
      foodList: this.stateManager.foodList,
      jewelCommonOffset: jewelCommonOffset
    });
  };

  MainGameScene.prototype._updateFieldRadius = function () {
    if (!this.stateManager.sessionParameter.config.debug || !this.stateManager.sessionParameter.config.debug.skipLottery) {
      var newPlayerCountRank = this.stateManager.dividePlayerCountIntoTiers();

      if (newPlayerCountRank > this.localParameter.playerCountRank) {
        this.localParameter.playerCountRank = newPlayerCountRank;
      }
    }

    this.stage.narrowArea(Math.max(this.stage.nowWidth - 2 * this.stateManager.sessionParameter.config.field.narrowRadiusPerSec / g.game.fps, 2 * this.stateManager.sessionParameter.config.field.radius[this.localParameter.playerCountRank]));
  };

  MainGameScene.prototype._updateDashGauge = function () {
    if (!this.localParameter.dashingGaugeBar.visible()) return;

    if (this.localParameter.dashingGauge >= this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps && this.localParameter.dashingGaugeBar.opacity === 1.0) {
      this.timeline.create(this.localParameter.dashingGaugeBar).fadeOut(200);
    } else if (this.localParameter.dashingGauge < this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps && this.localParameter.dashingGaugeBar.opacity === 0.0) {
      this.timeline.create(this.localParameter.dashingGaugeBar).fadeIn(200);
    }

    this.localParameter.dashingGaugeBar.updateGauge(this.localParameter.dashingGauge / g.game.fps);
  };
  /**
   * 定期的に実行する処理
   */


  MainGameScene.prototype._setInterval = function () {
    var _this = this;

    this.setInterval(function () {
      // Foodを撒く
      if (Object.keys(_this.stateManager.playerList).filter(function (playerId) {
        return StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[playerId].state, StateRoleChecker_1.StateRoleType.CanCountType);
      }).length > 0 && _this.stateManager.foodList.length <= _this.stateManager.maxFoodListLength) {
        // 生き残ってるSnakeがいれば
        for (var i = 0; i < _this.stateManager.sessionParameter.config.food.volume[_this.localParameter.playerCountRank]; i++) {
          var foodAppearanceLength = _this.stateManager.sessionParameter.config.field.radius[_this.localParameter.playerCountRank] / 2;

          var food = _this._createFood({
            x: g.game.random.generate() * foodAppearanceLength * 2 - foodAppearanceLength,
            y: g.game.random.generate() * foodAppearanceLength * 2 - foodAppearanceLength,
            word: _this.foodChars[g.game.random.get(0, _this.foodChars.length - 1)]
          });

          _this.stateManager.waitingFoodList.push(food);
        }
      }
    }, this.stateManager.sessionParameter.config.food.interval);
  };

  MainGameScene.prototype._applyInitPlayerLayoutData = function (playerInitLayoutList) {
    var _this = this;

    Object.keys(playerInitLayoutList).forEach(function (playerId) {
      var layoutData = playerInitLayoutList[playerId];
      _this.stateManager.playerList[playerId].uiState = {
        direction: layoutData.direction,
        state: layoutData.state
      };
    });
  };

  MainGameScene.prototype._createRoot = function () {
    this.root = new g.E({
      scene: this
    });
    this.append(this.root);
    this.bgLayer = new g.E({
      scene: this
    });
    this.root.append(this.bgLayer);
    this.foodLayer = new g.E({
      scene: this
    });
    this.root.append(this.foodLayer);
    this.snakeLayer = new g.E({
      scene: this
    });
    this.root.append(this.snakeLayer);
    this.userFollowingLayer = new g.E({
      scene: this
    });
    this.root.append(this.userFollowingLayer);
    this.noticeLayer = new g.E({
      scene: this
    });
    this.userFollowingLayer.append(this.noticeLayer);
  };

  MainGameScene.prototype._createBackground = function () {
    this.localParameter.playerCountRank = this.stateManager.dividePlayerCountIntoTiers();
    if (!!this.stateManager.sessionParameter.config.debug && this.stateManager.sessionParameter.config.debug.skipLottery) this.localParameter.playerCountRank = 0;
    var fieldRadius = this.stateManager.sessionParameter.config.field.radius[this.localParameter.playerCountRank];
    var bg = new g.FilledRect({
      scene: this,
      cssColor: "#001144",
      x: -fieldRadius * 2,
      y: -fieldRadius * 2,
      width: fieldRadius * 4,
      height: fieldRadius * 4,
      opacity: this.stateManager.sessionParameter.config.field.bgOpacity
    });
    this.bgLayer.append(bg);
    this.stage = new Field_1.Field({
      scene: this,
      width: fieldRadius * 2,
      height: fieldRadius * 2,
      x: -fieldRadius,
      y: -fieldRadius,
      opacity: this.stateManager.sessionParameter.config.field.bgOpacity
    });
    this.bgLayer.append(this.stage);
  };

  MainGameScene.prototype._createTouchArea = function () {
    var _this = this;

    this.touchArea = new g.E({
      scene: this,
      width: g.game.width,
      height: g.game.height,
      local: true,
      touchable: true
    });
    this.userFollowingLayer.append(this.touchArea);
    this.touchArea.onPointDown.add(function (event) {
      if (!_this.stateManager.playerList[g.game.selfId] || _this.stateManager.playerList[g.game.selfId].preventType === MessageEventType_1.PreventType.TouchState || !StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[g.game.selfId].state, StateRoleChecker_1.StateRoleType.CanOperateType)) return;
      var doublePointDuration = _this.stateManager.sessionParameter.config.userInput.doublePointDuration;
      var touchPoint = {
        x: event.point.x - g.game.width / 2,
        y: event.point.y - g.game.height / 2
      };
      var deg = calculateRadFromPoint(touchPoint).deg;
      var userInput = _this.stateManager.sessionParameter.config.userInput;
      var directionUnit = 360 / userInput.radianFineness;
      var direction = Math.floor((deg + 180) / directionUnit);
      var touchState = UserTouchState_1.UserTouchState.onPoint;

      if (g.game.age - _this.localParameter.lastPointUpTime <= doublePointDuration * g.game.fps) {
        _this.localParameter.startDoubleTapTime = g.game.age;
        touchState = UserTouchState_1.UserTouchState.onDoubleTap;

        if (StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[g.game.selfId].state, StateRoleChecker_1.StateRoleType.CanSoundType)) {
          _this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Dash);
        }
      }

      var message = {
        messageType: MessageEventType_1.MessageEventType.changeUserTouchState,
        messageData: {
          id: g.game.selfId,
          newDirection: direction,
          newState: touchState
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));

      if (StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[g.game.selfId].state, StateRoleChecker_1.StateRoleType.CanOperateType)) {
        _this.localParameter.pointDownMarker.x = event.point.x;
        _this.localParameter.pointDownMarker.y = event.point.y;

        _this.localParameter.pointDownMarker.modified();

        _this.localParameter.pointDownMarker.show();
      }
    });
    this.touchArea.onPointMove.add(function (event) {
      if (!_this.stateManager.playerList[g.game.selfId] || _this.stateManager.playerList[g.game.selfId].uiState.state === UserTouchState_1.UserTouchState.onDoubleTap || _this.stateManager.playerList[g.game.selfId].uiState.state === UserTouchState_1.UserTouchState.onHold || !StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[g.game.selfId].state, StateRoleChecker_1.StateRoleType.CanOperateType)) {
        return;
      }

      if (_this.stateManager.playerList[g.game.selfId].preventType === MessageEventType_1.PreventType.TouchState) return;
      var userInput = _this.stateManager.sessionParameter.config.userInput;
      var degAndNorm = calculateRadFromPoint(event.startDelta); // 操作の移動量が大きければ移動入力と解釈する

      if (degAndNorm.norm > userInput.pointMoveDistance) {
        var currentDirection = _this.stateManager.playerList[g.game.selfId].uiState.direction;
        var directionUnit = 360 / userInput.radianFineness;
        var newDirection = Math.floor((degAndNorm.deg + 180) / directionUnit);

        if (currentDirection !== newDirection) {
          var message = {
            messageType: MessageEventType_1.MessageEventType.changeUserTouchState,
            messageData: {
              id: g.game.selfId,
              newDirection: newDirection,
              newState: UserTouchState_1.UserTouchState.onPoint
            }
          };
          g.game.raiseEvent(new g.MessageEvent(message));
        }
      }
    });
    this.touchArea.onPointUp.add(function () {
      if (!_this.stateManager.playerList[g.game.selfId]) return;
      if (_this.stateManager.playerList[g.game.selfId].preventType === MessageEventType_1.PreventType.TouchState) return;

      _this.stateManager.audioAssets[StateManager_1.AudioType.Dash].stop();

      _this.localParameter.lastPointUpTime = g.game.age;
      var message = {
        messageType: MessageEventType_1.MessageEventType.changeUserTouchState,
        messageData: {
          id: g.game.selfId,
          newState: UserTouchState_1.UserTouchState.noPoint
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));

      _this.localParameter.pointDownMarker.hide();
    });
  };

  MainGameScene.prototype._createDashGaugeBar = function () {
    var dashGaugeBaseAsset = this.assets.main_dash_base;
    this.localParameter.dashingGaugeBar = new DashingGauge_1.DashingGauge({
      scene: this,
      width: dashGaugeBaseAsset.width,
      height: dashGaugeBaseAsset.height,
      src: dashGaugeBaseAsset,
      x: g.game.width / 2,
      y: g.game.height / 2 + 80,
      anchorX: 0.5,
      anchorY: 0.5,
      opacity: 0.0,
      maxGaugeAmount: this.stateManager.sessionParameter.config.snake.dashingTime
    });
    this.userFollowingLayer.append(this.localParameter.dashingGaugeBar);
  };

  MainGameScene.prototype._createUserNameLabels = function () {
    var _this = this;

    Object.keys(this.stateManager.playerList).forEach(function (playerId) {
      _this.stateManager.userNameLabels[playerId] = new akashic_label_1.Label({
        scene: _this,
        text: utils_1.clampString(_this.stateManager.playerList[playerId].user.name, 10, "…"),
        textColor: "white",
        font: _this.stateManager.resource.font,
        fontSize: 20,
        width: 300,
        x: _this.stateManager.playerList[playerId].snake.head.x - 150 - _this.userFollowingLayer.x,
        y: _this.stateManager.playerList[playerId].snake.head.y - 100 - _this.userFollowingLayer.y,
        textAlign: "center"
      });

      _this.userFollowingLayer.append(_this.stateManager.userNameLabels[playerId]);
    });
  };

  MainGameScene.prototype._createTimeView = function () {
    if (!this.stateManager.sessionParameter.config.time.isTimeBased) return;
    var timePanelAsset = this.assets.main_base_time;
    this.localParameter.timePanel = new TimePanel_1.TimePanel({
      scene: this,
      width: timePanelAsset.width,
      height: timePanelAsset.height,
      x: 5,
      y: 5,
      backgroundImage: timePanelAsset,
      remainTime: this.localParameter.remainTime,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.timePanel);
  };

  MainGameScene.prototype._createRankingView = function () {
    var rankingPanelAsset = this.assets.main_rank_base;
    this.localParameter.rankingPanel = new g.Sprite({
      scene: this,
      width: rankingPanelAsset.width,
      height: rankingPanelAsset.height,
      y: 590,
      src: rankingPanelAsset,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.rankingPanel);

    for (var rank = 1; rank <= 5; ++rank) {
      var rankIconAsset = this.assets["main_rank_" + rank];
      var rankIcon = new g.Sprite({
        scene: this,
        src: rankIconAsset,
        x: 55 + 361 * ((rank - 1) % 3),
        y: 608 - this.localParameter.rankingPanel.y + 53 * Math.floor((rank - 1) / 3),
        local: true
      });
      this.localParameter.rankingPanel.append(rankIcon);
      var ranker = new akashic_label_1.Label({
        scene: this,
        text: "",
        textColor: "white",
        font: this.stateManager.resource.font,
        fontSize: 24,
        width: 24 * 12,
        x: 127 + 361 * ((rank - 1) % 3),
        y: 614 - this.localParameter.rankingPanel.y + 53 * Math.floor((rank - 1) / 3),
        local: true
      });
      this.localParameter.topPlayerLabelList.push(ranker);
      this.localParameter.rankingPanel.append(ranker);
    }

    var rankBroadcasterIconAsset = this.assets.main_rank_host;
    var rankBroadcasterIcon = new g.Sprite({
      scene: this,
      src: rankBroadcasterIconAsset,
      x: 761,
      y: 661 - this.localParameter.rankingPanel.y,
      local: true
    });
    this.localParameter.rankingPanel.append(rankBroadcasterIcon);
    this.localParameter.broadcasterRankLabel = new akashic_label_1.Label({
      scene: this,
      text: "",
      textColor: "white",
      font: this.stateManager.resource.font,
      fontSize: 26,
      width: 26 * 2,
      x: 860,
      y: 667 - this.localParameter.rankingPanel.y,
      textAlign: "center",
      local: true
    });
    this.localParameter.rankingPanel.append(this.localParameter.broadcasterRankLabel);

    if (!this.stateManager.isBroadcaster) {
      var rankYouIconAsset = this.assets.main_rank_you;
      var rankYouIcon = new g.Sprite({
        scene: this,
        src: rankYouIconAsset,
        x: 968,
        y: 661 - this.localParameter.rankingPanel.y,
        local: true
      });
      this.localParameter.rankingPanel.append(rankYouIcon);
      this.localParameter.yourRankLabel = new akashic_label_1.Label({
        scene: this,
        text: "-",
        textColor: "white",
        font: this.stateManager.resource.font,
        fontSize: 26,
        width: 26 * 2,
        x: 1049,
        y: 667 - this.localParameter.rankingPanel.y,
        textAlign: "center",
        local: true
      });
      this.localParameter.rankingPanel.append(this.localParameter.yourRankLabel);
    }

    this._createRankingButton();
  };

  MainGameScene.prototype._createRankingButton = function () {
    var _this = this;

    var rankingButtonOffAsset = this.assets.main_btn_rank_off;
    var rankingButtonOffTappedAsset = this.assets.main_btn_rank_off_diff;
    var rankingButtonOnAsset = this.assets.main_btn_rank_on;
    var rankingButtonOnTappedAsset = this.assets.main_btn_rank_on_diff;
    var rankingButton = new g.Sprite({
      scene: this,
      src: rankingButtonOffAsset,
      x: 1127,
      y: 560,
      touchable: true,
      local: true,
      tag: ButtonState.Off
    });
    rankingButton.onPointDown.add(function () {
      _this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Select);

      switch (rankingButton.tag) {
        case ButtonState.Off:
          rankingButton._surface = g.SurfaceUtil.asSurface(rankingButtonOffTappedAsset);
          rankingButton.invalidate();
          break;

        case ButtonState.On:
          rankingButton._surface = g.SurfaceUtil.asSurface(rankingButtonOnTappedAsset);
          rankingButton.invalidate();
          break;

        default: // do nothing

      }
    });
    rankingButton.onPointUp.add(function () {
      switch (rankingButton.tag) {
        case ButtonState.Off:
          _this.localParameter.rankingPanel.hide();

          rankingButton.tag = ButtonState.On;
          rankingButton._surface = g.SurfaceUtil.asSurface(rankingButtonOnAsset);
          rankingButton.invalidate();
          break;

        case ButtonState.On:
          _this.localParameter.rankingPanel.show();

          rankingButton.tag = ButtonState.Off;
          rankingButton._surface = g.SurfaceUtil.asSurface(rankingButtonOffAsset);
          rankingButton.invalidate();
          break;

        default: // do nothing

      }
    });
    this.userFollowingLayer.append(rankingButton);
  };

  MainGameScene.prototype._createScoreView = function () {
    var killCountPanelAsset = this.assets.main_base_kill;
    this.localParameter.killCountPanel = new ScorePanel_1.ScorePanel({
      scene: this,
      width: killCountPanelAsset.width,
      height: killCountPanelAsset.height,
      x: 197,
      y: 5,
      backgroundImage: killCountPanelAsset,
      score: 0,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.killCountPanel);
    var lengthCountPanelAsset = this.assets.main_base_length;
    this.localParameter.lengthCountPanel = new ScorePanel_1.ScorePanel({
      scene: this,
      width: lengthCountPanelAsset.width,
      height: lengthCountPanelAsset.height,
      x: 447,
      y: 5,
      backgroundImage: lengthCountPanelAsset,
      score: 0,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.lengthCountPanel);
  };

  MainGameScene.prototype._createBroadcasterDisplayView = function () {
    this.localParameter.broadcasterDisplayViewing = new g.Label({
      scene: this,
      font: this.stateManager.resource.font,
      textColor: "white",
      fontSize: 54,
      text: "放送者画面視聴中…",
      textAlign: "center",
      x: g.game.width / 2,
      y: 80,
      anchorX: 0.5,
      anchorY: 0.0,
      hidden: !this._isAudience(g.game.selfId)
    });
    this.userFollowingLayer.append(this.localParameter.broadcasterDisplayViewing);
  };

  MainGameScene.prototype._createMiniMapView = function () {
    var miniMapBaseAsset = this.assets.main_map_base;
    this.localParameter.miniMap = new MiniMap_1.MiniMap({
      scene: this,
      width: miniMapBaseAsset.width,
      height: miniMapBaseAsset.height,
      x: 1063,
      y: 5,
      field: {
        width: this.stage.nowWidth,
        height: this.stage.nowHeight
      },
      backgroundImage: miniMapBaseAsset,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.miniMap);
  };

  MainGameScene.prototype._createPointdownView = function () {
    var baseAsset = this.assets.field_base;
    this.localParameter.pointDownMarker = new g.Sprite({
      scene: this,
      src: baseAsset,
      opacity: 0.5,
      anchorX: 0.5,
      anchorY: 0.5,
      hidden: true,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.pointDownMarker);
  };

  MainGameScene.prototype._playBGM = function () {
    // BGM再生
    this.stateManager.audioAssets[StateManager_1.AudioType.GameBGM] = this.assets.snake_bgm;
    this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.GameBGM);
  };

  MainGameScene.prototype._setSE = function () {
    this.stateManager.audioAssets[StateManager_1.AudioType.Count] = this.assets.SE_count;
    this.stateManager.audioAssets[StateManager_1.AudioType.Start] = this.assets.SE_start;
    this.stateManager.audioAssets[StateManager_1.AudioType.Finish] = this.assets.SE_finish;
    this.stateManager.audioAssets[StateManager_1.AudioType.Collision] = this.assets.SE_collision;
    this.stateManager.audioAssets[StateManager_1.AudioType.Dash] = this.assets.SE_dash;
    this.stateManager.audioAssets[StateManager_1.AudioType.Jewel] = this.assets.SE_jewel;
    this.stateManager.audioAssets[StateManager_1.AudioType.Select] = this.assets.SE_select;
  };

  MainGameScene.prototype._createRespawnView = function () {
    var _this = this;

    var respawnButtonOffAsset = this.assets.main_btn_spawn_off;
    var respawnButtonOnAsset = this.assets.main_btn_spawn_on;
    this.localParameter.respawnButton = new g.Sprite({
      scene: this,
      src: respawnButtonOffAsset,
      width: respawnButtonOffAsset.width,
      height: respawnButtonOffAsset.height,
      x: 30,
      y: 460,
      local: true,
      touchable: true
    });
    this.localParameter.respawnButton.onPointDown.add(function () {
      _this.localParameter.respawnButton._surface = g.SurfaceUtil.asSurface(respawnButtonOnAsset);

      _this.localParameter.respawnButton.invalidate();
    });
    this.localParameter.respawnButton.onPointUp.add(function () {
      _this.localParameter.respawnButton._surface = g.SurfaceUtil.asSurface(respawnButtonOffAsset);
      _this.localParameter.respawnButton.touchable = false; // 二度押し防止

      _this.localParameter.respawnButton.invalidate();

      if (!_this.stateManager.playerList[g.game.selfId].snake) {
        var respawnMessage = {
          messageType: MessageEventType_1.MessageEventType.respawnSnake
        };
        g.game.raiseEvent(new g.MessageEvent(respawnMessage));
        var preventTouchMessage = {
          messageType: MessageEventType_1.MessageEventType.preventUsertouch,
          messageData: {
            playerId: g.game.selfId,
            preventType: MessageEventType_1.PreventType.TouchState
          }
        };
        g.game.raiseEvent(new g.MessageEvent(preventTouchMessage));
      }
    });
    this.userFollowingLayer.append(this.localParameter.respawnButton);
  };

  MainGameScene.prototype._createAngelSnakeView = function () {
    var _this = this;

    var respawnButtonOffAsset = this.assets.main_btn_spawn_off_angel;
    var respawnButtonOnAsset = this.assets.main_btn_spawn_on_angel;
    this.localParameter.respawnButton = new g.Sprite({
      scene: this,
      src: respawnButtonOffAsset,
      width: respawnButtonOffAsset.width,
      height: respawnButtonOffAsset.height,
      x: 30,
      y: 460,
      local: true,
      touchable: true
    });
    this.localParameter.respawnButton.onPointDown.add(function () {
      _this.localParameter.respawnButton._surface = g.SurfaceUtil.asSurface(respawnButtonOnAsset);

      _this.localParameter.respawnButton.invalidate();
    });
    this.localParameter.respawnButton.onPointUp.add(function () {
      _this.localParameter.respawnButton._surface = g.SurfaceUtil.asSurface(respawnButtonOffAsset);

      _this.localParameter.respawnButton.invalidate();

      if (!_this.stateManager.playerList[g.game.selfId].snake) {
        var message = {
          messageType: MessageEventType_1.MessageEventType.respawnBroadcasterAngelSnake
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      }
    });
    this.userFollowingLayer.append(this.localParameter.respawnButton);
  };

  MainGameScene.prototype._createUnableRespawnView = function () {
    var unableRespawnButtonAsset = this.assets.main_btn_spawn_unable;
    this.localParameter.respawnButton = new g.Sprite({
      scene: this,
      src: unableRespawnButtonAsset,
      width: unableRespawnButtonAsset.width,
      height: unableRespawnButtonAsset.height,
      x: 30,
      y: 460,
      local: true
    });
    this.userFollowingLayer.append(this.localParameter.respawnButton);
  };

  MainGameScene.prototype._createNotice = function (noticeType, playerId) {
    var notice = new PopupNotice_1.PopupNotice({
      scene: this,
      width: 428,
      height: 40,
      x: 848,
      y: 528,
      opacity: 0,
      noticeType: noticeType,
      font: this.stateManager.resource.font,
      name: noticeType === PopupNotice_1.NoticeType.Chance ? "" : this.stateManager.playerList[playerId].user.name,
      local: true
    });
    this.noticeLayer.append(notice);
    return notice;
  };

  MainGameScene.prototype._addNotice = function (newNotice) {
    // noticeList := [0-> fadeIn] [1] [2] [3] [4] [5] [6-> fadeOut] [7:Wait for it to be destroyed]
    this.localParameter.noticeList.unshift(newNotice);

    if (this.localParameter.noticeList.length === 8) {
      var outdatedNotice = this.localParameter.noticeList.pop();
      this.noticeLayer.remove(outdatedNotice);
      if (!outdatedNotice.destroyed()) outdatedNotice.destroy();
    }

    this.localParameter.noticeList.forEach(function (notice, i) {
      if (i === 0) notice.fadeInUp();else if (i === 6) notice.fadeOutUp();else notice.up(i);
    });
  };

  MainGameScene.prototype._createDebugView = function () {
    var _this = this;

    var label = new akashic_label_1.Label({
      scene: this,
      font: this.stateManager.resource.font,
      text: "デバッグ中...",
      textColor: "red",
      fontSize: 36,
      width: 280
    });
    this.userFollowingLayer.append(label);
    var downPlayerCountRankLabel = new akashic_label_1.Label({
      scene: this,
      font: this.stateManager.resource.font,
      text: "縮小",
      textColor: "white",
      fontSize: 36,
      width: 280,
      y: 70,
      touchable: true
    });
    downPlayerCountRankLabel.onPointUp.add(function () {
      _this.localParameter.playerCountRank = Math.min(4, _this.localParameter.playerCountRank + 1);
    });
    this.userFollowingLayer.append(downPlayerCountRankLabel);
  };

  MainGameScene.prototype._createTmpSnake = function (playerId, layoutData) {
    var words = utils_1.stringToArray(layoutData.name).slice(0, Math.min(layoutData.name.length, this.stateManager.sessionParameter.config.snake.maxNameLength));

    if (words.length < this.stateManager.sessionParameter.config.snake.maxNameLength) {
      var blankCount = this.stateManager.sessionParameter.config.snake.maxNameLength - words.length;

      for (var i = 0; i < blankCount; ++i) {
        words.push("　");
      }
    }

    var snake = new Snake_1.Snake({
      parent: this.snakeLayer,
      x: layoutData.position.x,
      y: layoutData.position.y,
      angle: layoutData.direction / this.stateManager.sessionParameter.config.userInput.radianFineness * 360,
      words: words,
      snakeBaseSpeed: this.stateManager.sessionParameter.config.snake.baseSpeed,
      snakeMaxSpeedScale: this.stateManager.sessionParameter.config.snake.maxSpeedScale,
      snakeMaxKnotLength: this.stateManager.sessionParameter.config.snake.maxKnotLength,
      font: this.stateManager.resource.font,
      snakeType: this.stateManager.playerList[playerId].snakeType,
      rebornEffect: false
    });
    return snake;
  };

  MainGameScene.prototype._createPlayersSnakes = function (playerInitLayoutList) {
    var _this = this;

    Object.keys(playerInitLayoutList).forEach(function (playerId) {
      var tmpSnake = _this._createTmpSnake(playerId, playerInitLayoutList[playerId]);

      _this.stateManager.setCameraAndSnake(playerId, tmpSnake);
    }); // ゲーム不参加者の場合

    if (!!g.game.selfId && !this.stateManager.playerList[g.game.selfId]) {
      g.game.focusingCamera = this.stateManager.playerList[this.stateManager.broadcaster.id].camera;
    }
  };

  MainGameScene.prototype._checkStopDashing = function () {
    var dashingTime = this.stateManager.sessionParameter.config.snake.dashingTime;

    if (this.localParameter.dashingGauge <= 0 || g.game.age - this.localParameter.startDoubleTapTime > dashingTime * g.game.fps) {
      this.stateManager.audioAssets[StateManager_1.AudioType.Dash].stop();
      var message = {
        messageType: MessageEventType_1.MessageEventType.changeUserTouchState,
        messageData: {
          id: g.game.selfId,
          newState: UserTouchState_1.UserTouchState.onHold
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };

  MainGameScene.prototype._snakeDestructionEventFlow = function (deadPlayerId) {
    if (this.stateManager.isGameOver || deadPlayerId === this.stateManager.broadcaster.id) {
      var message = {
        messageType: MessageEventType_1.MessageEventType.destroySnake,
        messageData: {
          deadPlayerId: deadPlayerId
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    } else {
      // 「放送者画面に切り替わります」表示
      var message = {
        messageType: MessageEventType_1.MessageEventType.animation,
        messageData: {
          animationType: MessageEventType_1.AnimationType.ToBroadcasterView,
          scope: MessageEventType_1.ScopeType.One,
          playerId: deadPlayerId
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
      this.setTimeout(function () {
        var message = {
          messageType: MessageEventType_1.MessageEventType.destroySnake,
          messageData: {
            deadPlayerId: deadPlayerId
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      }, 3000);
    }
  };

  MainGameScene.prototype._manageSnakeHeadOnServerInstance = function (playerId, snake, state) {
    if (g.game.isActiveInstance() && Math.pow(snake.head.x, 2) + Math.pow(snake.head.y, 2) >= Math.pow(this.stage.nowWidth / 2, 2)) {
      // 壁沿い走行時は自動でスネークの顔の向きが変わるため、PlayerList#uiState#directionも更新する
      this._adjustSnakeHeadAlongWall(playerId, snake.head.angle + 90, state);
    }
  };

  MainGameScene.prototype._adjustSnakeHeadAlongWall = function (playerId, angle, state) {
    var radianFineness = this.stateManager.sessionParameter.config.userInput.radianFineness;
    var currentDirection = this.stateManager.playerList[playerId].uiState.direction;
    var directionUnit = 360 / radianFineness;
    var newDirection = Math.floor((angle + 180) / directionUnit) % radianFineness;

    if (currentDirection !== newDirection) {
      var message = {
        messageType: MessageEventType_1.MessageEventType.changeUserTouchState,
        messageData: {
          id: playerId,
          newDirection: newDirection,
          newState: state,
          canPlaySE: false
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };

  MainGameScene.prototype._createFood = function (foodElement) {
    var food = new Food_1.Food({
      parent: this.foodLayer,
      x: foodElement.x,
      y: foodElement.y,
      font: this.stateManager.resource.font,
      word: foodElement.word
    });
    return food;
  };

  MainGameScene.prototype._initJewel = function () {
    var playerCountRank = this.stateManager.dividePlayerCountIntoTiers();
    var fieldRadius = this.stateManager.sessionParameter.config.field.radius[playerCountRank] - 50;
    var lengthOfSquareInField = Math.floor(fieldRadius / Math.sqrt(2)) * 2;

    var jewel = this._createJewel({
      x: g.game.random.generate() * lengthOfSquareInField - lengthOfSquareInField / 2,
      y: g.game.random.generate() * lengthOfSquareInField - lengthOfSquareInField / 2
    });

    this.stateManager.jewelData = {
      jewel: jewel,
      ownerId: null // 落ちている時は、所有者はいない

    };
    var jewelPopAsset = this.assets.main_jewel_pop;
    this.localParameter.jewelPop = new g.Sprite({
      scene: this,
      src: jewelPopAsset,
      x: g.game.width / 2,
      y: g.game.height / 2,
      anchorX: 0.5,
      anchorY: 0.5,
      opacity: 0.0
    });
    this.userFollowingLayer.append(this.localParameter.jewelPop);
  };

  MainGameScene.prototype._createJewel = function (jewelElement) {
    var jewel = new Jewel_1.Jewel({
      parent: this.snakeLayer,
      x: jewelElement.x,
      y: jewelElement.y
    });
    return jewel;
  };

  MainGameScene.prototype._isAudience = function (playerId) {
    return !!playerId && (!this.stateManager.playerList[playerId] || playerId !== this.stateManager.broadcaster.id && !!this.stateManager.playerList[playerId] && StateRoleChecker_1.checkStateRole(this.stateManager.playerList[playerId].state, StateRoleChecker_1.StateRoleType.IsAudienceType));
  };

  MainGameScene.prototype._stopAllAudio = function () {
    var _this = this;

    Object.keys(this.stateManager.audioAssets).forEach(function (audioType) {
      _this.stateManager.audioAssets[audioType].stop();
    });
  };

  MainGameScene.prototype._dropSnakeBody = function (deadPlayerId) {
    var _this = this;

    if (!!this.stateManager.playerList[deadPlayerId] && !!this.stateManager.playerList[deadPlayerId].snake && StateRoleChecker_1.checkStateRole(this.stateManager.playerList[deadPlayerId].state, StateRoleChecker_1.StateRoleType.CanDropType)) {
      var deadSnake = this.stateManager.playerList[deadPlayerId].snake; // 節をエサとして落とす

      deadSnake.segments.forEach(function (seg) {
        if (seg.type === Snake_1.SnakeSegmentType.Jewel) return;

        var food = _this._createFood({
          x: seg.x + seg.body.x + seg.body.width / 2,
          y: seg.y + seg.body.y + seg.body.height / 2,
          word: seg.word
        });

        _this.stateManager.waitingFoodList.push(food);
      }); // お宝を落とす

      if (deadSnake.haveJewel) {
        var jewel = this._createJewel({
          x: deadSnake.segments[deadSnake.segments.length - 1].x + deadSnake.segments[deadSnake.segments.length - 1].body.x,
          y: deadSnake.segments[deadSnake.segments.length - 1].y + deadSnake.segments[deadSnake.segments.length - 1].body.y
        });

        this.stateManager.jewelData = {
          jewel: jewel,
          ownerId: null // 落ちている時は、所有者はいない

        }; // お宝チャンス通知作成

        var chanceNotice = this._createNotice(PopupNotice_1.NoticeType.Chance);

        this._addNotice(chanceNotice);
      }
    }
  };

  return MainGameScene;
}(SceneBase_1.SceneBase);

exports.MainGameScene = MainGameScene;
var ButtonState;

(function (ButtonState) {
  ButtonState["On"] = "On";
  ButtonState["Off"] = "Off";
})(ButtonState = exports.ButtonState || (exports.ButtonState = {}));

function calculateRadFromPoint(startDelta) {
  var pointNorm = Math.sqrt(Math.abs(Math.pow(startDelta.x, 2) + Math.pow(startDelta.y, 2)));
  var pointDirectionFromCenterNormalized = {
    x: startDelta.x / pointNorm,
    y: startDelta.y / pointNorm
  }; // 3時の方向から時計回りの360度でアングルを得る（x→y↓座標系）

  var deg = Math.atan2(-pointDirectionFromCenterNormalized.y, -pointDirectionFromCenterNormalized.x) * 180 / Math.PI;
  return {
    deg: deg,
    norm: pointNorm
  };
}