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
exports.DashingGauge = void 0;

var DashingGauge =
/** @class */
function (_super) {
  __extends(DashingGauge, _super);

  function DashingGauge(param) {
    var _this = _super.call(this, param) || this;

    _this._maxGaugeAmount = param.maxGaugeAmount;
    _this._maxGaugeBaseWidth = 126 - 8;
    _this._gaugeAsset = _this.scene.assets.main_dash_gauge1;
    _this._gaugeBar = new g.Pane({
      scene: _this.scene,
      width: _this._maxGaugeBaseWidth,
      height: _this._gaugeAsset.height,
      x: 4,
      y: 4,
      backgroundImage: _this._gaugeAsset,
      backgroundEffector: new g.NinePatchSurfaceEffector(_this.scene.game, 5)
    });

    _this.append(_this._gaugeBar);

    return _this;
  }

  DashingGauge.prototype.updateGauge = function (gaugeAmount) {
    // ブラウザによって9patchの幅が整数でないと表示がおかしくなるので、整数に丸める
    var gaugeBarWidth = Math.floor(gaugeAmount / this._maxGaugeAmount * this._maxGaugeBaseWidth);
    this._gaugeBar.x = this._maxGaugeBaseWidth - gaugeBarWidth + 4;

    if (gaugeBarWidth < this._gaugeAsset.width) {
      this._gaugeBar.x += (this._gaugeAsset.width - gaugeBarWidth) / 2;
      if (gaugeBarWidth < 3 * this._gaugeAsset.width / 4) this._gaugeBar.hide();else this._gaugeBar.show();
    }

    this._gaugeBar.width = gaugeBarWidth;
    if (this.opacity !== 0) this._gaugeBar.invalidate();
  };

  return DashingGauge;
}(g.Sprite);

exports.DashingGauge = DashingGauge;