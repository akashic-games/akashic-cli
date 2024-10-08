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
exports.Food = void 0;

var akashic_label_1 = require("@akashic-extension/akashic-label");

var entityUtils_1 = require("../utils/entityUtils");

var OffsetGroup_1 = require("./OffsetGroup");

var Food =
/** @class */
function (_super) {
  __extends(Food, _super);

  function Food(param) {
    var _this = _super.call(this, param) || this;

    _this.font = param.font;
    _this.word = param.word;
    _this.x = param.x;
    _this.y = param.y;

    _this._init();

    return _this;
  }

  Food.prototype._init = function () {
    var _this = this;

    var foodAsset = this.parent.scene.assets.main_feed;
    this.food = new g.Sprite({
      scene: this.parent.scene,
      x: this.x,
      y: this.y,
      width: foodAsset.width,
      height: foodAsset.height,
      anchorX: 0.5,
      anchorY: 0.5,
      src: foodAsset
    });
    var foodOffset; // Foodは移動しない前提で座標計算を使いまわす

    this.food.render = function (renderer, camera) {
      if (camera) {
        var cam = g.game.focusingCamera;
        var margin = 50;
        if (!foodOffset) foodOffset = entityUtils_1.localToGlobal(_this);

        if (foodOffset.x >= cam.x - margin && foodOffset.x <= cam.x + g.game.width + margin && foodOffset.y >= cam.y - margin && foodOffset.y <= cam.y + g.game.height + margin) {// do nothing
        } else {
          return; // modifiedフラグはカメラに入るまで保持する
        }
      }

      g.Sprite.prototype.render.call(_this.food, renderer, camera); // ugh
    };

    this.root.append(this.food); // ラベルを作成。本当に作成したらtrueを返す

    var createLabel = function createLabel() {
      var camera = g.game.focusingCamera;
      var margin = 50;

      if (camera) {
        if (_this.x >= camera.x - margin && _this.x <= camera.x + g.game.width + margin && _this.y >= camera.y - margin && _this.y <= camera.y + g.game.height + margin) {
          _this.wordLabel = new akashic_label_1.Label({
            scene: _this.root.scene,
            y: (foodAsset.height - 25) / 2,
            font: _this.font,
            text: _this.word,
            width: foodAsset.width,
            fontSize: 25,
            textColor: "black",
            textAlign: "center",
            trimMarginTop: true,
            local: true // 生成タイミングが不定になるためentity id採番に影響しないようlocal化

          });

          _this.food.append(_this.wordLabel);

          return true;
        }
      }

      return false;
    };

    this.root.scene.setTimeout(function () {
      if (!_this.root.scene || _this.root.destroyed()) return; // 消費された場合

      _this.root.onUpdate.add(createLabel); // createLabel が true を返して解除

    }, 50 + Math.random() * 500);
  };

  return Food;
}(OffsetGroup_1.OffsetGroup);

exports.Food = Food;