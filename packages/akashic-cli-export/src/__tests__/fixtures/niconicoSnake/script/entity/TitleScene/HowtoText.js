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
exports.HowtoText = void 0;

var akashic_label_1 = require("@akashic-extension/akashic-label"); // ニコニコ生放送フォント定義


var FontFamily = {
  // ゴシック: Avenir Next DemiBold + ヒラギノ角ゴ Pro W6
  Gothic: [// Avenir Next DemiBold
  "Avenir Next DemiBold", "AvenirNext-DemiBold", "Avenir Next", // for Windows
  "Verdana", // ヒラギノ角ゴ Pro W6
  "ヒラギノ角ゴ Pro W6", "HiraKakuPro-W6", // for Windows
  "meiryo", "sans-serif"],
  Number: [// Avenir Next DemiBold
  "Avenir Next DemiBold", "AvenirNext-DemiBold", "Avenir Next", // for Windows
  "Verdana", "sans-serif"]
};
var HOWTO_FONT_SIZE = 34;
var howtoFont = new g.DynamicFont({
  game: g.game,
  fontFamily: FontFamily.Gothic,
  size: HOWTO_FONT_SIZE,
  fontWeight: g.FontWeight.Bold
});
/**
 * あそびかた説明
 */

var HowtoText =
/** @class */
function (_super) {
  __extends(HowtoText, _super);

  function HowtoText(params) {
    var _this = this;

    var width = 1030; // 手調整 (レイアウト指示+30)

    var height = 340; // 手調整 (レイアウト指示+60)

    _this = _super.call(this, __assign(__assign({}, params), {
      width: width,
      height: height,
      anchorX: 0.5,
      anchorY: 0,
      x: g.game.width / 2,
      backgroundEffector: new g.NinePatchSurfaceEffector(g.game, 20),
      backgroundImage: params.scene.assets.frame_howto
    })) || this;
    var title = new g.Label({
      scene: _this.scene,
      x: 64,
      y: 32,
      text: "あそびかた",
      font: howtoFont,
      textColor: "yellow",
      fontSize: 34
    });

    _this.append(title);

    var howtoText = new akashic_label_1.Label({
      scene: _this.scene,
      text: params.text,
      font: howtoFont,
      fontSize: HOWTO_FONT_SIZE,
      textColor: "#FFFFFF",
      lineGap: 10,
      x: 64,
      y: 80,
      width: 1000,
      height: 170
    });

    _this.append(howtoText);

    return _this;
  }

  return HowtoText;
}(g.Pane);

exports.HowtoText = HowtoText;