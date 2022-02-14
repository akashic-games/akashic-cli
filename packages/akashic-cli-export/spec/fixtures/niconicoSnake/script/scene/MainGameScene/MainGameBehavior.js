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
exports.MainGameBehavior = void 0;

var StateManager_1 = require("../../StateManager");

var Behavior_1 = require("../Behavior");

var MessageEventType_1 = require("../../types/MessageEventType");

var UserTouchState_1 = require("../../types/UserTouchState");

var StateRoleChecker_1 = require("../../utils/StateRoleChecker");

var MainGameBehavior =
/** @class */
function (_super) {
  __extends(MainGameBehavior, _super);

  function MainGameBehavior(param) {
    return _super.call(this, param) || this;
  }

  MainGameBehavior.prototype.onMessageEvent = function (event) {
    this._onAllInstanceEvent(event);

    if (g.game.isActiveInstance()) this._onActiveInstanceEvent(event);
  };
  /**
   * 全てのインスタンスで拾うイベント
   */


  MainGameBehavior.prototype._onAllInstanceEvent = function (event) {
    var _this = this;

    var data = event.data;
    var messageType = data.messageType;

    switch (messageType) {
      case MessageEventType_1.MessageEventType.initMainGame:
        this.scene.init(data.messageData.playerInitLayoutList);
        break;

      case MessageEventType_1.MessageEventType.setPlaying:
        switch (data.messageData.scope) {
          case MessageEventType_1.ScopeType.All:
            this.stateManager.applyPlayingStateForAllSnakes();
            break;

          case MessageEventType_1.ScopeType.One:
            if (!data.messageData.playerId) break;
            this.stateManager.applyPlayingStateForOneSnake(data.messageData.playerId);
            break;

          default: // do nothing

        }

        break;

      case MessageEventType_1.MessageEventType.changeUserTouchState:
        var playerId = data.messageData.id;
        this.stateManager.applyTouchState(playerId ? playerId : event.player.id, data.messageData.newState, data.messageData.newDirection);
        var canPlaySE = data.messageData.canPlaySE;

        if ((canPlaySE == null || !!canPlaySE && canPlaySE) && playerId === this.stateManager.broadcaster.id && this.scene._isAudience(g.game.selfId)) {
          if (data.messageData.newState === UserTouchState_1.UserTouchState.onDoubleTap) {
            this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Dash);
          } else {
            this.stateManager.audioAssets[StateManager_1.AudioType.Dash].stop();
          }
        }

        break;

      case MessageEventType_1.MessageEventType.sendPlayersInConflict:
        this.scene.receivePlayersInConflict(data.messageData.playersInConflict);
        break;

      case MessageEventType_1.MessageEventType.respawnSnake:
        if (this.stateManager.playerList[event.player.id].state !== StateManager_1.PlayerState.dead) break; // 重複リスポーンを防ぐ

        this.stateManager.setRespawnSnake(event.player.id, this.scene.snakeLayer, this.scene.stage.getNowRadius());

        if (event.player.id === g.game.selfId) {
          this.scene.localParameter.respawnButton.destroy();
          this.scene.localParameter.respawnButton = null;
          this.scene.localParameter.broadcasterDisplayViewing.hide();
          this.scene.localParameter.dashingGauge = this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps;
          this.scene.localParameter.dashingGaugeBar.updateGauge(this.stateManager.sessionParameter.config.snake.dashingTime);
          this.scene.localParameter.dashingGaugeBar.opacity = 0.0;
          this.scene.localParameter.dashingGaugeBar.show();
        }

        break;

      case MessageEventType_1.MessageEventType.respawnBroadcasterAngelSnake:
        if (this.stateManager.playerList[this.stateManager.broadcaster.id].state !== StateManager_1.PlayerState.dead) break; // 重複リスポーンを防ぐ

        this.stateManager.setBroadcasterAngelSnake(this.scene.snakeLayer, this.scene.stage.getNowRadius());
        this.scene.modifyBroadcasterAngelSnake();

        if (event.player.id === g.game.selfId) {
          this.scene.localParameter.respawnButton.destroy();
          this.scene.localParameter.respawnButton = null;
          this.scene.localParameter.broadcasterDisplayViewing.hide();
          this.scene.localParameter.dashingGauge = this.stateManager.sessionParameter.config.snake.dashingTime * g.game.fps;
          this.scene.localParameter.dashingGaugeBar.updateGauge(this.stateManager.sessionParameter.config.snake.dashingTime);
          this.scene.localParameter.dashingGaugeBar.opacity = 0.0;
          this.scene.localParameter.dashingGaugeBar.show();
        }

        break;

      case MessageEventType_1.MessageEventType.respawnJewel:
        this.stateManager.setRespawnJewel(data.messageData.position);
        break;

      case MessageEventType_1.MessageEventType.eatenFoods:
        this.stateManager.applyEatenFoods(data.messageData.eatenFoodInfo, data.messageData.noEatenFoodIndexList, data.messageData.fieldRadius);
        break;

      case MessageEventType_1.MessageEventType.updateJewelOwner:
        var stolenPlayerId = this.stateManager.jewelData.ownerId; // お宝を盗まれたプレイヤーのid（applyEatenJewelで更新）

        this.stateManager.applyEatenJewel(data.messageData.ownerId);
        this.scene.switchGoldenSnake(data.messageData.ownerId, stolenPlayerId);
        break;

      case MessageEventType_1.MessageEventType.rankingAccountData:
        this.scene.rewriteRanking(data.messageData.rankingAccountData);
        break;

      case MessageEventType_1.MessageEventType.updateRemainTime:
        this.scene.rewriteTime(data.messageData.remainTime);
        break;

      case MessageEventType_1.MessageEventType.animation:
        switch (data.messageData.scope) {
          case MessageEventType_1.ScopeType.All:
            this.stateManager.animateAllSnakes(data.messageData.animationType);
            break;

          case MessageEventType_1.ScopeType.One:
            if (!data.messageData.playerId) break;
            this.stateManager.animateOneSnake(data.messageData.animationType, data.messageData.playerId);
            break;

          default: // do nothing

        }

        break;

      case MessageEventType_1.MessageEventType.countDown:
        this.scene.showCountDown(data.messageData.countDownType);
        break;

      case MessageEventType_1.MessageEventType.preventUsertouch:
        this.stateManager.applyPreventUserTouch(data.messageData.playerId, data.messageData.preventType);
        break;

      case MessageEventType_1.MessageEventType.destroySnake:
        this.scene.snakeDestructionProcedure(data.messageData.deadPlayerId);
        break;

      case MessageEventType_1.MessageEventType.finishGame:
        this.scene.assets.snake_bgm.stop();
        this.stateManager.isGameOver = true;
        Object.keys(this.stateManager.playerList).forEach(function (playerId) {
          if (StateRoleChecker_1.checkStateRole(_this.stateManager.playerList[playerId].state, StateRoleChecker_1.StateRoleType.CanCountType)) {
            _this.stateManager.playerList[playerId].lastWords = _this.stateManager.playerList[playerId].getsLastWords();
          }
        });
        this.scene.showFinishView();
        break;

      case MessageEventType_1.MessageEventType.startResult:
        this.scene._stopAllAudio();

        this.stateManager.changeResultScene();
        break;

      default: // do nothing

    }
  };
  /**
   * サーバーインスタンスでのみ拾うイベント
   */


  MainGameBehavior.prototype._onActiveInstanceEvent = function (event) {
    var data = event.data;
    var messageType = data.messageType;

    switch (messageType) {
      case MessageEventType_1.MessageEventType.setPlaying:
        switch (data.messageData.scope) {
          case MessageEventType_1.ScopeType.All:
            // タイマー起動
            this.scene.setCountDownIntervalInActiveInstance();
            break;

          default: // do nothing

        }

        break;

      case MessageEventType_1.MessageEventType.sendPlayersInConflict:
        this.scene.manageSnakeDestructionInActiveInstance(data.messageData.playersInConflict);
        break;

      case MessageEventType_1.MessageEventType.respawnSnake:
        this.stateManager.endInvincibleTime(MessageEventType_1.ScopeType.One, event.player.id);
        break;

      case MessageEventType_1.MessageEventType.finishGame:
        if (this.scene.localParameter.remainGameTimer != null) {
          this.scene.clearInterval(this.scene.localParameter.remainGameTimer);
          this.scene.localParameter.remainGameTimer = null;
        }

        break;

      default: // do nothing

    }
  };

  return MainGameBehavior;
}(Behavior_1.Behavior);

exports.MainGameBehavior = MainGameBehavior;