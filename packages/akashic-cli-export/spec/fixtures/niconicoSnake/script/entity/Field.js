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
exports.Field = void 0;

var akashic_tile_1 = require("@akashic-extension/akashic-tile");

var Field =
/** @class */
function (_super) {
  __extends(Field, _super);

  function Field(param) {
    var _this = _super.call(this, param) || this;

    _this._createBase();

    _this._createTiles();

    return _this;
  }

  Field.prototype._createBase = function () {
    var baseAsset = this.scene.assets.field_base;
    var scale = this.width / baseAsset.width;
    this.base = new g.Sprite({
      scene: this.scene,
      src: baseAsset,
      x: this.width / 2,
      y: this.height / 2,
      scaleX: scale,
      scaleY: scale,
      anchorX: 0.5,
      anchorY: 0.5
    });
    this.append(this.base);
  };

  Field.prototype._createTiles = function () {
    var tileAsset = this.scene.assets.field_tiles;
    var tileLineCount = Math.ceil(this.width / tileAsset.height);
    var tileArray = [];

    for (var i = 0; i < tileLineCount; ++i) {
      tileArray[i] = [];

      for (var j = 0; j < tileLineCount; ++j) {
        tileArray[i].push(g.game.random.get(0, 4));
      }
    }

    var tile = new akashic_tile_1.Tile({
      scene: this.scene,
      src: tileAsset,
      tileWidth: tileAsset.height,
      tileHeight: tileAsset.height,
      tileData: tileArray
    });
    tile.compositeOperation = g.CompositeOperation.ExperimentalSourceIn;
    this.append(tile);
  };

  Field.prototype.narrowArea = function (newWidth) {
    if (newWidth <= 0) return;
    var baseAsset = this.scene.assets.field_base;
    var scale = newWidth / baseAsset.width;
    this.base.scaleX = scale;
    this.base.scaleY = scale; // baseがappendされている親Paneの再描画を間引く

    if (scale === Math.round(scale) || g.game.age % 15 !== 0) return;
    this.base.modified();
  };
  /**
   * フィールドの形状を真円と暗黙に仮定して扱うときのサイズ
   */


  Field.prototype.getNowRadius = function () {
    if (this.nowWidth === this.nowHeight) return this.nowWidth;
    return (this.nowWidth + this.nowHeight) / 2;
  };

  Object.defineProperty(Field.prototype, "nowWidth", {
    get: function get() {
      return this.base.width * this.base.scaleX;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Field.prototype, "nowHeight", {
    get: function get() {
      return this.base.height * this.base.scaleY;
    },
    enumerable: false,
    configurable: true
  });
  return Field;
}(g.Pane);

exports.Field = Field;