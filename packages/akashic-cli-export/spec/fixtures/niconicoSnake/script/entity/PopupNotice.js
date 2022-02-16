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
exports.noticeY = exports.PopupNotice = exports.NoticeType = void 0;

var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

var akashic_label_1 = require("@akashic-extension/akashic-label");

var utils_1 = require("../commonUtils/utils");

var NoticeType;

(function (NoticeType) {
  /**
   * キル通知
   */
  NoticeType["Kill"] = "Kill";
  /**
   * お宝ゲット通知
   */

  NoticeType["Jewel"] = "Jewel";
  /**
   * お宝チャンス通知
   */

  NoticeType["Chance"] = "Chance";
})(NoticeType = exports.NoticeType || (exports.NoticeType = {}));

var PopupNotice =
/** @class */
function (_super) {
  __extends(PopupNotice, _super);

  function PopupNotice(param) {
    var _this = _super.call(this, param) || this;

    _this.timeline = new akashic_timeline_1.Timeline(_this.scene);
    _this.font = param.font;
    _this.name = utils_1.clampString(param.name, 10, "…");

    switch (param.noticeType) {
      case NoticeType.Kill:
        _this._createKillNotice();

        break;

      case NoticeType.Jewel:
        _this._createJewelNotice();

        break;

      case NoticeType.Chance:
        _this._createChanceNotice();

        break;

      default: // do nothing

    }

    return _this;
  }

  PopupNotice.prototype.up = function (nextIdx) {
    this.timeline.create(this).moveTo(852, exports.noticeY[nextIdx], 150);
  };

  PopupNotice.prototype.fadeInUp = function () {
    this.timeline.create(this).moveTo(852, 478, 100).con().to({
      opacity: 0.9
    }, 150);
    this.timeline.create(this).wait(5000).fadeOut(150);
  };

  PopupNotice.prototype.fadeOutUp = function () {
    this.timeline.create(this).moveTo(852, 178, 100).con().fadeOut(150);
  };

  PopupNotice.prototype._createKillNotice = function () {
    var killPopSpriteAsset = this.scene.assets.main_rpop_head_kill;
    var killPopSprite = new g.Sprite({
      scene: this.scene,
      src: killPopSpriteAsset,
      width: killPopSpriteAsset.width,
      height: killPopSpriteAsset.height,
      x: this.width - killPopSpriteAsset.width
    });
    this.append(killPopSprite);

    var nameArea = this._fillInBlanks(killPopSprite.x, this.name);

    this._createLabel(nameArea);
  };

  PopupNotice.prototype._createJewelNotice = function () {
    var jewelPopSpriteAsset = this.scene.assets.main_rpop_head_jewel;
    var jewelPopSprite = new g.Sprite({
      scene: this.scene,
      src: jewelPopSpriteAsset,
      width: jewelPopSpriteAsset.width,
      height: jewelPopSpriteAsset.height,
      x: this.width - jewelPopSpriteAsset.width
    });
    this.append(jewelPopSprite);

    var nameArea = this._fillInBlanks(jewelPopSprite.x, this.name);

    this._createLabel(nameArea);
  };

  PopupNotice.prototype._createChanceNotice = function () {
    var chancePopSpriteAsset = this.scene.assets.red_rpop_head_chance;
    var chancePopSprite = new g.Sprite({
      scene: this.scene,
      src: chancePopSpriteAsset,
      width: chancePopSpriteAsset.width,
      height: chancePopSpriteAsset.height,
      x: this.width - chancePopSpriteAsset.width
    });
    this.append(chancePopSprite);

    this._createChanceLabel(chancePopSprite.x, "フィールド上にお宝が落ちています！");
  };

  PopupNotice.prototype._fillInBlanks = function (rightX, name) {
    var popBodyLength = Math.ceil(this.font.measureText(name).width * 18 / (this.font.size * 40));
    var popBodySpriteAsset = this.scene.assets.main_rpop_body;

    for (var i = 1; i <= popBodyLength; i++) {
      var body = new g.Sprite({
        scene: this.scene,
        src: popBodySpriteAsset,
        width: popBodySpriteAsset.width,
        height: popBodySpriteAsset.height,
        x: rightX - popBodySpriteAsset.width * i
      });
      this.append(body);
    }

    var popTailSpriteAsset = this.scene.assets.main_rpop_tail;
    var tail = new g.Sprite({
      scene: this.scene,
      src: popTailSpriteAsset,
      width: popTailSpriteAsset.width,
      height: popTailSpriteAsset.height,
      x: rightX - popBodySpriteAsset.width * popBodyLength - popTailSpriteAsset.width
    });
    this.append(tail);
    return {
      nameAreaX: rightX - popBodySpriteAsset.width * popBodyLength,
      nameAreaWidth: popBodyLength * 40
    };
  };

  PopupNotice.prototype._createLabel = function (param) {
    this.label = new akashic_label_1.Label({
      scene: this.scene,
      text: this.name,
      textColor: "white",
      font: this.font,
      fontSize: 18,
      width: param.nameAreaWidth,
      x: param.nameAreaX,
      y: 12,
      trimMarginTop: true,
      textAlign: "right"
    });
    this.append(this.label);
  };

  PopupNotice.prototype._createChanceLabel = function (rightX, text) {
    var popBodySpriteAsset = this.scene.assets.red_rpop_body;

    for (var i = 1; i <= 4; i++) {
      var body = new g.Sprite({
        scene: this.scene,
        src: popBodySpriteAsset,
        width: popBodySpriteAsset.width,
        height: popBodySpriteAsset.height,
        x: rightX - popBodySpriteAsset.width * i
      });
      this.append(body);
    }

    var popTailSpriteAsset = this.scene.assets.red_rpop_tail;
    var tail = new g.Sprite({
      scene: this.scene,
      src: popTailSpriteAsset,
      width: popTailSpriteAsset.width,
      height: popTailSpriteAsset.height,
      x: rightX - popBodySpriteAsset.width * 4 - popTailSpriteAsset.width
    });
    this.append(tail);
    this.label = new akashic_label_1.Label({
      scene: this.scene,
      text: text,
      textColor: "white",
      font: this.font,
      fontSize: 16,
      width: 8 * 40,
      x: rightX - popBodySpriteAsset.width * 4 - 56,
      y: 12,
      trimMarginTop: true,
      textAlign: "right"
    });
    this.append(this.label);
  };

  return PopupNotice;
}(g.E);

exports.PopupNotice = PopupNotice;
exports.noticeY = [478, 428, 378, 328, 278, 228];