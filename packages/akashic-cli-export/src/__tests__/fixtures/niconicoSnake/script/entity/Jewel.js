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
exports.Jewel = void 0;

var OffsetGroup_1 = require("./OffsetGroup");

var Jewel =
/** @class */
function (_super) {
  __extends(Jewel, _super);

  function Jewel(param) {
    var _this = _super.call(this, param) || this;

    _this._init(param);

    return _this;
  }

  Jewel.prototype.respawn = function (position) {
    this.jewel.x = position.x;
    this.jewel.y = position.y;
    this.jewel.modified();
  };

  Jewel.prototype._init = function (param) {
    var jewelAsset = this.parent.scene.assets.main_jewel_body;
    this.jewel = new g.Sprite({
      scene: this.parent.scene,
      x: param.x,
      y: param.y,
      anchorX: 0.5,
      anchorY: 0.5,
      src: jewelAsset,
      width: jewelAsset.width,
      height: jewelAsset.height
    });
    this.root.append(this.jewel);
  };

  return Jewel;
}(OffsetGroup_1.OffsetGroup);

exports.Jewel = Jewel;