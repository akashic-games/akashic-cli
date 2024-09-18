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
exports.BigButton = void 0;
/**
 * 準備画面仕様の大ボタンq
 */

var BigButton =
/** @class */
function (_super) {
  __extends(BigButton, _super);

  function BigButton(params) {
    var _this = this;

    var width = 720; // レイアウト指示書で定義

    var height = 120; // レイアウト指示書で定義

    _this = _super.call(this, __assign(__assign({}, params), {
      width: width,
      height: height,
      backgroundEffector: new g.NinePatchSurfaceEffector(g.game, {
        top: 55,
        bottom: 55,
        left: 64,
        right: 64
      }),
      backgroundImage: params.scene.assets.btn_frame_join
    })) || this;
    _this._textLabel = new g.Label({
      scene: _this.scene,
      anchorX: 0.5,
      anchorY: 0.5,
      x: width / 2,
      y: height / 2 - 5,
      font: params.font,
      text: params.text,
      fontSize: 70,
      textColor: params.textColor,
      local: params.local
    });

    _this.append(_this._textLabel);

    return _this;
  }
  /**
   * 無効状態の表示に切り替える
   * @param text テキストを変更する場合は指定する
   */


  BigButton.prototype.toDisable = function (text) {
    this.backgroundImage = g.SurfaceUtil.asSurface(this.scene.assets.btn_frame_join_disable);
    this.invalidate();

    if (text) {
      this._textLabel.text = text;

      this._textLabel.invalidate();
    }
  };

  return BigButton;
}(g.Pane);

exports.BigButton = BigButton;