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
exports.ScrollSpeedType = exports.RankingLabel = void 0;

var akashic_label_1 = require("@akashic-extension/akashic-label");

var utils_1 = require("../../commonUtils/utils");

var RankingLabel =
/** @class */
function (_super) {
  __extends(RankingLabel, _super);

  function RankingLabel(param) {
    var _this = _super.call(this, param) || this;

    _this._resultNumFont = param.resultNumFont;
    _this._resultNumRedFont = param.resultNumRedFont;
    _this._rankingPlayerIdList = param.rankingPlayerIdList;
    _this._scrollTimeUnit = 30;
    _this._scrollTween = null;

    _this._init();

    return _this;
  }

  RankingLabel.prototype.scroll = function (speedType) {
    var _this = this;

    if (speedType === void 0) {
      speedType = ScrollSpeedType.Normal;
    }

    switch (speedType) {
      case ScrollSpeedType.Normal:
        this._scrollTimeUnit = 30;
        break;

      case ScrollSpeedType.High:
        this._scrollTimeUnit = 3;
        break;

      default: // do nothing

    }

    var createScrollTween = function createScrollTween() {
      var moveDistance = 53 * _this._rankingPlayerIdList.length + 137 - 50;
      _this._scrollTween = _this.scene.timeline.create(_this._root, {
        loop: true
      }).wait(200 * _this._scrollTimeUnit).moveTo(0, -moveDistance, (moveDistance + _this._root.y) * _this._scrollTimeUnit).call(function () {
        _this._root.y = 470;

        _this._root.modified();
      }).moveTo(0, 0, (437 - 137) * _this._scrollTimeUnit);
    };

    if (this._scrollTween != null) {
      this.scene.timeline.remove(this._scrollTween);
      this._scrollTween = null;

      if (this._root.y > 0 && this._root.y <= 470) {
        // 一通り表示が終わり、下から名前が上がってきている間に速度変更した場合
        this._scrollTween = this.scene.timeline.create(this._root).moveTo(0, 0, 300 * this._root.y / 470 * this._scrollTimeUnit).call(function () {
          _this.scene.timeline.remove(_this._scrollTween);

          _this._scrollTween = null;
          createScrollTween();
        });
      } else {
        // ランキングスクロール中に速度変更した場合
        var moveDistance = 53 * this._rankingPlayerIdList.length + 137 - 50;
        this._scrollTween = this.scene.timeline.create(this._root).moveTo(0, -moveDistance, (moveDistance + this._root.y) * this._scrollTimeUnit).call(function () {
          _this._root.y = 470;

          _this._root.modified();
        }).moveTo(0, 0, (437 - 137) * this._scrollTimeUnit).call(function () {
          _this.scene.timeline.remove(_this._scrollTween);

          _this._scrollTween = null;
          createScrollTween();
        });
      }
    } else {
      createScrollTween();
    }
  };

  RankingLabel.prototype.setInitialPosition = function () {
    this._root.x = 0;
    this._root.y = 0;

    this._root.modified();

    if (this._scrollTween != null) {
      this.scene.timeline.remove(this._scrollTween);
      this._scrollTween = null;
    }
  };

  RankingLabel.prototype._init = function () {
    this._createRoot();

    this._createRankLabels();

    this._createRankingNames();

    this._createCountLabels();
  };

  RankingLabel.prototype._createRoot = function () {
    this._root = new g.E({
      scene: this.scene
    });
    this.append(this._root);
  };

  RankingLabel.prototype._createRankLabels = function () {
    var _this = this;

    this._rankingPlayerIdList.forEach(function (_, rank) {
      var rankLabel = new akashic_label_1.Label({
        scene: _this.scene,
        text: "" + (rank + 1),
        font: rank === 0 ? _this._resultNumRedFont : _this._resultNumFont,
        fontSize: 36,
        width: _this._resultNumFont.defaultGlyphWidth * 3,
        x: 40,
        y: 137 - 50 + 53 * rank,
        textAlign: "right"
      });

      _this._root.append(rankLabel);

      var unitLabelAsset = _this.scene.assets.result_unit_i_b;
      var unitRedLabelAsset = _this.scene.assets.result_unit_i_r;
      var unitLabel = new g.Sprite({
        scene: _this.scene,
        src: rank === 0 ? unitRedLabelAsset : unitLabelAsset,
        x: 278 - 151,
        y: 143 - 50 + 53 * rank
      });

      _this._root.append(unitLabel);
    });
  };

  RankingLabel.prototype._createRankingNames = function () {
    var _this = this;

    this._rankingPlayerIdList.forEach(function (data, rank) {
      var name = utils_1.clampString(_this.scene.stateManager.playerList[data.playerId].user.name, 14, "…");
      var rankingName = new akashic_label_1.Label({
        scene: _this.scene,
        text: "" + name,
        textColor: "white",
        font: _this.scene.stateManager.resource.font,
        fontSize: 34,
        width: 978,
        x: 359 - 151,
        y: 137 - 52 + 53 * rank // デザイン仕様

      });

      _this._root.append(rankingName);
    });
  };

  RankingLabel.prototype._createCountLabels = function () {
    var _this = this;

    this._rankingPlayerIdList.forEach(function (data, rank) {
      var countLabel = new akashic_label_1.Label({
        scene: _this.scene,
        text: "" + data.count,
        font: rank === 0 ? _this._resultNumRedFont : _this._resultNumFont,
        fontSize: 36,
        width: _this._resultNumFont.defaultGlyphWidth * 3,
        x: 955 - 151,
        y: 137 - 50 + 53 * rank,
        textAlign: "right"
      });

      _this._root.append(countLabel);
    });
  };

  return RankingLabel;
}(g.Pane);

exports.RankingLabel = RankingLabel;
var ScrollSpeedType;

(function (ScrollSpeedType) {
  ScrollSpeedType["Normal"] = "Normal";
  ScrollSpeedType["High"] = "High";
})(ScrollSpeedType = exports.ScrollSpeedType || (exports.ScrollSpeedType = {}));