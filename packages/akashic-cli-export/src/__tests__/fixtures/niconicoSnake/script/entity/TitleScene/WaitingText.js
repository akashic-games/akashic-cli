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

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WaitingText = void 0;

var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");
/**
 * タイトルシーンで集計中に表示するテキスト「集計中・・・」
 */


var WaitingText =
/** @class */
function (_super) {
  __extends(WaitingText, _super);

  function WaitingText(params) {
    var _this = _super.call(this, __assign(__assign({}, params), {
      width: g.game.width,
      height: 71
    })) || this;

    var textLabel = new g.Label({
      scene: _this.scene,
      text: "集計中",
      fontSize: 70,
      textColor: "white",
      font: params.font,
      x: 498,
      y: 0
    });

    _this.append(textLabel);

    _this.timeline = new akashic_timeline_1.Timeline(_this.scene);
    var duration = 500;

    _this.timeline.create(_this, {
      loop: true
    }).wait(duration).call(function () {
      textLabel.text = "集計中・";
      textLabel.invalidate();
    }).wait(duration).call(function () {
      textLabel.text = "集計中・・";
      textLabel.invalidate();
    }).wait(duration).call(function () {
      textLabel.text = "集計中・・・";
      textLabel.invalidate();
    }).wait(duration).call(function () {
      textLabel.text = "集計中";
      textLabel.invalidate();
    });

    return _this;
  }

  WaitingText.prototype.destroy = function () {
    this.timeline.destroy();

    _super.prototype.destroy.call(this);
  };

  return WaitingText;
}(g.E);

exports.WaitingText = WaitingText;