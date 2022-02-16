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
exports.ScorePanel = void 0;

var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

var akashic_label_1 = require("@akashic-extension/akashic-label");

var ScorePanel =
/** @class */
function (_super) {
  __extends(ScorePanel, _super);

  function ScorePanel(param) {
    var _this = _super.call(this, param) || this;

    _this.timeline = new akashic_timeline_1.Timeline(_this.scene);
    _this.scoreUpTween = null;
    _this.bg = new g.Sprite({
      scene: param.scene,
      src: param.backgroundImage
    });

    _this.append(_this.bg);

    _this._createLabel(param.score);

    return _this;
  }

  ScorePanel.prototype.updateScore = function (score) {
    this.label.text = "" + score;
    this.label.invalidate();
  };

  ScorePanel.prototype.swell = function () {
    var _this = this;

    if (this.scoreUpTween != null) return;
    this.scoreUpTween = this.timeline.create(this).to({
      scaleY: 0.9
    }, 200).to({
      scaleY: 1.25
    }, 400, akashic_timeline_1.Easing.easeOutCubic).to({
      scaleY: 1.0
    }, 200, akashic_timeline_1.Easing.easeInExpo).call(function () {
      _this.timeline.remove(_this.scoreUpTween);

      _this.scoreUpTween = null;
    });
  };

  ScorePanel.prototype._createLabel = function (score) {
    var scoreFontGlyph = JSON.parse(this.scene.assets.main_num_score_glyph.data);
    this.scoreFont = new g.BitmapFont({
      src: this.scene.assets.main_num_score,
      map: scoreFontGlyph,
      defaultGlyphWidth: 16,
      defaultGlyphHeight: 28
    });
    this.label = new akashic_label_1.Label({
      scene: this.scene,
      text: "" + score,
      font: this.scoreFont,
      fontSize: 28,
      width: 16 * 3,
      x: 121,
      y: 21,
      textAlign: "center"
    });
    this.append(this.label);
  };

  return ScorePanel;
}(g.E);

exports.ScorePanel = ScorePanel;