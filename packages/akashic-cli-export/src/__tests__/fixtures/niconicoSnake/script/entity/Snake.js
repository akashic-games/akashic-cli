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
exports.SnakeSegmentType = exports.SnakeRotateState = exports.SnakeSegment = exports.Snake = void 0;

var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

var OffsetGroup_1 = require("./OffsetGroup");

var UserTouchState_1 = require("../types/UserTouchState");

var MessageEventType_1 = require("../types/MessageEventType");

var entityUtils_1 = require("../utils/entityUtils");
/**
 * Snakeクラス
 */


var Snake =
/** @class */
function (_super) {
  __extends(Snake, _super);

  function Snake(param) {
    var _this = _super.call(this, param) || this;

    _this.timeline = new akashic_timeline_1.Timeline(_this.parent.scene);
    _this.snakeType = param.snakeType;
    _this.segments = [];
    _this.angle = param.angle;
    _this._internalVecBaseScale = param.snakeBaseSpeed;
    _this._internalVecMaxScaleByBase = param.snakeMaxSpeedScale;
    _this._vecScale = 1;
    _this._snakeMaxKnotLength = param.snakeMaxKnotLength;
    _this.historyDistanceInterval = Math.round(90 / param.snakeBaseSpeed);
    _this.rotateState = SnakeRotateState.noRotate;
    _this.words = param.words;
    _this.haveJewel = false;
    _this.tweens = {};
    if (param.rebornEffect) _this._initEffectLayer();

    _this._initLayer();

    _this._initFromParam(param);

    _this._initHead(param);

    _this._initBodySegments(param);

    _this._applySegmentPositions();

    if (param.rebornEffect) _this._initRebornEffect(param);
    return _this;
  }

  Snake.prototype.update = function (param) {
    this._evolutionPositionHistory(param);

    this._applySegmentPositions();

    this._adjustHeadDirection(param.angle);
  };
  /**
   * エサを食べる
   */


  Snake.prototype.eatFood = function (food) {
    this._addKnot(food);
  };
  /**
   * お宝を食べる
   */


  Snake.prototype.eatJewel = function () {
    this.haveJewel = true;

    this._addJewel();
  };
  /**
   * お宝を消す
   */


  Snake.prototype.removeJewel = function () {
    if (!this.haveJewel) return;
    this.haveJewel = false;
    var jewel = this.segments.pop();
    if (!jewel.destroyed()) jewel.destroy();
  };
  /**
   * スネークの透過度を指定値に変更する
   */


  Snake.prototype.modifyOpacity = function (opacity) {
    this.head.opacity = opacity;
    this.head.modified();
    this.segments.forEach(function (seg) {
      seg.opacity = opacity;
      seg.modified();
    });
  };
  /**
   * 点滅アニメーション
   */


  Snake.prototype.blinking = function () {
    var _this = this;

    if (this.tweens[MessageEventType_1.AnimationType.Blinking] != null) return;
    this.tweens[MessageEventType_1.AnimationType.Blinking] = this.timeline.create(this, {
      loop: true
    }).wait(100).call(function () {
      return _this.modifyOpacity(1.0);
    }).wait(100).call(function () {
      return _this.modifyOpacity(0.5);
    });
  };
  /**
   * ダッシュエフェクト
   */


  Snake.prototype.dashing = function (state) {
    if (state === UserTouchState_1.UserTouchState.onDoubleTap) {
      if (this.head.dashEffect.visible()) return;
      this.head.dashEffect.show();
    } else {
      if (!this.head.dashEffect.visible()) return;
      this.head.dashEffect.hide();
    }
  };
  /**
   * 爆破エフェクト
   */


  Snake.prototype.explosion = function () {
    var _this = this;

    var explosionAsset = this.parent.scene.assets.explosion_effect;

    var createEffect = function createEffect(x, y) {
      var camera = g.game.focusingCamera;
      if (!camera) return;
      var margin = 50;
      if (x < camera.x - margin || x > camera.x + g.game.width + margin || y < camera.y - margin || y > camera.y + g.game.height + margin) return; // 画面外はエフェクトを作らない

      var effect = new g.FrameSprite({
        scene: _this.parent.scene,
        src: explosionAsset,
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
        width: 140,
        height: 140,
        srcWidth: 140,
        srcHeight: 140,
        loop: false,
        interval: 100,
        x: x,
        y: y,
        anchorX: 0.5,
        anchorY: 0.5,
        local: true //  生成タイミングが不定になるためentity id採番に影響しないようlocal化

      });
      effect.onFinish.add(function () {
        _this.knotLayer.remove(effect);

        if (effect.destroyed()) effect.destroy();
      });
      effect.start();

      _this.knotLayer.append(effect);
    };

    var deathHeadAsset = this.parent.scene.assets["snake" + this.snakeType + "_head_death"];
    this.head.body._surface = g.SurfaceUtil.asSurface(deathHeadAsset);
    this.head.body.invalidate();
    createEffect(this.head.x + this.head.body.x + this.head.body.width / 2, this.head.y + this.head.body.y + this.head.body.height / 2);
    this.segments.forEach(function (seg, i) {
      if (seg.type === SnakeSegmentType.Jewel) {
        seg.body.hide();
        return;
      }

      _this.root.scene.setTimeout(function () {
        seg.body.hide();
        if (seg.wordLabel != null) seg.wordLabel.hide();
        createEffect(seg.x + seg.body.x + seg.body.width / 2, seg.y + seg.body.y + seg.body.height / 2);
      }, 100 * i + 100, _this);
    });
  };
  /**
   * Tween削除
   */


  Snake.prototype.removeTween = function (animationType) {
    if (this.tweens[animationType] == null) return;
    this.timeline.remove(this.tweens[animationType]);
    this.tweens[animationType] = null;
  };

  Snake.prototype._initEffectLayer = function () {
    this.effectPaneLayer = new g.E({
      scene: this.parent.scene
    });
    this.root.append(this.effectPaneLayer);
    this.effectPaneBackground = new g.E({
      scene: this.parent.scene
    });
    this.effectPaneLayer.append(this.effectPaneBackground);
    this.effectPane = new g.Pane({
      scene: this.parent.scene,
      width: 0,
      height: 200
    });
    this.effectPaneLayer.append(this.effectPane);
    this.effectPaneBack = new g.E({
      scene: this.parent.scene
    });
    this.effectPane.append(this.effectPaneBack);
  };

  Snake.prototype._clearEffectPane = function () {
    this.effectPane.width = 0;
    this.effectPane.height = 0;
    this.effectPane.destroy();
  };
  /**
   * Layer初期化
   */


  Snake.prototype._initLayer = function () {
    this.knotLayer = new g.E({
      scene: this.parent.scene
    });
    this.root.append(this.knotLayer);
    this.headLayer = new g.E({
      scene: this.parent.scene
    });
    this.root.append(this.headLayer);
    this.jewelLayer = new g.E({
      scene: this.parent.scene
    });
    this.root.append(this.jewelLayer);
  };
  /**
   * paramからそれらしいhistoryを作る
   */


  Snake.prototype._initFromParam = function (param) {
    var _this = this;

    var isRightVec = param.angle === 0;
    this.positionHistory = []; // あたかも初期化前からheadPositionHistoryが蓄積されていたように振舞わせる
    // SegmentとSegmentの間には historyDistanceInterval フレーム数だけ間隔を設ける

    param.words.forEach(function (_, index) {
      var segmentIndex = index;

      for (var i = 0; i < _this.historyDistanceInterval; i++) {
        var frame = segmentIndex * _this.historyDistanceInterval + i;

        _this.positionHistory.push({
          x: param.x + _this._internalVecBaseScale * frame * (isRightVec ? -1 : 1),
          y: param.y,
          angle: _this.angle
        });
      }
    });
  };

  Snake.prototype._initHead = function (param) {
    this.head = new SnakeSegment({
      scene: this.parent.scene,
      x: param.x,
      y: param.y,
      angle: param.angle,
      assetId: "snake" + this.snakeType + "_head_alive",
      type: SnakeSegmentType.Head
    });
    this.headLayer.append(this.head);
  };

  Snake.prototype._initBodySegments = function (param) {
    var _this = this;

    var revWords = param.words.slice();
    revWords.reverse();
    revWords.forEach(function (word) {
      var segment = new SnakeSegment({
        scene: _this.parent.scene,
        x: 0,
        y: 0,
        angle: param.angle,
        assetId: "snake" + _this.snakeType + "_body",
        word: word,
        font: param.font,
        type: SnakeSegmentType.Knot
      });

      _this.segments.unshift(segment);

      _this.knotLayer.append(segment);
    });
  };

  Snake.prototype._initRebornEffect = function (param) {
    var _this = this;

    var isRightVec = param.angle === 0; // 右向きの初期化かどうか。真右または真左方向のみとりうるangleと仮定して扱う
    // Effect Layerの位置初期化

    if (isRightVec) {
      this.effectPane.x = this.head.x + this.head.body.x + 200;
      this.effectPane.y = this.head.y + this.head.body.y;
    } else {
      this.effectPane.x = this.head.x + this.head.body.x;
      this.effectPane.y = this.head.y + this.head.body.y;
    }

    var prevFrame = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var centerFrame = new Array(25).fill(10);
    var postFrame = [11, 12, 13, 14, 15, 16, 17];
    var portalFrames = prevFrame.concat(centerFrame, postFrame); // 演出の初期化

    var portalAsset = param.parent.scene.assets.snake_reborn;
    var portalTextAsset = param.parent.scene.assets.snake_reborn_text;
    var portal = new g.FrameSprite({
      scene: param.parent.scene,
      src: portalAsset,
      frames: portalFrames,
      width: 468,
      height: 370,
      srcWidth: 468,
      srcHeight: 370,
      loop: false,
      interval: 100,
      scaleX: isRightVec ? -1 : 1,
      x: isRightVec ? this.effectPane.x + 380 : this.effectPane.x - 480,
      y: this.effectPane.y - 188
    });
    portal.start();
    this.effectPaneBackground.append(portal);
    var portalText = new g.Sprite({
      scene: param.parent.scene,
      src: portalTextAsset,
      x: isRightVec ? portal.x - 420 : portal.x + 300,
      y: portal.y
    });
    this.effectPaneBackground.append(portalText);

    this._drawOnPaneLayer(); // 描画をPaneに移す


    var updateHandler = function updateHandler() {
      _this._updateEffctPaneLayerPosition(isRightVec);
    };

    portal.onUpdate.add(updateHandler, this);
    param.parent.scene.setTimeout(function () {
      portal.destroy();
      portalText.destroy();

      _this._drawOnNormalLayer();

      _this._clearEffectPane(); // Paneをwipeする


      param.onEndRebornEffect();
    }, portalFrames.length * 100, this);
  };

  Snake.prototype._evolutionPositionHistory = function (param) {
    var currentHeadPositionX = this.head.x;
    var currentHeadPositionY = this.head.y;
    var vecScale = this._internalVecBaseScale;

    if (param.state === UserTouchState_1.UserTouchState.onDoubleTap) {
      vecScale *= this._internalVecMaxScaleByBase;
    }

    var rad = param.angle / 180 * Math.PI;
    this.head.x += Math.sin(rad) * vecScale;
    this.head.y += -Math.cos(rad) * vecScale;
    this.head.angle = param.angle; // フィールド壁判定

    this._checkFieldBoundary(currentHeadPositionX, currentHeadPositionY, rad, param.field.width, vecScale);

    this._appendNewPositionHistory(param);
  };
  /**
   * フィールドの壁判定
   */


  Snake.prototype._checkFieldBoundary = function (currentHeadPositionX, currentHeadPositionY, rad, fieldWidth, vecScale) {
    var limitRadius = fieldWidth / 2;

    if (Math.pow(this.head.x, 2) + Math.pow(this.head.y, 2) >= Math.pow(limitRadius, 2)) {
      var vX = 1;
      var vY = (1 - currentHeadPositionX * vX) / currentHeadPositionY;

      if (this.rotateState === SnakeRotateState.noRotate) {
        // 壁衝突時に外積を求め、回転の向きを定める
        var check = currentHeadPositionX * -Math.cos(rad) - currentHeadPositionY * Math.sin(rad);
        if (check > 0) this.rotateState = SnakeRotateState.onClockwise;else this.rotateState = SnakeRotateState.onCounterClockwise;
      }

      if (this.head.y >= 0 && this.rotateState === SnakeRotateState.onClockwise || this.head.y <= 0 && this.rotateState === SnakeRotateState.onCounterClockwise) {
        vX = -vX;
        vY = -vY;
      }

      if (this.rotateState === SnakeRotateState.onClockwise && (this.head.x > 0 && this.head.y > 0 && vX < 0 && vY < 0 || this.head.x < 0 && this.head.y < 0 && vX > 0 && vY > 0)) {
        vX = -vX;
        vY = -vY;
      }

      var tangentLineNorm = Math.sqrt(Math.abs(Math.pow(vX, 2) + Math.pow(vY, 2)));
      this.head.x = currentHeadPositionX + vX / tangentLineNorm * vecScale;
      this.head.y = currentHeadPositionY + vY / tangentLineNorm * vecScale;
      var norm = Math.sqrt(Math.abs(Math.pow(this.head.x, 2) + Math.pow(this.head.y, 2)));
      this.head.x -= (norm - limitRadius) / norm * this.head.x;
      this.head.y -= (norm - limitRadius) / norm * this.head.y;
      var acos = Math.acos(vX / Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2)));
      this.head.angle = ((this.rotateState === SnakeRotateState.onClockwise ? (this.head.x <= 0 ? -acos : acos) * 180 / Math.PI + 90 : (this.head.x >= 0 ? -acos : acos) * 180 / Math.PI + 90) + 360) % 360;
    } else {
      this.rotateState = SnakeRotateState.noRotate;
    }

    this.head.modified();
  };

  Snake.prototype._appendNewPositionHistory = function (param) {
    var currentHeadPositionX = this.head.x;
    var currentHeadPositionY = this.head.y;
    var currentHeadAngle = this.angle; // 先頭に新しい座標をつける

    var appendPositionHistory = []; // ダッシュ中は補完フレームを増やす
    // maxSpeedScaleに応じて増やし、整数倍に限る

    if (param.state === UserTouchState_1.UserTouchState.onDoubleTap && !!this.positionHistory[0] && this._internalVecMaxScaleByBase > 1) {
      var diff = {
        x: (currentHeadPositionX - this.positionHistory[0].x) / this._internalVecMaxScaleByBase,
        y: (currentHeadPositionY - this.positionHistory[0].y) / this._internalVecMaxScaleByBase,
        angle: (currentHeadAngle - this.positionHistory[0].angle) / this._internalVecMaxScaleByBase
      };

      for (var i = 1; i < this._internalVecMaxScaleByBase; i++) {
        // _internalVecMaxScaleByBase - 1回だけ追加する
        var intervalElement = {
          x: this.positionHistory[0].x + diff.x * i,
          y: this.positionHistory[0].y + diff.y * i,
          angle: this.positionHistory[0].angle + diff.angle * i
        };
        appendPositionHistory.push(intervalElement);
      }

      appendPositionHistory = appendPositionHistory.reverse();
    }

    appendPositionHistory = [{
      x: currentHeadPositionX,
      y: currentHeadPositionY,
      angle: currentHeadAngle
    }].concat(appendPositionHistory);
    this.positionHistory = appendPositionHistory.concat(this.positionHistory); // positionHistoryの長さを制限する

    var maxHistoryLenth = this.historyDistanceInterval * (this._snakeMaxKnotLength + 5);
    if (this.positionHistory.length > maxHistoryLenth) this.positionHistory.length = maxHistoryLenth;
  };

  Snake.prototype._updateEffctPaneLayerPosition = function (isRightVec) {
    if (isRightVec) {
      this.effectPane.width += this._internalVecBaseScale;
      this.effectPane.modified();
    } else {
      this.effectPane.x = this.head.x + this.head.body.x - 100;
      this.effectPane.width += this._internalVecBaseScale;
      this.effectPane.modified();
    }

    this.effectPane.y = this.head.y + this.head.body.y - 100;
    this.effectPaneBack.x = -this.effectPane.x;
    this.effectPaneBack.y = -this.effectPane.y;
    this.effectPaneBack.modified();
  };
  /**
   * 現在の状態に応じてSnake全体を前に動かす
   */


  Snake.prototype._applySegmentPositions = function () {
    var _this = this;

    var camera = g.game.focusingCamera;
    var margin = 50; // 各SnakeSegmentに位置を反映する

    this.segments.forEach(function (segment, index) {
      var frame = (index + 1) * _this.historyDistanceInterval;
      var positionBase = _this.positionHistory[frame] ? _this.positionHistory[frame] : _this.head;
      segment.x = positionBase.x;
      segment.y = positionBase.y;
      segment.angle = positionBase.angle;
      segment.modified();

      if (camera) {
        if (segment.x < camera.x - margin || segment.x > camera.x + g.game.width + margin || segment.y < camera.y - margin || segment.y > camera.y + g.game.height + margin) {
          segment.hide();
        } else {
          segment.show();
        }
      }
    });
  };
  /**
   * スネークの顔の向きを調整する
   */


  Snake.prototype._adjustHeadDirection = function (angle) {
    if (angle >= 0 && angle < 180) {
      this.head.scaleX = -1;
    } else {
      this.head.scaleX = 1;
    }

    this.head.modified();
  };
  /**
   * 節の追加
   */


  Snake.prototype._addKnot = function (food) {
    var _this = this;

    this.words.push(food.word);
    var tmpSegments = []; // this.segments の逆順でSnakeSegmentを一時的に保持

    this.segments.forEach(function (seg) {
      if (seg.type !== SnakeSegmentType.Knot) return;

      if (!seg.destroyed()) {
        _this.knotLayer.remove(seg);

        tmpSegments.unshift(seg);
      }
    });

    if (this.haveJewel) {
      this.segments = [this.segments[this.segments.length - 1]];
    } else {
      this.segments = [];
    }

    var segment = new SnakeSegment({
      scene: this.parent.scene,
      x: 0,
      y: 0,
      angle: this.angle,
      assetId: this.haveJewel ? "snake_body_gold" : "snake" + this.snakeType + "_body",
      word: food.word,
      font: food.font,
      type: SnakeSegmentType.Knot
    });
    this.segments.unshift(segment);
    this.knotLayer.append(segment);
    tmpSegments.forEach(function (seg) {
      if (_this.segments.length - (_this.haveJewel ? 1 : 0) >= _this._snakeMaxKnotLength && seg.type === SnakeSegmentType.Knot) return;

      _this.segments.unshift(seg);

      _this.knotLayer.append(seg);
    });
  };
  /**
   * お宝の追加
   */


  Snake.prototype._addJewel = function () {
    var segment = new SnakeSegment({
      scene: this.parent.scene,
      x: 0,
      y: 0,
      angle: this.angle,
      assetId: "main_jewel_body",
      type: SnakeSegmentType.Jewel
    });
    this.segments.push(segment);
    this.jewelLayer.append(segment);
  };

  Snake.prototype._changeDrawLayer = function (layer) {
    this.head.remove();
    this.segments.forEach(function (segment) {
      segment.remove();
    });
    layer.append(this.head);
    this.segments.forEach(function (segment) {
      layer.append(segment);
      segment.modified();
    });
  };

  Snake.prototype._drawOnPaneLayer = function () {
    this._changeDrawLayer(this.effectPaneBack);
  };

  Snake.prototype._drawOnNormalLayer = function () {
    var _this = this;

    this.head.remove();
    this.segments.forEach(function (segment) {
      segment.remove();
    });
    this.headLayer.append(this.head);
    this.segments.forEach(function (segment) {
      _this.knotLayer.append(segment);

      segment.modified();
    });
  };

  return Snake;
}(OffsetGroup_1.OffsetGroup);

