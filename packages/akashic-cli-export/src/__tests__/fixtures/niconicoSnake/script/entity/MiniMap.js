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
exports.MiniMap = void 0;
/**
 * ミニマップ表示
 */

var MiniMap =
/** @class */
function (_super) {
  __extends(MiniMap, _super);

  function MiniMap(param) {
    var _this = _super.call(this, param) || this;

    _this._scale = _this.width / param.field.width;
    _this._yourPosition = new g.FilledRect({
      scene: _this.scene,
      cssColor: "red",
      width: 8,
      height: 8,
      local: true
    });

    _this.append(_this._yourPosition);

    _this._jewelPosition = new g.FilledRect({
      scene: _this.scene,
      cssColor: "yellow",
      width: 8,
      height: 8,
      local: true
    });

    _this.append(_this._jewelPosition);

    _this._foodPosition = [];
    _this._unusedFoodResource = [];
    return _this;
  }
  /**
   * 描画内容の更新
   */


  MiniMap.prototype.updateMap = function (param) {
    this._scale = this.width / param.field.width;

    this._flushFoodsAssign();

    this._updateMapSnake(param);

    this._updateMapFoods(param);

    this._updateMapJewel(param);
  };

  MiniMap.prototype._updateMapSnake = function (param) {
    if (!param.yourPlayerInfo.snake) return;
    var snake = param.yourPlayerInfo.snake;
    this._yourPosition.x = this.width / 2 + snake.head.x * this._scale - this._yourPosition.width / 2;
    this._yourPosition.y = this.height / 2 + snake.head.y * this._scale - this._yourPosition.height / 2;

    this._ThinOutModified(this._yourPosition);
  };

  MiniMap.prototype._updateMapFoods = function (param) {
    var _this = this;

    param.foodList.forEach(function (shownFood) {
      if (_this._unusedFoodResource.length) {
        var food = _this._unusedFoodResource.pop();

        food.x = _this.width / 2 + shownFood.food.x * _this._scale;
        food.y = _this.height / 2 + shownFood.food.y * _this._scale;
        food.opacity = 1;

        _this._foodPosition.push(food);
      } else {
        // 余っているリソースが無ければ新たに作る
        var food = new g.FilledRect({
          scene: _this.scene,
          cssColor: "white",
          width: 2,
          height: 2,
          x: _this.width / 2 + shownFood.food.x * _this._scale,
          y: _this.height / 2 + shownFood.food.y * _this._scale,
          local: true
        });

        _this._foodPosition.push(food);

        _this.append(food);
      }
    });
  };

  MiniMap.prototype._flushFoodsAssign = function () {
    var _this = this;

    this._foodPosition.forEach(function (food) {
      food.opacity = 0;

      _this._ThinOutModified(food);

      _this._unusedFoodResource.push(food);
    });

    this._foodPosition = [];
  };

  MiniMap.prototype._updateMapJewel = function (param) {
    this._jewelPosition.x = this.width / 2 + param.jewelCommonOffset.x * this._scale - this._yourPosition.width / 2;
    this._jewelPosition.y = this.height / 2 + param.jewelCommonOffset.y * this._scale - this._yourPosition.height / 2;

    this._ThinOutModified(this._jewelPosition);
  }; // 親Paneの再描画を間引く


  MiniMap.prototype._ThinOutModified = function (entity) {
    if (g.game.age % 2 !== 0) return;
    entity.modified();
  };

  return MiniMap;
}(g.Pane);

exports.MiniMap = MiniMap;