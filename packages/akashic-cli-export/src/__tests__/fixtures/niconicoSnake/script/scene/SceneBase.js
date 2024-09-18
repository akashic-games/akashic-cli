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
exports.SceneBase = void 0;

var SceneBase =
/** @class */
function (_super) {
  __extends(SceneBase, _super);

  function SceneBase() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SceneBase.prototype.setBehavior = function (_behavior) {
    this.behavior = _behavior;
  };

  SceneBase.prototype.setMessageEventListener = function () {
    var _this = this;

    this.onMessage.add(function (event) {
      _this.behavior.onMessageEvent(event);
    });
  };

  return SceneBase;
}(g.Scene);

exports.SceneBase = SceneBase;