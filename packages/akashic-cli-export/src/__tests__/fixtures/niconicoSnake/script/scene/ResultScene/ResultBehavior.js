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
exports.ResultBehavior = void 0;

var Behavior_1 = require("../Behavior");

var MessageEventType_1 = require("../../types/MessageEventType");

var ResultBehavior =
/** @class */
function (_super) {
  __extends(ResultBehavior, _super);

  function ResultBehavior(param) {
    return _super.call(this, param) || this;
  }

  ResultBehavior.prototype.onMessageEvent = function (event) {
    this._onAllInstanceEvent(event);

    if (g.game.isActiveInstance()) this._onActiveInstanceEvent(event);
  };
  /**
   * 全てのインスタンスで拾うイベント
   */


  ResultBehavior.prototype._onAllInstanceEvent = function (event) {
    var data = event.data;
    var messageType = data.messageType;

    switch (messageType) {
      case MessageEventType_1.MessageEventType.initResult:
        g.game.focusingCamera = new g.Camera2D({});
        this.scene.init(data.messageData.lengthRankingPlayerIdList, data.messageData.killRankingPlayerIdList, data.messageData.jewelOwnerId);
        break;

      case MessageEventType_1.MessageEventType.nextRankingType:
        this.scene.changeShownRankingType(data.messageData.nextRankingType);
        break;

      case MessageEventType_1.MessageEventType.changeScrollSpeed:
        this.scene.changeScrollSpeed(data.messageData.rankingType, data.messageData.speedType);
        break;

      default: // do nothing

    }
  };
  /**
   * サーバーインスタンスでのみ拾うイベント
   */


  ResultBehavior.prototype._onActiveInstanceEvent = function (event) {
    var data = event.data;
    var messageType = data.messageType;

    switch (messageType) {
      default: // do nothing

    }
  };

  return ResultBehavior;
}(Behavior_1.Behavior);

exports.ResultBehavior = ResultBehavior;