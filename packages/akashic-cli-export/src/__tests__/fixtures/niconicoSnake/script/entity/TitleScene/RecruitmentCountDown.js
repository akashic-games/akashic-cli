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
exports.RecruitmentCountDown = void 0;
/**
 * タイトルシーンで募集の残り秒数を表示エンティティ
 */

var RecruitmentCountDown =
/** @class */
function (_super) {
  __extends(RecruitmentCountDown, _super);

  function RecruitmentCountDown(params) {
    var _this = this;

    var width = 486;
    var height = 64;
    _this = _super.call(this, __assign(__assign({}, params), {
      width: width,
      height: height,
      x: g.game.width / 2,
      anchorX: 0.5,
      anchorY: 0
    })) || this;
    var leftLabel = new g.Label({
      scene: params.scene,
      text: "参加者受付中 残り",
      font: params.font,
      textColor: "white",
      fontSize: 36,
      x: 0,
      y: height / 2,
      anchorX: 0,
      anchorY: 0.5
    });

    _this.append(leftLabel);

    var rightLabel = new g.Label({
      scene: params.scene,
      text: "秒",
      font: params.font,
      textColor: "white",
      fontSize: 36,
      x: 450,
      y: height / 2,
      anchorX: 0,
      anchorY: 0.5
    });

    _this.append(rightLabel);

    _this._createDigits(params.font);

    return _this;
  }

  RecruitmentCountDown.prototype._createDigits = function (font) {
    var digit1 = new g.Label({
      scene: this.scene,
      text: "1",
      font: font,
      textColor: "white",
      fontSize: 66,
      x: 331,
      y: -8
    });
    this.append(digit1);
    var digit2 = new g.Label({
      scene: this.scene,
      text: "0",
      font: font,
      textColor: "white",
      fontSize: 66,
      x: 381,
      y: -8
    });
    this.append(digit2);
    this.digits = [digit1, digit2];
  };

  RecruitmentCountDown.prototype.setTime = function (value) {
    value = Math.floor(value % 100);
    var strValue = String(value);

    if (value < 10) {
      this.digits[0].text = "0";
      this.digits[1].text = strValue[0];
    } else {
      this.digits[0].text = strValue[0];
      this.digits[1].text = strValue[1];
    }

    this.digits.forEach(function (e) {
      return e.invalidate();
    });
  };

  return RecruitmentCountDown;
}(g.E);

exports.RecruitmentCountDown = RecruitmentCountDown;