exports.Snake = Snake;
/**
 * Snakeの体節単位のクラス
 */

var SnakeSegment =
/** @class */
function (_super) {
  __extends(SnakeSegment, _super);

  function SnakeSegment(param) {
    var _this = _super.call(this, param) || this;

    _this.type = param.type;
    _this.word = param.word != null ? param.word : "";
    _this.wordLabel = null;
    _this.dashEffect = null;

    _this._init(param);

    return _this;
  }

  SnakeSegment.prototype.render = function (renderer, camera) {
    if (camera) {
      var cam = g.game.focusingCamera;
      var margin = 50;
      var globalOffset = entityUtils_1.localToGlobal(this); // 移動するのでキャッシュできない

      if (globalOffset.x >= cam.x - margin && globalOffset.x <= cam.x + g.game.width + margin && globalOffset.y >= cam.y - margin && globalOffset.y <= cam.y + g.game.height + margin) {// do nothing
      } else {
        return; // modifiedフラグはカメラに入るまで保持する
      }
    }

    _super.prototype.render.call(this, renderer, camera);
  };

  SnakeSegment.prototype._init = function (param) {
    var asset = this.scene.assets[param.assetId];
    this.body = new g.Sprite({
      scene: this.scene,
      src: asset,
      width: asset.width,
      height: asset.height,
      anchorX: 0.5,
      anchorY: 0.5,
      x: 0,
      y: 0
    });

    switch (param.type) {
      case SnakeSegmentType.Head:
        this.body.x += 20;
        this.body.angle = 90;
        this.append(this.body);
        var dashEffectAsset = this.scene.assets.main_dash_eff;
        this.dashEffect = new g.Sprite({
          scene: this.scene,
          src: dashEffectAsset,
          width: dashEffectAsset.width,
          height: dashEffectAsset.height,
          x: 5,
          y: 55,
          anchorX: 0.5,
          anchorY: 0.5,
          angle: 90,
          hidden: true
        });
        this.append(this.dashEffect);
        break;

      case SnakeSegmentType.Knot:
        this.wordLabel = new g.Label({
          scene: this.scene,
          font: param.font,
          text: param.word,
          fontSize: 50,
          textColor: "white",
          anchorX: 0.5,
          anchorY: 0.5,
          angle: -this.angle
        });
        this.append(this.body);
        this.append(this.wordLabel);
        break;

      case SnakeSegmentType.Jewel:
        this.body.angle -= this.angle;
        this.append(this.body);
        break;

      default: // do nothing

    }
  };

  return SnakeSegment;
}(g.E);

exports.SnakeSegment = SnakeSegment;
/**
 * スネークが壁伝いに進む方向
 */

var SnakeRotateState;

(function (SnakeRotateState) {
  /**
   * 時計回り
   */
  SnakeRotateState["onClockwise"] = "onClockwise";
  /**
   * 反時計回り
   */

  SnakeRotateState["onCounterClockwise"] = "onCounterClockwise";
  /**
   * 壁に接触していない
   */

  SnakeRotateState["noRotate"] = "noRotate";
})(SnakeRotateState = exports.SnakeRotateState || (exports.SnakeRotateState = {}));
/**
 * SnakeSegmentの種類
 */


var SnakeSegmentType;

(function (SnakeSegmentType) {
  /**
   * 頭
   */
  SnakeSegmentType["Head"] = "Head";
  /**
   * 節
   */

  SnakeSegmentType["Knot"] = "Knot";
  /**
   * お宝
   */

  SnakeSegmentType["Jewel"] = "Jewel";
})(SnakeSegmentType = exports.SnakeSegmentType || (exports.SnakeSegmentType = {}));