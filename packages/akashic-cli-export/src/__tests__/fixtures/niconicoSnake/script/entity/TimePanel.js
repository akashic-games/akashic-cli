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
exports.TimePanel = void 0;

var akashic_label_1 = require("@akashic-extension/akashic-label");

var TimePanel =
/** @class */
function (_super) {
  __extends(TimePanel, _super);

  function TimePanel(param) {
    var _this = _super.call(this, param) || this;

    _this.bg = new g.Sprite({
      scene: param.scene,
      src: param.backgroundImage
    });

    _this.append(_this.bg);

    _this._createLabel(param.remainTime);

    return _this;
  }

  TimePanel.prototype.updateTime = function (remainTime) {
    if (remainTime <= 10) {
      this.label.font = this.timeRedFont;
    }

    this.label.text = "" + remainTime;
    this.label.invalidate();
  };

  TimePanel.prototype._createLabel = function (remainTime) {
    var timeFontGlyph = JSON.parse(this.scene.assets.main_num_time_glyph.data);
    this.timeFont = new g.BitmapFont({
      src: this.scene.assets.main_num_time_c,
      map: timeFontGlyph,
      defaultGlyphWidth: 34,
      defaultGlyphHeight: 58
    });
    this.timeRedFont = new g.BitmapFont({
      src: this.scene.assets.main_num_time_r,
      map: timeFontGlyph,
      defaultGlyphWidth: 34,
      defaultGlyphHeight: 58
    });
    this.label = new akashic_label_1.Label({
      scene: this.scene,
      text: "" + remainTime,
      font: this.timeFont,
      fontSize: 58,
      width: this.width,
      y: 63,
      textAlign: "center"
    });
    this.append(this.label);
  };

  return TimePanel;
}(g.E);

exports.TimePanel = TimePanel;