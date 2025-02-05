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
exports.TitleBehavior = void 0;

var Behavior_1 = require("../Behavior");

var MessageEventType_1 = require("../../types/MessageEventType");

var TitleBehavior =
/** @class */
function (_super) {
  __extends(TitleBehavior, _super);

  function TitleBehavior(param) {
    return _super.call(this, param) || this;
  }

  TitleBehavior.prototype.onMessageEvent = function (event) {
    this._onAllInstanceEvent(event);

    if (g.game.isActiveInstance()) this._onActiveInstanceEvent(event);
  };
  /**
   * 全てのインスタンスで拾うイベント
   */


  TitleBehavior.prototype._onAllInstanceEvent = function (event) {
    var data = event.data;
    var messageType = data.messageType;

    switch (messageType) {
      case MessageEventType_1.MessageEventType.waitRecruitment:
        this.scene.createJoinButton();
        this.scene.setRecruitmentTimer(data.messageData.startTime);
        break;

      case MessageEventType_1.MessageEventType.lotteryResult:
        var messageData = data.messageData;
        this.stateManager.setPlayerList(messageData.playerList);
        this.scene.showLotteryResult(messageData.numPlayers);
        break;

      case MessageEventType_1.MessageEventType.startGame:
        this.stateManager.changeMainGameScene();
        break;

      case MessageEventType_1.MessageEventType.restartRecruitment:
        this.scene.resetScene();
        break;

      default: // do nothing

    }
  };
  /**
   * サーバーインスタンスでのみ拾うイベント
   */


  TitleBehavior.prototype._onActiveInstanceEvent = function (event) {
    var _this = this;

    var data = event.data;
    var messageType = data.messageType;

    switch (messageType) {
      case MessageEventType_1.MessageEventType.startRecruitment:
        this.stateManager.startRecruitment(data.messageData.broadcasterUser);

        var checkTimeUp_1 = function checkTimeUp_1() {
          if (g.game.age - _this.stateManager.startTime > _this.stateManager.sessionParameter.entrySec * g.game.fps) {
            _this.stateManager.startLottery();

            _this.scene.update.remove(checkTimeUp_1);
          }
        };

        this.scene.onUpdate.add(checkTimeUp_1);
        break;

      case MessageEventType_1.MessageEventType.joinRequest:
        this.stateManager.receiveJoinRequest(data.messageData.joinPlayer, data.messageData.joinUser);
        break;

      default: // do nothing

    }
  };

  return TitleBehavior;
}(Behavior_1.Behavior);

exports.TitleBehavior = TitleBehavior;