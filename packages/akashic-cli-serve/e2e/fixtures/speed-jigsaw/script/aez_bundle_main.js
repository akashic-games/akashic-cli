function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;

    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }

    g.aez_bundle_main = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }

          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }

        return n[i].exports;
      }

      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
        o(t[i]);
      }

      return o;
    }

    return r;
  }()({
    1: [function (require, module, exports) {
      "use strict";

      var ActionType;

      (function (ActionType) {
        ActionType[ActionType["Wait"] = 0] = "Wait";
        ActionType[ActionType["Call"] = 1] = "Call";
        ActionType[ActionType["TweenTo"] = 2] = "TweenTo";
        ActionType[ActionType["TweenBy"] = 3] = "TweenBy";
        ActionType[ActionType["TweenByMult"] = 4] = "TweenByMult";
        ActionType[ActionType["Cue"] = 5] = "Cue";
        ActionType[ActionType["Every"] = 6] = "Every";
      })(ActionType || (ActionType = {}));

      module.exports = ActionType;
    }, {}],
    2: [function (require, module, exports) {
      "use strict";
      /**
       * Easing関数群。
       * 参考: http://gizma.com/easing/
       */

      var Easing;

      (function (Easing) {
        /**
         * 入力値をlinearした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */
        function linear(t, b, c, d) {
          return c * t / d + b;
        }

        Easing.linear = linear;
        /**
         * 入力値をeaseInQuadした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInQuad(t, b, c, d) {
          t /= d;
          return c * t * t + b;
        }

        Easing.easeInQuad = easeInQuad;
        /**
         * 入力値をeaseOutQuadした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeOutQuad(t, b, c, d) {
          t /= d;
          return -c * t * (t - 2) + b;
        }

        Easing.easeOutQuad = easeOutQuad;
        /**
         * 入力値をeaseInOutQuadした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInOutQuad(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t + b;
          --t;
          return -c / 2 * (t * (t - 2) - 1) + b;
        }

        Easing.easeInOutQuad = easeInOutQuad;
        /**
         * 入力値をeaseInQubicした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInCubic(t, b, c, d) {
          t /= d;
          return c * t * t * t + b;
        }

        Easing.easeInCubic = easeInCubic;
        /**
         * @deprecated この関数は非推奨機能である。代わりに `easeInCubic` を用いるべきである。
         */

        Easing.easeInQubic = easeInCubic;
        /**
         * 入力値をeaseOutQubicした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeOutCubic(t, b, c, d) {
          t /= d;
          --t;
          return c * (t * t * t + 1) + b;
        }

        Easing.easeOutCubic = easeOutCubic;
        /**
         * @deprecated この関数は非推奨機能である。代わりに `easeOutCubic` を用いるべきである。
         */

        Easing.easeOutQubic = easeOutCubic;
        /**
         * 入力値をeaseInOutQubicした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInOutCubic(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        }

        Easing.easeInOutCubic = easeInOutCubic;
        /**
         * @deprecated この関数は非推奨機能である。代わりに `easeInOutCubic` を用いるべきである。
         */

        Easing.easeInOutQubic = easeInOutCubic;
        /**
         * 入力値をeaseInQuartした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInQuart(t, b, c, d) {
          t /= d;
          return c * t * t * t * t + b;
        }

        Easing.easeInQuart = easeInQuart;
        /**
         * 入力値をeaseOutQuartした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeOutQuart(t, b, c, d) {
          t /= d;
          --t;
          return -c * (t * t * t * t - 1) + b;
        }

        Easing.easeOutQuart = easeOutQuart;
        /**
         * 入力値をeaseInQuintした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInQuint(t, b, c, d) {
          t /= d;
          return c * t * t * t * t * t + b;
        }

        Easing.easeInQuint = easeInQuint;
        /**
         * 入力値をeaseOutQuintした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeOutQuint(t, b, c, d) {
          t /= d;
          --t;
          return c * (t * t * t * t * t + 1) + b;
        }

        Easing.easeOutQuint = easeOutQuint;
        /**
         * 入力値をeaseInOutQuintした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInOutQuint(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t * t * t + 2) + b;
        }

        Easing.easeInOutQuint = easeInOutQuint;
        /**
         * 入力値をeaseInSineした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInSine(t, b, c, d) {
          return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        }

        Easing.easeInSine = easeInSine;
        /**
         * 入力値をeaseOutSineした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeOutSine(t, b, c, d) {
          return c * Math.sin(t / d * (Math.PI / 2)) + b;
        }

        Easing.easeOutSine = easeOutSine;
        /**
         * 入力値をeaseInOutSineした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInOutSine(t, b, c, d) {
          return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }

        Easing.easeInOutSine = easeInOutSine;
        /**
         * 入力値をeaseInExpoした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInExpo(t, b, c, d) {
          return c * Math.pow(2, 10 * (t / d - 1)) + b;
        }

        Easing.easeInExpo = easeInExpo;
        /**
         * 入力値をeaseInOutExpoした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInOutExpo(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          --t;
          return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        }

        Easing.easeInOutExpo = easeInOutExpo;
        /**
         * 入力値をeaseInCircした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInCirc(t, b, c, d) {
          t /= d;
          return -c * (Math.sqrt(1 - t * t) - 1) + b;
        }

        Easing.easeInCirc = easeInCirc;
        /**
         * 入力値をeaseOutCircした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeOutCirc(t, b, c, d) {
          t /= d;
          --t;
          return c * Math.sqrt(1 - t * t) + b;
        }

        Easing.easeOutCirc = easeOutCirc;
        /**
         * 入力値をeaseInOutCircした結果の現在位置を返す。
         * @param t 経過時間
         * @param b 開始位置
         * @param c 終了位置
         * @param d 所要時間
         */

        function easeInOutCirc(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
          t -= 2;
          return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        }

        Easing.easeInOutCirc = easeInOutCirc;
      })(Easing || (Easing = {}));

      module.exports = Easing;
    }, {}],
    3: [function (require, module, exports) {
      "use strict";

      var Tween = require("./Tween");
      /**
       * タイムライン機能を提供するクラス。
       */


      var Timeline =
      /** @class */
      function () {
        /**
         * Timelineを生成する。
         * @param scene タイムラインを実行する `Scene`
         */
        function Timeline(scene) {
          this._scene = scene;
          this._tweens = [];
          this._fps = this._scene.game.fps;
          this.paused = false;
          scene.update.add(this._handler, this);
        }
        /**
         * Timelineに紐付いたTweenを生成する。
         * @param target タイムライン処理の対象にするオブジェクト
         * @param option Tweenの生成オプション
         */


        Timeline.prototype.create = function (target, option) {
          var t = new Tween(target, option);

          this._tweens.push(t);

          return t;
        };
        /**
         * Timelineに紐付いたTweenを削除する。
         * @param tween 削除するTween。
         */


        Timeline.prototype.remove = function (tween) {
          var index = this._tweens.indexOf(tween);

          if (index < 0) {
            return;
          }

          this._tweens.splice(index, 1);
        };
        /**
         * Timelineに紐付いた全Tweenの紐付けを解除する。
         */


        Timeline.prototype.clear = function () {
          this._tweens.length = 0;
        };
        /**
         * このTimelineを破棄する。
         */


        Timeline.prototype.destroy = function () {
          this._tweens.length = 0;

          if (!this._scene.destroyed()) {
            this._scene.update.remove(this._handler, this);
          }

          this._scene = undefined;
        };
        /**
         * このTimelineが破棄済みであるかを返す。
         */


        Timeline.prototype.destroyed = function () {
          return this._scene === undefined;
        };

        Timeline.prototype._handler = function () {
          if (this._tweens.length === 0 || this.paused) {
            return;
          }

          var tmp = [];

          for (var i = 0; i < this._tweens.length; ++i) {
            var tween = this._tweens[i];

            if (!tween.destroyed()) {
              tween._fire(1000 / this._fps);

              tmp.push(tween);
            }
          }

          this._tweens = tmp;
        };

        return Timeline;
      }();

      module.exports = Timeline;
    }, {
      "./Tween": 4
    }],
    4: [function (require, module, exports) {
      "use strict";

      var Easing = require("./Easing");

      var ActionType = require("./ActionType");
      /**
       * オブジェクトの状態を変化させるアクションを定義するクラス。
       * 本クラスのインスタンス生成には`Timeline#create()`を利用する。
       */


      var Tween =
      /** @class */
      function () {
        /**
         * Tweenを生成する。
         * @param target 対象となるオブジェクト
         * @param option オプション
         */
        function Tween(target, option) {
          this._target = target;
          this._stepIndex = 0;
          this._loop = !!option && !!option.loop;
          this._modifiedHandler = option && option.modified ? option.modified : undefined;
          this._destroyedHandler = option && option.destroyed ? option.destroyed : undefined;
          this._steps = [];
          this._lastStep = undefined;
          this._pararel = false;
          this.paused = false;
        }
        /**
         * オブジェクトの状態を変化させるアクションを追加する。
         * @param props 変化内容
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.to = function (props, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          var action = {
            input: props,
            duration: duration,
            easing: easing,
            type: ActionType.TweenTo,
            initialized: false
          };

          this._push(action);

          return this;
        };
        /**
         * オブジェクトの状態を変化させるアクションを追加する。
         * 変化内容はアクション開始時を基準とした相対値で指定する。
         * @param props 変化内容
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         * @param multiply `true`を指定すると`props`の値をアクション開始時の値に掛け合わせた値が終了値となる（指定しない場合は`false`）
         */


        Tween.prototype.by = function (props, duration, easing, multiply) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          if (multiply === void 0) {
            multiply = false;
          }

          var type = multiply ? ActionType.TweenByMult : ActionType.TweenBy;
          var action = {
            input: props,
            duration: duration,
            easing: easing,
            type: type,
            initialized: false
          };

          this._push(action);

          return this;
        };
        /**
         * 次に追加されるアクションを、このメソッド呼び出しの直前に追加されたアクションと並列に実行させる。
         * `Tween#con()`で並列実行を指定されたアクションが全て終了後、次の並列実行を指定されていないアクションを実行する。
         */


        Tween.prototype.con = function () {
          this._pararel = true;
          return this;
        };
        /**
         * オブジェクトの変化を停止するアクションを追加する。
         * @param duration 停止する時間（ミリ秒）
         */


        Tween.prototype.wait = function (duration) {
          var action = {
            duration: duration,
            type: ActionType.Wait,
            initialized: false
          };

          this._push(action);

          return this;
        };
        /**
         * 関数を即座に実行するアクションを追加する。
         * @param func 実行する関数
         */


        Tween.prototype.call = function (func) {
          var action = {
            func: func,
            type: ActionType.Call,
            duration: 0,
            initialized: false
          };

          this._push(action);

          return this;
        };
        /**
         * 一時停止するアクションを追加する。
         * 内部的には`Tween#call()`で`Tween#paused`に`true`をセットしている。
         */


        Tween.prototype.pause = function () {
          var _this = this;

          return this.call(function () {
            _this.paused = true;
          });
        };
        /**
         * 待機時間をキーとして実行したい関数を複数指定する。
         * @param actions 待機時間をキーとして実行したい関数を値としたオブジェクト
         */


        Tween.prototype.cue = function (funcs) {
          var keys = Object.keys(funcs);
          keys.sort(function (a, b) {
            return Number(a) > Number(b) ? 1 : -1;
          });
          var q = [];

          for (var i = 0; i < keys.length; ++i) {
            q.push({
              time: Number(keys[i]),
              func: funcs[keys[i]]
            });
          }

          var action = {
            type: ActionType.Cue,
            duration: Number(keys[keys.length - 1]),
            cue: q,
            initialized: false
          };

          this._push(action);

          return this;
        };
        /**
         * 指定した時間を経過するまで毎フレーム指定した関数を呼び出すアクションを追加する。
         * @param func 毎フレーム呼び出される関数。第一引数は経過時間、第二引数はEasingした結果の変化量（0-1）となる。
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.every = function (func, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          var action = {
            func: func,
            type: ActionType.Every,
            easing: easing,
            duration: duration,
            initialized: false
          };

          this._push(action);

          return this;
        };
        /**
         * ターゲットをフェードインさせるアクションを追加する。
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.fadeIn = function (duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            opacity: 1
          }, duration, easing);
        };
        /**
         * ターゲットをフェードアウトさせるアクションを追加する。
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.fadeOut = function (duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            opacity: 0
          }, duration, easing);
        };
        /**
         * ターゲットを指定した座標に移動するアクションを追加する。
         * @param x x座標
         * @param y y座標
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.moveTo = function (x, y, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            x: x,
            y: y
          }, duration, easing);
        };
        /**
         * ターゲットを指定した相対座標に移動するアクションを追加する。相対座標の基準値はアクション開始時の座標となる。
         * @param x x座標
         * @param y y座標
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.moveBy = function (x, y, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.by({
            x: x,
            y: y
          }, duration, easing);
        };
        /**
         * ターゲットのX座標を指定した座標に移動するアクションを追加する。
         * @param x x座標
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.moveX = function (x, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            x: x
          }, duration, easing);
        };
        /**
         * ターゲットのY座標を指定した座標に移動するアクションを追加する。
         * @param y y座標
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.moveY = function (y, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            y: y
          }, duration, easing);
        };
        /**
         * ターゲットを指定した角度に回転するアクションを追加する。
         * @param angle 角度
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.rotateTo = function (angle, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            angle: angle
          }, duration, easing);
        };
        /**
         * ターゲットをアクション開始時の角度を基準とした相対角度に回転するアクションを追加する。
         * @param angle 角度
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.rotateBy = function (angle, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.by({
            angle: angle
          }, duration, easing);
        };
        /**
         * ターゲットを指定した倍率に拡縮するアクションを追加する。
         * @param scaleX X方向の倍率
         * @param scaleY Y方向の倍率
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.scaleTo = function (scaleX, scaleY, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.to({
            scaleX: scaleX,
            scaleY: scaleY
          }, duration, easing);
        };
        /**
         * ターゲットのアクション開始時の倍率に指定した倍率を掛け合わせた倍率に拡縮するアクションを追加する。
         * @param scaleX X方向の倍率
         * @param scaleY Y方向の倍率
         * @param duration 変化に要する時間（ミリ秒）
         * @param easing Easing関数（指定しない場合は`Easing.linear`）
         */


        Tween.prototype.scaleBy = function (scaleX, scaleY, duration, easing) {
          if (easing === void 0) {
            easing = Easing.linear;
          }

          return this.by({
            scaleX: scaleX,
            scaleY: scaleY
          }, duration, easing, true);
        };
        /**
         * Tweenが破棄されたかどうかを返す。
         * `_target`が破棄された場合又は、全アクションの実行が終了した場合に`true`を返す。
         */


        Tween.prototype.destroyed = function () {
          var ret = false;

          if (this._destroyedHandler) {
            ret = this._destroyedHandler.call(this._target);
          }

          if (!ret) {
            ret = this._stepIndex >= this._steps.length && !this._loop;
          }

          return ret;
        };
        /**
         * アニメーションを実行する。
         * @param delta 前フレームからの経過時間
         */


        Tween.prototype._fire = function (delta) {
          if (this._steps.length === 0 || this.destroyed() || this.paused) {
            return;
          }

          if (this._stepIndex >= this._steps.length) {
            if (this._loop) {
              this._stepIndex = 0;
            } else {
              return;
            }
          }

          var actions = this._steps[this._stepIndex];
          var remained = false;

          for (var i = 0; i < actions.length; ++i) {
            var action = actions[i];

            if (!action.initialized) {
              this._initAction(action);
            }

            if (action.finished) {
              continue;
            }

            action.elapsed += delta;

            switch (action.type) {
              case ActionType.Call:
                action.func.call(this._target);
                break;

              case ActionType.Every:
                var progress = action.easing(action.elapsed, 0, 1, action.duration);

                if (progress > 1) {
                  progress = 1;
                }

                action.func.call(this._target, action.elapsed, progress);
                break;

              case ActionType.TweenTo:
              case ActionType.TweenBy:
              case ActionType.TweenByMult:
                var keys = Object.keys(action.goal);

                for (var j = 0; j < keys.length; ++j) {
                  var key = keys[j];

                  if (action.elapsed >= action.duration) {
                    this._target[key] = action.goal[key];
                  } else {
                    this._target[key] = action.easing(action.elapsed, action.start[key], action.goal[key] - action.start[key], action.duration);
                  }
                }

                break;

              case ActionType.Cue:
                var cueAction = action.cue[action.cueIndex];

                if (cueAction !== undefined && action.elapsed >= cueAction.time) {
                  cueAction.func.call(this._target);
                  ++action.cueIndex;
                }

                break;
            }

            if (this._modifiedHandler) {
              this._modifiedHandler.call(this._target);
            }

            if (action.elapsed >= action.duration) {
              action.finished = true;
            } else {
              remained = true;
            }
          }

          if (!remained) {
            for (var k = 0; k < actions.length; ++k) {
              actions[k].initialized = false;
            }

            ++this._stepIndex;
          }
        };
        /**
         * Tweenの実行状態をシリアライズして返す。
         */


        Tween.prototype.serializeState = function () {
          var tData = {
            _stepIndex: this._stepIndex,
            _steps: []
          };

          for (var i = 0; i < this._steps.length; ++i) {
            tData._steps[i] = [];

            for (var j = 0; j < this._steps[i].length; ++j) {
              tData._steps[i][j] = {
                input: this._steps[i][j].input,
                start: this._steps[i][j].start,
                goal: this._steps[i][j].goal,
                duration: this._steps[i][j].duration,
                elapsed: this._steps[i][j].elapsed,
                type: this._steps[i][j].type,
                cueIndex: this._steps[i][j].cueIndex,
                initialized: this._steps[i][j].initialized,
                finished: this._steps[i][j].finished
              };
            }
          }

          return tData;
        };
        /**
         * Tweenの実行状態を復元する。
         * @param serializedstate 復元に使う情報。
         */


        Tween.prototype.deserializeState = function (serializedState) {
          this._stepIndex = serializedState._stepIndex;

          for (var i = 0; i < serializedState._steps.length; ++i) {
            for (var j = 0; j < serializedState._steps[i].length; ++j) {
              if (!serializedState._steps[i][j] || !this._steps[i][j]) continue;
              this._steps[i][j].input = serializedState._steps[i][j].input;
              this._steps[i][j].start = serializedState._steps[i][j].start;
              this._steps[i][j].goal = serializedState._steps[i][j].goal;
              this._steps[i][j].duration = serializedState._steps[i][j].duration;
              this._steps[i][j].elapsed = serializedState._steps[i][j].elapsed;
              this._steps[i][j].type = serializedState._steps[i][j].type;
              this._steps[i][j].cueIndex = serializedState._steps[i][j].cueIndex;
              this._steps[i][j].initialized = serializedState._steps[i][j].initialized;
              this._steps[i][j].finished = serializedState._steps[i][j].finished;
            }
          }
        };
        /**
         * `this._pararel`が`false`の場合は新規にステップを作成し、アクションを追加する。
         * `this._pararel`が`true`の場合は最後に作成したステップにアクションを追加する。
         */


        Tween.prototype._push = function (action) {
          if (this._pararel) {
            this._lastStep.push(action);
          } else {
            var index = this._steps.push([action]) - 1;
            this._lastStep = this._steps[index];
          }

          this._pararel = false;
        };

        Tween.prototype._initAction = function (action) {
          action.elapsed = 0;
          action.start = {};
          action.goal = {};
          action.cueIndex = 0;
          action.finished = false;
          action.initialized = true;

          if (action.type !== ActionType.TweenTo && action.type !== ActionType.TweenBy && action.type !== ActionType.TweenByMult) {
            return;
          }

          var keys = Object.keys(action.input);

          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];

            if (this._target[key] !== undefined) {
              action.start[key] = this._target[key];

              if (action.type === ActionType.TweenTo) {
                action.goal[key] = action.input[key];
              } else if (action.type === ActionType.TweenBy) {
                action.goal[key] = action.start[key] + action.input[key];
              } else if (action.type === ActionType.TweenByMult) {
                action.goal[key] = action.start[key] * action.input[key];
              }
            }
          }
        };

        return Tween;
      }();

      module.exports = Tween;
    }, {
      "./ActionType": 1,
      "./Easing": 2
    }],
    5: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Timeline = require("./Timeline");
      exports.Tween = require("./Tween");
      exports.Easing = require("./Easing");
    }, {
      "./Easing": 2,
      "./Timeline": 3,
      "./Tween": 4
    }],
    6: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var AStage =
      /** @class */
      function () {
        function AStage() {
          this.finishCallback = [];
        }

        AStage.prototype.finishStage = function () {
          this.finishCallback.forEach(function (cb) {
            cb();
          });
        };

        return AStage;
      }();

      exports.AStage = AStage;
    }, {}],
    7: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Global_1 = require("./Global");

      var AudioPresenter =
      /** @class */
      function () {
        function AudioPresenter(_scene) {
          this._s = null;
          this.bgmPlayer = null;
          this._s = _scene;
        }

        AudioPresenter.initialize = function (_s) {
          AudioPresenter.instance = new AudioPresenter(_s);
        };

        AudioPresenter.prototype.playBGM = function (name) {
          if (Global_1.Global.instance.muteSound) {
            return;
          }

          if (this.bgmPlayer !== null) {
            if (this.bgmPlayer.id === name) {
              return;
            } else {
              this.stopBGM();
            }
          }

          this.bgmPlayer = this._s.assets[name];
          this.bgmPlayer.play();
        };

        AudioPresenter.prototype.stopBGM = function () {
          if (this.bgmPlayer === null) {
            return;
          }

          this.bgmPlayer.stop();
          this.bgmPlayer = null;
        };

        AudioPresenter.prototype.playJINGLE = function (name) {
          if (Global_1.Global.instance.muteSound) {
            return;
          }

          return this._s.assets[name].play();
        };

        AudioPresenter.prototype.playSE = function (name) {
          if (Global_1.Global.instance.muteSound) {
            return;
          }

          return this._s.assets[name].play();
        };

        return AudioPresenter;
      }();

      exports.AudioPresenter = AudioPresenter;
    }, {
      "./Global": 14
    }],
    8: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var NumberValue_1 = require("./NumberValue");

      var ComboView =
      /** @class */
      function (_super) {
        __extends(ComboView, _super);

        function ComboView(s, v) {
          if (v === void 0) {
            v = 0;
          }

          var _this = _super.call(this, {
            scene: s
          }) || this;

          _this.label = null;
          var base = SpriteFactory_1.SpriteFactory.createComboYellowBase(s);

          _this.append(base);

          var info = NumberValue_1.NumberFont.generate(s, NumberValue_1.NumberType.Y28);
          _this.label = info.label;
          _this.label.fontSize = 36;

          _this.label.invalidate();

          _this.append(_this.label);

          _this.Value = v;
          return _this;
        }

        Object.defineProperty(ComboView.prototype, "Value", {
          set: function set(v) {
            this.label.text = (v | 0).toString();
            this.label.invalidate();
            var n = this.label.text.length - 1;
            this.label.x = ComboView.NUM_OFFSET_X - n * this.label.fontSize;
            this.label.y = ComboView.NUM_OFFSET_Y;
            this.label.modified();
          },
          enumerable: true,
          configurable: true
        });
        ComboView.NUM_OFFSET_X = 152;
        ComboView.NUM_OFFSET_Y = 1;
        return ComboView;
      }(g.E);

      exports.ComboView = ComboView;
    }, {
      "./NumberValue": 16,
      "./SpriteFactory": 24
    }],
    9: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var tl = require("@akashic-extension/akashic-timeline");

      var GameTimer_1 = require("./GameTimer");

      var Global_1 = require("./Global");

      var AudioPresenter_1 = require("./AudioPresenter");

      var FieldScore_1 = require("./FieldScore");

      var ReadyGo_1 = require("./ReadyGo");

      var AStage_1 = require("./AStage");

      var OuterParamReceiver_1 = require("./OuterParamReceiver");

      var GameField_1 = require("./GameField");

      var Easing_1 = require("@akashic-extension/akashic-timeline/lib/Easing");

      var Queue_1 = require("./Queue");

      var TimeOver_1 = require("./TimeOver");

      var ComboView_1 = require("./ComboView");

      var Util_1 = require("./Util");

      var FieldScene =
      /** @class */
      function (_super) {
        __extends(FieldScene, _super);

        function FieldScene(_scene) {
          var _this = _super.call(this) || this;

          _this.firstLevelNum = 1;
          _this.level = 1;
          _this.score = 0;
          _this.combo = 0;
          _this.BG = [];
          _this.scene = null;
          _this.readyGo = null;
          _this.comboView = null;
          _this.elapsedStartTime = 0;
          _this.answerElapsedTime = 0;
          _this.seethroughRemainTime = 0;
          _this.gf = new Queue_1.Queue();
          _this.pause = false;
          _this.pictureNumberTable = [];
          _this.lastSelectPictureNumber = -1;
          _this.scene = _scene;
          return _this;
        }

        FieldScene.prototype.activate = function (_scene) {
          var _this = this;

          this.pause = false;

          var _sv = new FieldScore_1.FieldScore(_scene);

          for (var i = 0, max = FieldScene.BG_NUM; i < max; ++i) {
            var _e = new g.E({
              scene: _scene
            });

            this.BG.push(_e);
          }

          for (var i = 0, max = FieldScene.BG_NUM; i < max; ++i) {
            _scene.append(this.BG[max - i - 1]);
          }

          _sv.init(_scene);

          this.BG[1].append(_sv.rootEntity);

          _sv.show(_scene, FieldScene.FIELDSCORE_POS_X, FieldScene.FIELDSCORE_POS_Y);

          _sv.value = this.score;
          this.scoreView = _sv;
          var gt = Global_1.Global.instance.totalTimeLimit - FieldScene.TIMER_MERGIN;

          if (FieldScene.TIMER_MAX < gt) {
            gt = FieldScene.TIMER_MAX;
          }

          var cv = new ComboView_1.ComboView(_scene);
          cv.x = 201;
          cv.y = 4;
          cv.modified();
          this.BG[1].append(cv);
          this.comboView = cv;
          var t = new GameTimer_1.GameTimer(_scene);
          t.show(FieldScene.GAMETIMER_POS_X, FieldScene.GAMETIMER_POS_Y, gt);

          var _ft = new g.FilledRect({
            scene: _scene,
            width: _scene.game.width,
            height: _scene.game.height,
            cssColor: "#000000",
            opacity: 0,
            touchable: true
          });

          this.BG[0].append(_ft);
          this.fieldTouchMask = _ft;
          this.BG[1].append(t.rootEntity);
          this.timer = t;

          var _readygo = new ReadyGo_1.ReadyGo(_scene);

          this.readyGo = _readygo;
          this.combo = 0;
          this.BG[0].append(_readygo.rootEntity);
          var difficulty = Global_1.Global.instance.difficulty;

          if (Global_1.Global.instance.DEBUG) {
            difficulty = 4;
          }

          if (difficulty < 1) {
            difficulty = 1;
          }

          this.level = Math.max(1, Math.min(10, difficulty)); // 最初の設定

          var remainTime = this.generateRemainTime(this.level);
          this.seethroughRemainTime = remainTime;
          this.createGameField(this.level, remainTime, FieldScene.FIRSTGAME_DELAY);
          this.scene.setInterval(function () {
            _this.elapsedStartTime += 100;
          }, 100);

          _readygo.show().finishCallback.push(this.gameStartInit.bind(this));
        };

        FieldScene.prototype.gameStartInit = function () {
          var _this = this;

          var t = this.timer; // 		this.elapsedStartTime = t.now;

          this.gf.peek().gameStart();
          this.questStart();
          t.start().finishCallback.push(function () {
            if (!Global_1.Global.instance.DEBUG) {
              _this.fieldTouchMask.show();

              var _eff = new TimeOver_1.TimeOver(_this.scene);

              _this.BG[0].append(_eff.rootEntity);

              _eff.show(250, 500).finishCallback.push(function () {
                _this.fieldTouchMask.show();

                _this.sceneFinish();
              });
            }
          });
          AudioPresenter_1.AudioPresenter.instance.playBGM("bgm_130");
          this.fieldTouchMask.hide();
        };

        FieldScene.prototype.dispose = function () {
          if (this.BG[3].destroyed()) {
            return;
          }

          this.BG[3].destroy();
          this.BG[2].destroy();
          this.BG[1].destroy();
        };

        FieldScene.prototype.generateRemainTime = function (lv) {
          // 1 + (難易度 * 0.5秒)...?
          var time = (10 - (lv - 1)) * 0.5 + 1;

          if (time < 1) {
            time = 1;
          }

          if (6 < time) {
            time = 6;
          }

          return time * 1000;
        };

        FieldScene.prototype.createGameField = function (level, remain, startDelay) {
          var _this = this;

          if (startDelay === void 0) {
            startDelay = 0;
          }

          Global_1.Global.instance.log("createGameField:" + level);
          var lv = GameField_1.LevelData.getLevelInfo(level);
          var g = new GameField_1.GameField(this.scene, this.getPictureNumber(), level, startDelay);
          g.onPieceMatchCheck.push(function (idx, result, remainp) {
            if (result) {
              _this.combo++;

              var score = _this.generateAppendScore(remainp === 0);

              var comboBonus = 0;

              if (1 < _this.combo) {
                comboBonus = _this.combo * FieldScene.COMBO_SCORE_RATIO;
              }

              _this.addScore(score + comboBonus);
            } else {
              _this.combo = 0;
            }

            _this.comboView.Value = _this.combo;
          });
          g.clearCallback.push(function () {
            _this.allRemain(750);
          });

          if (!this.gf.IsEmpty) {
            g.x = this.scene.game.width;
            g.modified();
          }

          this.BG[3].append(g);
          this.gf.push(g);
        };

        FieldScene.prototype.allRemain = function (delay) {
          var _this = this;

          this.scene.setTimeout(function () {
            if (!Global_1.Global.instance.DEBUG) {
              if (_this.timer.now <= 0) {
                return;
              }
            }

            _this.levelUpAction();

            _this.createGameField(_this.level, 0, FieldScene.GAME_DELAY);

            _this.transitNextQuestionAsync(FieldScene.TRANSIT_WAIT);
          }, delay);
        };

        FieldScene.prototype.levelUpAction = function () {
          this.level++;

          if (FieldScene.MAX_LEVEL <= this.level) {
            this.level = FieldScene.MAX_LEVEL;
          }
        };

        FieldScene.prototype.generateAppendScore = function (isClear) {
          if (isClear === void 0) {
            isClear = false;
          }

          var nt = this.elapsedStartTime;
          var score = FieldScene.SCORE_TOP - ((nt - this.answerElapsedTime) / 100 | 0);

          if (score < 0) {
            score = 1;
          }

          if (isClear) {
            score += FieldScene.STAGE_CLEAR_BONUS;
          }

          return score | 0;
        };

        FieldScene.prototype.addScore = function (add) {
          this.score += add;
          this.scoreView.value = this.score;
          OuterParamReceiver_1.OuterParamReceiver.setGlobalScore(this.score);
        };

        FieldScene.prototype.transitNextQuestionAsync = function (animationTime) {
          var _this = this;

          var _tl = new tl.Timeline(this.scene);

          var bgId = 3;

          _tl.create(this.BG[bgId], {
            modified: this.BG[bgId].modified,
            destroyed: this.BG[bgId].destroyed
          }).moveX(-this.scene.game.width, animationTime, Easing_1.easeOutQuad).con().every(function (e, p) {
            if (p < 1) {
              return;
            }

            _this.BG[bgId].x = 0;

            _this.BG[bgId].modified();

            var disposedObject = _this.gf.pop();

            disposedObject.dispose();

            var currentObject = _this.gf.peek();

            currentObject.x = 0;
            currentObject.modified();
            currentObject.gameStart();

            _this.questStart();

            _tl.destroy();
          }, animationTime);
        };

        FieldScene.prototype.sceneFinish = function () {
          Global_1.Global.instance.score = this.score;
          AudioPresenter_1.AudioPresenter.instance.stopBGM();

          for (var n = 1, max = 3; n <= max; ++n) {
            this.BG[n].opacity = 0;
            this.BG[n].modified();
          }

          this.finishStage();
        };

        FieldScene.prototype.questStart = function () {
          this.fieldTouchMask.hide();
          this.answerElapsedTime = this.elapsedStartTime;
        };

        FieldScene.prototype.getPictureNumber = function () {
          if (this.pictureNumberTable.length < 1) {
            this.pictureNumberTable = Util_1.Util.shuffle(Util_1.Util.range(0, 5));

            if (this.pictureNumberTable[0] === this.lastSelectPictureNumber) {
              var n = this.pictureNumberTable[0];
              this.pictureNumberTable[0] = 5;
              this.pictureNumberTable.push(n);
            }
          }

          this.lastSelectPictureNumber = this.pictureNumberTable.pop();
          return this.lastSelectPictureNumber;
        };

        FieldScene.TIMER_MERGIN = 22;
        FieldScene.TIMER_MAX = 99;
        FieldScene.MAX_LEVEL = 10;
        FieldScene.BG_NUM = 4;
        FieldScene.FIELDSCORE_POS_X = 552;
        FieldScene.FIELDSCORE_POS_Y = 0;
        FieldScene.GAMETIMER_POS_X = 82;
        FieldScene.GAMETIMER_POS_Y = 4;
        FieldScene.FIRSTGAME_DELAY = 1500;
        FieldScene.GAME_DELAY = 1000;
        FieldScene.TRANSIT_WAIT = 800;
        FieldScene.COMBO_SCORE_RATIO = 5;
        FieldScene.SCORE_TOP = 100;
        FieldScene.STAGE_CLEAR_BONUS = 300;
        return FieldScene;
      }(AStage_1.AStage);

      exports.FieldScene = FieldScene;
    }, {
      "./AStage": 6,
      "./AudioPresenter": 7,
      "./ComboView": 8,
      "./FieldScore": 10,
      "./GameField": 11,
      "./GameTimer": 13,
      "./Global": 14,
      "./OuterParamReceiver": 17,
      "./Queue": 20,
      "./ReadyGo": 21,
      "./TimeOver": 25,
      "./Util": 27,
      "@akashic-extension/akashic-timeline": 5,
      "@akashic-extension/akashic-timeline/lib/Easing": 2
    }],
    10: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var NumberValue_1 = require("./NumberValue");

      var SpriteFactory_1 = require("./SpriteFactory");

      var FieldScore =
      /** @class */
      function () {
        function FieldScore(_s) {
          this.rootEntity = new g.E({
            scene: _s,
            x: 0,
            y: 0
          });
        }

        Object.defineProperty(FieldScore.prototype, "value", {
          set: function set(_v) {
            this.label.text = _v.toString();
            this.label.invalidate();
            var px = this.label.text.length * 28;
            this.label.x = this.pt.x - this.label.width;
            this.label.y = 5;
            this.label.modified();
          },
          enumerable: true,
          configurable: true
        });

        FieldScore.prototype.init = function (_s) {
          var _f = NumberValue_1.NumberFont.instance;

          var _l = _f.genelateLabel28(_s);

          this.label = _l;
          this.font = _f;

          var _pt = SpriteFactory_1.SpriteFactory.createPtImage(_s);

          _pt.x = -_pt.width;
          _pt.y = 10;

          _pt.modified();

          this.pt = _pt;
          this.rootEntity.append(_pt);
          this.rootEntity.append(_l);
        };

        FieldScore.prototype.dispose = function () {
          if (this.label.destroyed()) {
            return;
          }

          this.label.destroy();
          this.font.destroy();
          this.pt.destroy();
        };

        FieldScore.prototype.show = function (_s, sx, sy) {
          this.rootEntity.x = sx;
          this.rootEntity.y = sy;
          this.rootEntity.modified();
        };

        return FieldScore;
      }();

      exports.FieldScore = FieldScore;
    }, {
      "./NumberValue": 16,
      "./SpriteFactory": 24
    }],
    11: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var Global_1 = require("./Global");

      var Util_1 = require("./Util");

      var AudioPresenter_1 = require("./AudioPresenter");

      var Picture_1 = require("./Picture");

      var PieceSelectField_1 = require("./PieceSelectField");

      var RemainPieceView_1 = require("./RemainPieceView");

      var LevelParam =
      /** @class */
      function () {
        function LevelParam() {}

        return LevelParam;
      }();

      var LevelData =
      /** @class */
      function () {
        function LevelData() {}

        LevelData.getLevelInfo = function (lv) {
          var nlv = Math.max(LevelData.LEVEL_MIN, Math.min(lv, Math.min(LevelData.LEVEL_MAX, LevelData.levelInfo.length))) - 1;
          return LevelData.levelInfo[nlv];
        };

        LevelData.LEVEL_MIN = 1;
        LevelData.LEVEL_MAX = 10;
        LevelData.levelInfo = [{
          divX: 2,
          divY: 2,
          pieceSize: PieceSelectField_1.PieceSize.L
        }, {
          divX: 3,
          divY: 3,
          pieceSize: PieceSelectField_1.PieceSize.M
        }, {
          divX: 3,
          divY: 3,
          pieceSize: PieceSelectField_1.PieceSize.M
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }, {
          divX: 4,
          divY: 4,
          pieceSize: PieceSelectField_1.PieceSize.S
        }];
        return LevelData;
      }();

      exports.LevelData = LevelData;

      var GameField =
      /** @class */
      function (_super) {
        __extends(GameField, _super);

        function GameField(s, pictureId, level, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          var _this = _super.call(this, {
            scene: s
          }) || this;

          _this.onPieceMatchCheck = [];
          _this.clearCallback = [];
          _this.touchLayer = null;
          _this.pieceLayer = null;
          _this.baseLayer = null;
          _this.pic = null;
          _this.pieceField = null;
          _this.remainView = null;
          _this.selectPieceIndex = -1;
          _this.pieceNum = 0;
          Global_1.Global.instance.log("GameField: " + pictureId.toString());
          _this.baseLayer = new g.E({
            scene: s
          });

          _this.append(_this.baseLayer);

          _this.touchLayer = new g.E({
            scene: s
          });
          var lvinfo = LevelData.getLevelInfo(level);

          _this.createFieldImage(_this.baseLayer);

          var pic = new Picture_1.Picture(s, pictureId, lvinfo.divX, lvinfo.divY);
          pic.x = GameField.PIC_OFFSET_X;
          pic.y = GameField.PIC_OFFSET_Y;
          pic.modified();

          _this.baseLayer.append(pic);

          _this.pieceNum = pic.Pieces.length;
          var rpv = new RemainPieceView_1.RemainPieceView(s);
          rpv.x = GameField.SELECTFRAME_BASE_X - GameField.POS_X;
          rpv.y = -1;
          rpv.modified();
          _this.remainView = rpv;

          _this.baseLayer.append(rpv);

          var pf = new PieceSelectField_1.PieceSelectField(s, lvinfo.pieceSize, pic.Pieces);
          pf.x = GameField.SELECTFRAME_BASE_X - GameField.POS_X;
          pf.y = GameField.SELECTFRAME_BASE_Y - GameField.POS_Y;
          pf.onTouchGetPiece.push(function (idx) {
            Global_1.Global.instance.log("onTouchGetPiece(" + idx + ")");
            _this.selectPieceIndex = idx;
            return true;
          });
          pf.onSlideInFinish.push(function (f, p) {
            if (pf.selectFrameIndex !== f) {
              return;
            }

            Global_1.Global.instance.log("onSlideInFinish(" + f + "," + p + ")");
            _this.selectPieceIndex = p;
          });

          _this.onPieceMatchCheck.push(function (idx, success, remain) {
            var seId = "se_004";
            var tx = _this.touchLayer.children[idx];
            tx.tag = 0;
            tx.opacity = 0;
            tx.modified();

            if (success) {
              seId = "se_003";
              _this.pieceNum--;

              if (0 <= _this.pieceNum) {
                rpv.Num = _this.pieceNum;
              }

              var p = pic.Pieces[idx];

              _this.createCorrectPieceAndAction(_this.baseLayer, p, tx);

              p.hide();
              pf.releaseSelectObject();

              if (0 < remain) {
                // 次のpiece
                pf.get();
              } else {
                if (_this.pieceNum <= 0) {
                  _this.clearCallback.forEach(function (x) {
                    return x();
                  });
                } else {
                  _this.scene.setTimeout(function () {
                    pf.setNextSelectFrame();
                  }, 10);
                }
              }
            }

            AudioPresenter_1.AudioPresenter.instance.playSE(seId);
          });

          rpv.Num = pf.RemainNum;

          _this.baseLayer.append(pf);

          _this.pieceField = pf;

          _this.createFrameTouchField(_this.touchLayer, lvinfo.divX, lvinfo.divY);

          _this.touchLayer.x = pic.x;
          _this.touchLayer.y = pic.y;

          _this.touchLayer.modified();

          _this.baseLayer.append(_this.touchLayer);

          _this.baseLayer.x = GameField.POS_X;
          _this.baseLayer.y = GameField.POS_Y;

          _this.baseLayer.modified();

          if (0 < delay) {
            s.setTimeout(function () {
              if (_this.destroyed()) {
                return;
              }

              if (pic.destroyed()) {
                return;
              }

              var pi = pic.Image;
              pi.update.add(function () {
                pi.opacity = Util_1.Util.lerp(pi.opacity, 0, 0.3, 0.08);
              });
            }, delay);
          }

          return _this;
        }

        GameField.prototype.dispose = function () {
          this.destroy();
        };

        GameField.prototype.gameStart = function () {
          this.pieceField.get();
        };

        GameField.prototype.createFieldImage = function (e) {
          var base = SpriteFactory_1.SpriteFactory.createPictureFrame(this.scene);
          e.append(base);
        };

        GameField.prototype.createFrameTouchField = function (e, divX, divY) {
          var _this = this;

          var dw = Picture_1.Picture.IMAGE_PIX / divX | 0;
          var dh = Picture_1.Picture.IMAGE_PIX / divY | 0;

          for (var dy = 0; dy < divY; ++dy) {
            var _loop_1 = function _loop_1(dx) {
              var idx = dx + dy * divX;
              var panel = new g.FilledRect({
                scene: this_1.scene,
                x: dx * dw,
                y: dy * dh,
                width: dw,
                height: dh,
                cssColor: "#c0c000",
                opacity: 0,
                touchable: true
              });
              panel.tag = 0;
              panel.update.add(function () {
                panel.opacity = Util_1.Util.lerp(panel.opacity, panel.tag, 0.4);
                panel.modified();
              });
              panel.pointDown.add(function () {
                panel.tag = 0.5;
              });
              panel.pointUp.add(function () {
                if (_this.selectPieceIndex !== idx) {
                  panel.tag = 0;
                  panel.opacity = 0;
                  panel.modified();
                }

                var disable = _this.OnTouchCallback(idx);

                if (disable) {
                  panel.touchable = false;
                }
              });
              e.append(panel);
            };

            var this_1 = this;

            for (var dx = 0; dx < divX; ++dx) {
              _loop_1(dx);
            }
          }
        };

        GameField.prototype.OnTouchCallback = function (idx) {
          var _this = this;

          Global_1.Global.instance.log("fieldTouch: " + idx + " / " + this.selectPieceIndex);

          if (this.selectPieceIndex < 0) {
            return;
          }

          var remainNum = this.pieceField.RemainNum;
          this.onPieceMatchCheck.forEach(function (x) {
            x(idx, idx === _this.selectPieceIndex, remainNum);
          });
          return idx === this.selectPieceIndex;
        };

        GameField.prototype.createCorrectPieceAndAction = function (e, p, t) {
          var move = 0.4;
          var th = 0.03;
          var tp = {
            x: t.x,
            y: t.y
          };
          var nss = g.Util.createSpriteFromE(this.scene, p);
          var ns = new g.E({
            scene: this.scene
          });
          var wp = Util_1.Util.getWorldPos(p);
          nss.x = p.children[0].x;
          nss.y = p.children[0].y;
          nss.modified();
          ns.append(nss);
          ns.x = wp.x;
          ns.y = wp.y;
          ns.modified();
          e.append(ns);

          if (t.parent !== undefined) {
            if (t.parent !== null) {
              var te = t.parent;

              if (te instanceof g.E) {
                tp.x += te.x;
                tp.y += te.y;
              }
            }
          }

          ns.update.add(function () {
            // 目的地へ移動する
            ns.x = Util_1.Util.lerp(ns.x, tp.x, move, th);
            ns.y = Util_1.Util.lerp(ns.y, tp.y, move, th);
            ns.modified();
          });
          ns.show();
        };

        GameField.POS_X = 69;
        GameField.POS_Y = 51;
        GameField.PIC_OFFSET_X = 15;
        GameField.PIC_OFFSET_Y = 15;
        GameField.SELECTFRAME_BASE_X = 385;
        GameField.SELECTFRAME_BASE_Y = 118;
        GameField.COMBO_BASE_X = 201; // 191;

        GameField.COMBO_BASE_Y = 3; // 7;

        return GameField;
      }(g.E);

      exports.GameField = GameField;
    }, {
      "./AudioPresenter": 7,
      "./Global": 14,
      "./Picture": 18,
      "./PieceSelectField": 19,
      "./RemainPieceView": 22,
      "./SpriteFactory": 24,
      "./Util": 27
    }],
    12: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var GameFont =
      /** @class */
      function () {
        function GameFont() {
          this.fontSize = 34;
          this.font = null;
          this.boldFont = null;
        }

        GameFont.prototype.initialize = function (_s) {
          var _f = this.createFont(this.fontSize);

          this.font = _f;

          var _bf = this.createFont(this.fontSize, true);

          this.boldFont = _bf;
          this._s = _s;
        };

        GameFont.prototype.generateLabel = function (col, isBold) {
          if (isBold === void 0) {
            isBold = false;
          }

          return this.generateLabelWithSize(this.font.size, col, isBold);
        };

        GameFont.prototype.generateLabelWithSize = function (size, col, isBold) {
          if (isBold === void 0) {
            isBold = false;
          }

          var useFont = isBold ? this.boldFont : this.font;
          return new g.Label({
            scene: this._s,
            font: useFont,
            text: "",
            fontSize: size,
            textColor: col,
            touchable: true,
            x: this.font.size / 2,
            y: -(this.font.size / 2)
          });
        };

        GameFont.prototype.createFont = function (_size, isBold) {
          if (isBold === void 0) {
            isBold = false;
          }

          var weight = isBold ? g.FontWeight.Bold : g.FontWeight.Normal;
          return new g.DynamicFont({
            game: g.game,
            fontFamily: g.FontFamily.SansSerif,
            size: _size,
            fontWeight: weight
          });
        };

        GameFont.instance = new GameFont();
        return GameFont;
      }();

      exports.GameFont = GameFont;
    }, {}],
    13: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var NumberValue_1 = require("./NumberValue");

      var GameTimer =
      /** @class */
      function () {
        function GameTimer(_s) {
          this.finishCallback = [];
          this.pause = false;
          var ci = SpriteFactory_1.SpriteFactory.createClockIcon(_s);
          var nv = NumberValue_1.NumberFont.instance;
          var ti = nv.genelateLabel28(_s);
          var r = new g.E({
            scene: _s,
            x: 0,
            y: 0
          });
          r.append(ci);
          ti.x = ci.width;
          ti.y = 4;
          ti.modified();
          r.append(ti);
          r.hide();

          _s.append(r);

          this.clockIcon = ci;
          this.timer = ti;
          this.rootEntity = r;
          this._s = _s;
        }

        Object.defineProperty(GameTimer.prototype, "Pause", {
          get: function get() {
            return this.pause;
          },
          set: function set(v) {
            this.pause = v;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GameTimer.prototype, "tv", {
          set: function set(value) {
            var v = value;

            if (GameTimer.DISPLAY_MAX < v) {
              v = GameTimer.DISPLAY_MAX;
            }

            this.timer.text = (v | 0).toString();
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GameTimer.prototype, "now", {
          get: function get() {
            return this.timerValue | 0;
          },
          enumerable: true,
          configurable: true
        });

        GameTimer.prototype.destroy = function () {
          if (!this.clockIcon.destroyed()) {
            this.clockIcon.destroy();
          }
        };

        GameTimer.prototype.show = function (px, py, startSecond) {
          this.clockIcon.show();
          this.tv = startSecond;
          this.timer.invalidate();
          this.rootEntity.x = px;
          this.rootEntity.y = py;
          this.rootEntity.modified();
          this.rootEntity.show();
          this.timerValue = startSecond;
        };

        GameTimer.prototype.start = function () {
          var _this = this;

          var _s = this._s;

          if (this.timerEventIdentifier != null) {
            _s.clearInterval(this.timerEventIdentifier);
          }

          var ev = _s.setInterval(function () {
            if (_this.pause) {
              return;
            }

            _this.timerValue--;

            if (0 <= _this.timerValue) {
              _this.tv = _this.timerValue;
            }

            _this.timer.invalidate();

            if (_this.timerValue < 0) {
              if (_this.timerEventIdentifier != null) {
                _s.clearInterval(_this.timerEventIdentifier);
              }

              _this.finishCallback.forEach(function (e) {
                return e();
              });
            }
          }, 1000, this);

          this.timerEventIdentifier = ev;
          return this;
        };

        GameTimer.DISPLAY_MAX = 99;
        return GameTimer;
      }();

      exports.GameTimer = GameTimer;
    }, {
      "./NumberValue": 16,
      "./SpriteFactory": 24
    }],
    14: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Global =
      /** @class */
      function () {
        function Global() {
          this.score = 0;
          this.totalTimeLimit = 82;
          this.muteSound = false;
          this.difficulty = 1;
          this.random = g.game.random;
          this.DEBUG = false;
        }

        Global.init = function () {
          Global.instance = new Global();
        };

        Global.prototype.log = function (l) {
          if (this.DEBUG) {
            console.log(l);
          }
        };

        return Global;
      }();

      exports.Global = Global;
    }, {}],
    15: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var AStage_1 = require("./AStage");

      var ManualScene =
      /** @class */
      function (_super) {
        __extends(ManualScene, _super);

        function ManualScene(scene) {
          var _this = _super.call(this) || this;

          _this.scene = scene;
          return _this;
        }

        ManualScene.prototype.activate = function (_s) {
          var _this = this;

          var s = SpriteFactory_1.SpriteFactory.createManual(_s);
          s.x = (_s.game.width - s.width) / 2;
          s.y = (_s.game.height - s.height) / 2;
          s.modified();

          _s.setTimeout(function () {
            _this.finishStage();
          }, 5000, this);

          this.title = s;

          _s.append(s);

          this.scene = _s;
        };

        ManualScene.prototype.dispose = function () {
          if (this.title.destroyed()) {
            return;
          }

          this.title.destroy();
        };

        return ManualScene;
      }(AStage_1.AStage);

      exports.ManualScene = ManualScene;
    }, {
      "./AStage": 6,
      "./SpriteFactory": 24
    }],
    16: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Util_1 = require("./Util");

      var NumberType;

      (function (NumberType) {
        NumberType[NumberType["W28"] = 0] = "W28";
        NumberType[NumberType["W72"] = 1] = "W72";
        NumberType[NumberType["Y28"] = 2] = "Y28";
        NumberType[NumberType["R28"] = 3] = "R28";
      })(NumberType = exports.NumberType || (exports.NumberType = {}));

      var FontInfo =
      /** @class */
      function () {
        function FontInfo() {
          this.glyphWidth = 0;
          this.glyphHeight = 0;
          this.map = "";
        }

        return FontInfo;
      }();

      var NumberFontData =
      /** @class */
      function () {
        function NumberFontData(f, l) {
          this.label = null;
          this.font = null;
          this.label = l;
          this.font = f;
        }

        NumberFontData.prototype.destroy = function () {
          if (!this.label.destroyed()) {
            this.label.destroy();
          }

          if (!this.font.destroyed()) {
            this.font.destroy();
          }
        };

        return NumberFontData;
      }();

      exports.NumberFontData = NumberFontData;

      var NumberFont =
      /** @class */
      function () {
        function NumberFont() {}

        NumberFont.generate = function (s, type) {
          var fi = NumberFont.fontInfo[type];
          var f = new g.BitmapFont({
            src: s.assets[NumberFont.IMAGE_NAME],
            map: Util_1.Util.readJSON(s, fi.map),
            defaultGlyphWidth: fi.glyphWidth,
            defaultGlyphHeight: fi.glyphHeight
          });
          var l = new g.Label({
            scene: s,
            font: f,
            text: "",
            fontSize: fi.glyphWidth
          });
          return new NumberFontData(f, l);
        };

        Object.defineProperty(NumberFont, "instance", {
          get: function get() {
            if (NumberFont._instance == null) {
              NumberFont._instance = new NumberFont();
            }

            return NumberFont._instance;
          },
          enumerable: true,
          configurable: true
        });

        NumberFont.prototype.initialize = function (_s) {
          this.font28 = new g.BitmapFont({
            src: _s.assets[NumberFont.IMAGE_NAME],
            map: Util_1.Util.readJSON(_s, "glyph28"),
            defaultGlyphWidth: 28,
            defaultGlyphHeight: 32
          });
          this.font72 = new g.BitmapFont({
            src: _s.assets[NumberFont.IMAGE_NAME],
            map: Util_1.Util.readJSON(_s, "glyph72"),
            defaultGlyphWidth: 72,
            defaultGlyphHeight: 82
          });
        };

        NumberFont.prototype.genelateLabel28 = function (_s) {
          return new g.Label({
            scene: _s,
            font: this.font28,
            text: "",
            fontSize: 28
          });
        };

        NumberFont.prototype.genelateLabel72 = function (_s) {
          return new g.Label({
            scene: _s,
            font: this.font72,
            text: "",
            fontSize: 72
          });
        };

        NumberFont.prototype.destroy = function () {
          if (!this.font28.destroyed()) {
            this.font28.destroy();
          }

          if (!this.font72.destroyed()) {
            this.font72.destroy();
          }
        };

        NumberFont.IMAGE_NAME = "ui_common";
        NumberFont._instance = null;
        NumberFont.fontInfo = [// w28
        {
          glyphWidth: 28,
          glyphHeight: 32,
          map: "glyph28"
        }, {
          glyphWidth: 72,
          glyphHeight: 82,
          map: "glyph72"
        }, {
          glyphWidth: 32,
          glyphHeight: 36,
          map: "glyph32_yellow"
        }];
        return NumberFont;
      }();

      exports.NumberFont = NumberFont;
    }, {
      "./Util": 27
    }],
    17: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Global_1 = require("./Global");

      var OuterParamReceiver =
      /** @class */
      function () {
        function OuterParamReceiver() {}

        OuterParamReceiver.receiveParamFromMessage = function (s) {
          s.message.add(function (msg) {
            if (msg.data && msg.data.type === "start") {
              if (msg.data.parameters) {
                if (msg.data.parameters.totalTimeLimit) {
                  Global_1.Global.instance.totalTimeLimit = msg.data.parameters.totalTimeLimit;
                }

                if (msg.data.parameters.difficulty) {
                  Global_1.Global.instance.difficulty = msg.data.parameters.difficulty;
                }

                if (msg.data.parameters.randomSeed) {
                  Global_1.Global.instance.random = new g.XorshiftRandomGenerator(msg.data.parameters.randomSeed);
                }
              }
            }
          });
        };

        OuterParamReceiver.paramSetting = function () {
          g.game.vars.gameState = {
            score: 0,
            playThreshold: 1,
            clearThreshold: 0
          };
        };

        OuterParamReceiver.setGlobalScore = function (score) {
          if (g.game.vars.gameState) {
            if (g.game.vars.gameState.score !== undefined) {
              g.game.vars.gameState.score = score;
            }
          }
        };

        OuterParamReceiver.setClearThreashold = function (v) {
          if (g.game.vars.gameState) {
            if (g.game.vars.gameState.clearThreshold !== undefined) {
              g.game.vars.gameState.clearThreshold = v;
            }
          }
        };

        return OuterParamReceiver;
      }();

      exports.OuterParamReceiver = OuterParamReceiver;
    }, {
      "./Global": 14
    }],
    18: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var PieceSelectField_1 = require("./PieceSelectField");

      var Global_1 = require("./Global");

      var Util_1 = require("./Util");

      var MaskDir;

      (function (MaskDir) {
        MaskDir[MaskDir["NONE"] = 0] = "NONE";
        MaskDir[MaskDir["UP"] = 1] = "UP";
        MaskDir[MaskDir["RIGHT"] = 2] = "RIGHT";
        MaskDir[MaskDir["DOWN"] = 4] = "DOWN";
        MaskDir[MaskDir["LEFT"] = 8] = "LEFT";
      })(MaskDir = exports.MaskDir || (exports.MaskDir = {}));

      var Picture =
      /** @class */
      function (_super) {
        __extends(Picture, _super);

        function Picture(s, imageId, divX, divY) {
          var _this = _super.call(this, {
            scene: s
          }) || this;

          _this.image = null;
          _this.parts = [];
          _this.linesEntity = null;

          var imgs = _this.createImage(Picture.IMAGE_NAME, imageId, divX, divY);

          _this.image = imgs.image;
          _this.parts = imgs.div;
          _this.linesEntity = new g.E({
            scene: s
          });
          imgs.lines.forEach(function (l) {
            return _this.linesEntity.append(l);
          });

          _this.append(_this.linesEntity);

          _this.append(_this.image);

          return _this;
        }

        Object.defineProperty(Picture.prototype, "Pieces", {
          get: function get() {
            return this.parts;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Picture.prototype, "Image", {
          get: function get() {
            return this.image;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Picture.prototype, "getLines", {
          get: function get() {
            return this.linesEntity;
          },
          enumerable: true,
          configurable: true
        });

        Picture.prototype.createImage = function (imageName, imageId, divX, divY) {
          var _this = this;

          var s = this.scene;
          var sx = 1 + imageId % 3 * Picture.IMAGE_PIX;
          var sy = 1 + (imageId / 3 | 0) * Picture.IMAGE_PIX;
          Global_1.Global.instance.log("createImage(" + sx + "," + sy + ")");
          var img = new g.Sprite({
            scene: s,
            src: s.assets[imageName],
            srcX: sx,
            srcY: sy,
            width: Picture.IMAGE_PIX,
            height: Picture.IMAGE_PIX,
            srcWidth: Picture.IMAGE_PIX,
            srcHeight: Picture.IMAGE_PIX
          });
          var dw = img.width / divX | 0;
          var dh = img.height / divY | 0;
          var psize = PieceSelectField_1.PieceSize.L;

          switch (divX) {
            case 3:
              psize = PieceSelectField_1.PieceSize.M;
              break;

            case 4:
              psize = PieceSelectField_1.PieceSize.S;
              break;
          } // 全部作って


          var dtbl = [];

          for (var y = 0; y < divY; ++y) {
            for (var x = 0; x < divX; ++x) {
              dtbl.push(this.getConvexAndDepressData(x, y, {
                width: divX,
                height: divY
              }));
            }
          }

          var ctbl = Util_1.Util.repeat(0, dtbl.length);
          Util_1.Util.shuffle(Util_1.Util.range(0, dtbl.length)).forEach(function (idx) {
            var neigbars = _this.getPiecesNeighborsIndex(idx, divX, divY);

            var depress = dtbl[idx];
            var convex = 0;
            neigbars.forEach(function (v, i) {
              var dir = [MaskDir.UP, MaskDir.RIGHT, MaskDir.DOWN, MaskDir.LEFT];
              var rev = [MaskDir.DOWN, MaskDir.LEFT, MaskDir.UP, MaskDir.RIGHT];

              if (v === -1) {
                return;
              }

              if ((dtbl[v] & rev[i]) === 0) {
                return;
              }

              depress &= ~dir[i];
              convex |= dir[i];
            });
            dtbl[idx] = depress;
            ctbl[idx] = convex;
          }); // 誤差を取る

          var divImages = [];

          for (var y = 0; y < divY; ++y) {
            for (var x = 0; x < divX; ++x) {
              var idx = x + y * divX;
              var dspr = null;
              var finfo = {
                x: sx + x * dw,
                y: sy + y * dh,
                width: dw,
                height: dh
              };
              dspr = this.createDepressPiece(imageName, finfo, psize, dtbl[idx]);
              dspr = this.createConvexPiece(imageName, finfo, dspr, psize, ctbl[idx]);
              divImages.push(dspr);
            }
          } // convexを元に下地を作る


          var lines = [];

          var _loop_1 = function _loop_1(i, max) {
            var px = i % divX;
            var py = i / divX | 0;
            var convex = ctbl[i];
            var sprT = this_1.getConvexLineTbl(psize);
            [MaskDir.UP, MaskDir.RIGHT, MaskDir.DOWN, MaskDir.LEFT].forEach(function (x, idx) {
              if ((convex & x) === 0) {
                return;
              }

              var offsetX = 0;
              var offsetY = 0;
              var lspr = sprT[idx];

              if (x === MaskDir.RIGHT) {
                offsetX = dw - lspr.width / 2 | 0;
              } else if (x === MaskDir.LEFT) {
                offsetX = -(lspr.width / 2 | 0);
              }

              if (x === MaskDir.UP) {
                offsetY = -(lspr.height / 2 | 0);
              } else if (x === MaskDir.DOWN) {
                offsetY = dh - (lspr.height / 2 | 0);
              }

              lspr.x = px * dw + offsetX;
              lspr.y = py * dh + offsetY;
              lspr.modified();
              lines.push(lspr);
            });
          };

          var this_1 = this;

          for (var i = 0, max = ctbl.length; i < max; ++i) {
            _loop_1(i, max);
          }

          return {
            image: img,
            div: divImages,
            lines: lines
          };
        };

        Picture.prototype.getPiecesNeighborsIndex = function (pidx, w, h) {
          var upPiece = -1;
          var rightPiece = -1;
          var downPiece = -1;
          var leftPiece = -1;
          var x = pidx % w;
          var y = pidx / w | 0;
          var idx = x + y * w;
          var right = x + 1 < w;
          var left = 0 <= x - 1;
          var up = 0 <= y - 1;
          var down = y + 1 < h;

          if (right) {
            rightPiece = idx + 1;
          }

          if (left) {
            leftPiece = idx - 1;
          }

          if (up) {
            upPiece = idx - w;
          }

          if (down) {
            downPiece = idx + w;
          }

          return [upPiece, rightPiece, downPiece, leftPiece];
        };

        Picture.prototype.createConvexPiece = function (assetName, info, piece, pieceSize, convex) {
          if (convex === void 0) {
            convex = 0;
          }

          var s = this.scene; // convex == 1248 => 上右下左

          var maskP = this.getMaskPieceTbl(pieceSize);
          var earTbl = [{
            x: info.x,
            y: info.y - maskP[0].height,
            width: info.width,
            height: maskP[0].height
          }, {
            x: info.x + info.width,
            y: info.y,
            width: maskP[0].width,
            height: info.height
          }, {
            x: info.x,
            y: info.y + info.height,
            width: info.width,
            height: maskP[0].height
          }, {
            x: info.x - maskP[0].width,
            y: info.y,
            width: maskP[0].width,
            height: info.height
          }];
          var earPTbl = [{
            x: (info.width - maskP[0].width) / 2 | 0,
            y: 0
          }, {
            x: 0,
            y: (info.height - maskP[0].height) / 2 | 0
          }, {
            x: (info.width - maskP[0].width) / 2 | 0,
            y: 0
          }, {
            x: 0,
            y: (info.height - maskP[0].height) / 2 | 0
          }];
          var rootE = new g.E({
            scene: this.scene
          }); // piece元作成

          rootE.append(piece);
          [MaskDir.UP, MaskDir.RIGHT, MaskDir.DOWN, MaskDir.LEFT].forEach(function (x, i) {
            if ((convex & x) === 0) {
              return;
            }

            var et = earTbl[i]; // 抜き用ノリシロ作成

            var ear = new g.Sprite({
              scene: s,
              src: s.assets[assetName],
              srcX: et.x,
              srcY: et.y,
              srcWidth: et.width,
              srcHeight: et.height,
              width: et.width,
              height: et.height
            });
            var mergeE = new g.E({
              scene: s
            });
            maskP[i].x = earPTbl[i].x;
            maskP[i].y = earPTbl[i].y;
            maskP[i].modified(); // maskPとノリシロをmerge

            ear.compositeOperation = g.CompositeOperation.SourceAtop;
            ear.modified();
            mergeE.append(maskP[i]);
            mergeE.append(ear); // createspritefromeでnewノリシロ作成

            var newEar = g.Util.createSpriteFromE(s, mergeE); // createspritefromeでpiece + ノリシロ作成

            newEar.x = et.x - info.x;
            newEar.y = et.y - info.y;
            newEar.modified();
            rootE.append(newEar);
          });
          var pieceSprite = g.Util.createSpriteFromE(s, rootE);
          var se = new g.E({
            scene: s
          });
          var pw = 0;
          var ph = 0;

          if ((convex & MaskDir.UP) !== 0) {
            se.y += maskP[0].height;
            ph += maskP[0].height;
          }

          if ((convex & MaskDir.DOWN) !== 0) {
            ph += maskP[0].height;
          }

          if ((convex & MaskDir.LEFT) !== 0) {
            se.x += maskP[0].width;
            pw += maskP[0].width;
          }

          if ((convex & MaskDir.RIGHT) !== 0) {
            pw += maskP[0].width;
          }

          pieceSprite.modified();
          rootE.destroy();
          se.append(pieceSprite);
          se.width = piece.width + pw;
          se.height = piece.height + ph;
          se.modified();
          return se;
        };

        Picture.prototype.createDepressPiece = function (assetName, info, psize, depress) {
          if (depress === void 0) {
            depress = 0;
          }

          var s = this.scene;
          var maskP = this.getMaskPieceTbl(psize);
          var holeTbl = [{
            x: (info.width - maskP[0].width) / 2 | 0,
            y: 0
          }, {
            x: info.width - maskP[0].width,
            y: (info.height - maskP[0].height) / 2 | 0
          }, {
            x: (info.width - maskP[0].width) / 2 | 0,
            y: info.height - maskP[0].height
          }, {
            x: 0,
            y: (info.height - maskP[0].height) / 2 | 0
          }]; // piece元作成

          var piece = new g.Sprite({
            scene: s,
            src: s.assets[assetName],
            srcX: info.x,
            srcY: info.y,
            width: info.width,
            height: info.height,
            srcWidth: info.width,
            srcHeight: info.height
          });
          [MaskDir.UP, MaskDir.RIGHT, MaskDir.DOWN, MaskDir.LEFT].forEach(function (x, i) {
            var maskpi = (i + 2) % 4;

            if ((depress & x) === 0) {
              return;
            }

            var mergeE = new g.E({
              scene: s
            });
            var mp = maskP[maskpi]; // g.Util.createSpriteFromE(s, mpe);

            mp.x = holeTbl[i].x;
            mp.y = holeTbl[i].y;
            mp.modified();
            mp.compositeOperation = g.CompositeOperation.Xor;
            mp.modified();
            mergeE.append(piece);
            mergeE.append(mp);
            mergeE.width = piece.width;
            mergeE.height = piece.height;
            mergeE.modified();
            piece = g.Util.createSpriteFromE(s, mergeE);
          });
          var se = new g.E({
            scene: s
          });
          se.append(piece);
          se.width = piece.width;
          se.height = piece.height;
          se.modified();
          return se;
        };

        Picture.prototype.getMaskPieceTbl = function (size) {
          var tbl = [];

          switch (size) {
            case PieceSelectField_1.PieceSize.L:
              tbl = SpriteFactory_1.SpriteFactory.createMaskL(this.scene);
              break;

            case PieceSelectField_1.PieceSize.M:
              tbl = SpriteFactory_1.SpriteFactory.createMaskM(this.scene);
              break;

            case PieceSelectField_1.PieceSize.S:
              tbl = SpriteFactory_1.SpriteFactory.createMaskS(this.scene);
              break;

            default:
              throw new Error("unknown size: " + size);
          }

          return tbl;
        };

        Picture.prototype.getConvexLineTbl = function (size) {
          var tbl = [];

          switch (size) {
            case PieceSelectField_1.PieceSize.L:
              tbl = SpriteFactory_1.SpriteFactory.createGuideL(this.scene);
              break;

            case PieceSelectField_1.PieceSize.M:
              tbl = SpriteFactory_1.SpriteFactory.createGuideM(this.scene);
              break;

            case PieceSelectField_1.PieceSize.S:
              tbl = SpriteFactory_1.SpriteFactory.createGuideS(this.scene);
              break;

            default:
              throw new Error("unknown size: " + size);
          }

          return tbl;
        };

        Picture.prototype.getConvexAndDepressData = function (px, py, field) {
          var maskDirT = [MaskDir.UP, MaskDir.RIGHT, MaskDir.DOWN, MaskDir.LEFT];

          if (px < 1) {
            // 左には付かない
            maskDirT = maskDirT.filter(function (n) {
              return n !== MaskDir.LEFT;
            });
          }

          if (field.width - 1 <= px) {
            // 右には付かない
            maskDirT = maskDirT.filter(function (n) {
              return n !== MaskDir.RIGHT;
            });
          }

          if (py < 1) {
            // 上には付かない
            maskDirT = maskDirT.filter(function (n) {
              return n !== MaskDir.UP;
            });
          }

          if (field.height - 1 <= py) {
            // 下には付かない
            maskDirT = maskDirT.filter(function (n) {
              return n !== MaskDir.DOWN;
            });
          }

          var data = 0;
          maskDirT.forEach(function (x) {
            return data |= x;
          });
          return data;
        };

        Picture.IMAGE_PIX = 253;
        Picture.IMAGE_NAME = "ui_2";
        return Picture;
      }(g.E);

      exports.Picture = Picture;
    }, {
      "./Global": 14,
      "./PieceSelectField": 19,
      "./SpriteFactory": 24,
      "./Util": 27
    }],
    19: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

      var Easing_1 = require("@akashic-extension/akashic-timeline/lib/Easing");

      var SpriteFactory_1 = require("./SpriteFactory");

      var Global_1 = require("./Global");

      var Util_1 = require("./Util");

      var PieceSize;

      (function (PieceSize) {
        PieceSize[PieceSize["L"] = 0] = "L";
        PieceSize[PieceSize["M"] = 1] = "M";
        PieceSize[PieceSize["S"] = 2] = "S";
      })(PieceSize = exports.PieceSize || (exports.PieceSize = {}));

      var PieceSelectField =
      /** @class */
      function (_super) {
        __extends(PieceSelectField, _super);

        function PieceSelectField(s, pieceSize, pieces) {
          var _this = _super.call(this, {
            scene: s
          }) || this;

          _this.selectFrameIndex = -1;
          _this.onSlideInFinish = [];
          _this.onTouchGetPiece = [];
          _this.indexTable = [];
          _this.pieceTable = [];
          _this.pieceLayer = null;
          _this.touchLayer = null;
          _this.frameL = null;
          _this.frameM = null;
          _this.frameS = [];
          _this.selectFrame = [];
          _this.pieceEntryIndex = [];
          _this.currentShowIndex = -1;
          _this.lastSelect = [];
          _this.requestCount = 0; // 出す順番

          _this.indexTable = Util_1.Util.shuffle(Util_1.Util.range(0, pieces.length));
          _this.pieceTable = pieces;
          _this.pieceLayer = new g.E({
            scene: s
          });

          _this.append(_this.pieceLayer);

          var tpTbl = PieceSelectField.touchPosTbl[pieceSize];
          _this.touchLayer = new g.E({
            scene: s
          });
          tpTbl.forEach(function (x) {
            var lfl = _this.createSelectFrame(pieceSize);

            lfl.x = x.x;
            lfl.y = x.y;
            lfl.modified();

            _this.selectFrame.push(lfl);

            _this.touchLayer.append(lfl);

            _this.pieceEntryIndex.push(-1);
          });

          var tf = _this.initTouchLayers(_this.touchLayer, _this.selectFrame[0], tpTbl);

          var tf2sf = [];

          for (var i = 0; i < tf.length; ++i) {
            tf2sf[tf[i].id] = i;
          }

          _this.append(_this.touchLayer);

          tf.forEach(function (_tf, tfidx) {
            _tf.pointDown.add(function () {
              _this.selectFrame.forEach(function (x, idx) {
                x.opacity = tf2sf[_tf.id] === idx ? 1 : 0;
                x.modified();
              });
            });

            _tf.pointUp.add(function () {
              var touchDisableRequest = false;
              var pieceIdx = _this.pieceEntryIndex[tfidx];
              Global_1.Global.instance.log("selectFrameIndex: " + _this.selectFrameIndex + " => " + tfidx);
              _this.selectFrameIndex = tfidx;

              _this.pushSelect(tfidx, pieceIdx);

              _this.onTouchGetPiece.forEach(function (x) {
                return touchDisableRequest = x(pieceIdx) || touchDisableRequest;
              });

              _this.touchLayer.children.forEach(function (e, i) {
                return e.touchable = tfidx !== i;
              });
            });
          });

          _this.onSlideInFinish.push(function (gi, idx) {
            _this.currentShowIndex = idx;
            tf.forEach(function (_tf) {
              return _tf.touchable = true;
            });
          });

          var updateCnt = 0;

          _this.update.add(function () {
            updateCnt++;
          });

          return _this;
        }

        Object.defineProperty(PieceSelectField.prototype, "RemainNum", {
          get: function get() {
            return this.indexTable.length;
          },
          enumerable: true,
          configurable: true
        });

        PieceSelectField.prototype.get = function (num) {
          var _this = this;

          if (num === void 0) {
            num = 1;
          }

          var tl = new akashic_timeline_1.Timeline(this.scene);
          var layer = new g.E({
            scene: this.scene
          });
          var index = this.indexTable.pop();
          var np = this.pieceTable[index];
          var getIndexTbl = [];
          this.pieceEntryIndex.forEach(function (v, i) {
            if (v === -1) {
              getIndexTbl.push(i);
            }
          });
          var getIndex = getIndexTbl.pop();
          var frame = this.selectFrame[getIndex];
          var px = frame.x + (frame.width - np.width) / 2;
          var py = frame.y + (frame.height - np.height) / 2;
          this.pieceLayer.append(layer);
          layer.append(np);
          layer.x = px;
          layer.y = g.game.height + np.height;
          layer.modified();
          this.pieceEntryIndex[getIndex] = index;
          var time = PieceSelectField.SLIDEIN_ANIM_WAIT;
          tl.create(layer, {
            modified: layer.modified,
            destroyed: layer.destroyed
          }).moveTo(px, py, time, Easing_1.easeOutQuart).con().every(function (e, p) {
            if (p < 1) {
              return;
            }

            _this.onSlideInFinish.forEach(function (x) {
              return x(getIndex, index);
            });

            tl.destroy();
          }, time);
          this.requestCount++;

          if (0 < getIndexTbl.length) {
            this.get();
          }
        };

        PieceSelectField.prototype.setNextSelectFrame = function () {
          var _this = this;

          this.selectFrame.forEach(function (x) {
            x.opacity = 0;
            x.modified();
          });
          this.pieceEntryIndex.some(function (x, idx) {
            var sf = _this.selectFrame[idx];

            if (x < 0) {
              return false;
            }

            sf.opacity = 1;
            sf.modified();
            Global_1.Global.instance.log("setNextSelectFrame(" + x + ")");

            _this.onTouchGetPiece.forEach(function (sx) {
              return sx(x);
            });

            _this.currentShowIndex = idx;
            _this.selectFrameIndex = idx;
            return true;
          });
        };

        PieceSelectField.prototype.releaseSelectObject = function () {
          Global_1.Global.instance.log("releaseSelectObject(" + this.selectFrameIndex + ")");
          this.pieceEntryIndex[this.selectFrameIndex] = -1;
        };

        PieceSelectField.prototype.pushSelect = function (frameIdx, pieceIdx) {
          this.lastSelect.push({
            frameIdx: frameIdx,
            pieceIdx: pieceIdx
          });
        };

        PieceSelectField.prototype.popSelect = function () {
          return this.lastSelect.pop();
        };

        PieceSelectField.prototype.clearSelect = function () {
          this.lastSelect = [];
        };

        PieceSelectField.prototype.createSelectFrame = function (size) {
          var p = null;

          switch (size) {
            case PieceSize.L:
              p = SpriteFactory_1.SpriteFactory.createSelectFrameL(this.scene);
              break;

            case PieceSize.M:
              p = SpriteFactory_1.SpriteFactory.createSelectFrameM(this.scene);
              break;

            case PieceSize.S:
              p = SpriteFactory_1.SpriteFactory.createSelectFrameS(this.scene);
          }

          p.opacity = 0;
          p.modified();
          return p;
        };

        PieceSelectField.prototype.selectFrameInit = function (r, f) {
          f.x = -(f.width / 2);
          f.y = -(f.height / 2);
          f.modified();
          f.hide();
          r.append(f);
          r.width = f.width;
          r.height = f.height;
          r.modified();
          r.touchable = true;
          this.append(r);
        };

        PieceSelectField.prototype.initTouchLayers = function (r, f, pos) {
          var _this = this;

          var touchFields = [];
          pos.forEach(function (p) {
            var tf = new g.FilledRect({
              scene: _this.scene,
              width: f.width,
              height: f.height,
              cssColor: "#ff0000",
              opacity: Global_1.Global.instance.DEBUG ? 0 : 0,
              x: p.x,
              y: p.y
            });
            r.append(tf);
            touchFields.push(tf);
          });
          return touchFields;
        };

        PieceSelectField.SLIDEIN_ANIM_WAIT = 200;
        PieceSelectField.touchPosTbl = [[{
          x: 0,
          y: 0
        }], [{
          x: -24,
          y: 50
        }, {
          x: 90,
          y: -6
        }], [{
          x: 107,
          y: -10
        }, {
          x: 107,
          y: 114
        }, {
          x: -24,
          y: 100
        }, {
          x: -24,
          y: -12
        }]];
        return PieceSelectField;
      }(g.E);

      exports.PieceSelectField = PieceSelectField;
    }, {
      "./Global": 14,
      "./SpriteFactory": 24,
      "./Util": 27,
      "@akashic-extension/akashic-timeline": 5,
      "@akashic-extension/akashic-timeline/lib/Easing": 2
    }],
    20: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Queue =
      /** @class */
      function () {
        function Queue() {
          this.data = [];
          this.data = [];
        }

        Object.defineProperty(Queue.prototype, "IsEmpty", {
          get: function get() {
            return this.data.length < 1;
          },
          enumerable: true,
          configurable: true
        });

        Queue.prototype.push = function (v) {
          this.data.push(v);
        };

        Queue.prototype.peek = function () {
          return this.data[0];
        };

        Queue.prototype.pop = function () {
          var r = this.peek();
          this.data.shift();
          return r;
        };

        return Queue;
      }();

      exports.Queue = Queue;
    }, {}],
    21: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

      var Easing_1 = require("@akashic-extension/akashic-timeline/lib/Easing");

      var AudioPresenter_1 = require("./AudioPresenter");

      var ReadyGo =
      /** @class */
      function () {
        function ReadyGo(scene) {
          this.finishCallback = new Array();
          this.rootEntity = new g.E({
            scene: scene
          });
          this._s = scene;

          var _r = SpriteFactory_1.SpriteFactory.createReady(this._s);

          _r.x = (scene.game.width - _r.width) / 2;
          _r.y = (scene.game.height - _r.height) / 2;

          _r.modified();

          _r.hide();

          var _g = SpriteFactory_1.SpriteFactory.createStart(this._s);

          _g.x = (scene.game.width - _g.width) / 2;
          _g.y = (scene.game.height - _g.height) / 2;

          _g.modified();

          _g.hide();

          this.rootEntity.append(_r);
          this.rootEntity.append(_g);
          this.ready = _r;
          this.go = _g;
        }

        ReadyGo.prototype.show = function () {
          var _this = this;

          AudioPresenter_1.AudioPresenter.instance.playSE("se_005A_mono");
          this.ready.show();
          this.fadeAction(this._s, this.ready, 500, 250, function () {
            _this.go.show();

            _this.fadeAction(_this._s, _this.go, 500, 250, function () {
              _this.finishCallback.forEach(function (x) {
                return x();
              });
            });
          });
          return this;
        };

        ReadyGo.prototype.fadeAction = function (_s, _es, delay, stop, cb) {
          var _this = this;

          var tt = new akashic_timeline_1.Timeline(this._s);

          var _hdelay = delay / 2;

          _es.scale(0);

          _es.modified();

          if (0 < stop) {
            tt.create(_es, {
              modified: _es.modified,
              destroyed: _es.destroyed
            }).scaleTo(1, 1, _hdelay).wait(stop).fadeOut(_hdelay, Easing_1.easeOutQuad).con().scaleTo(1.5, 1.5, _hdelay).every(function (e, p) {
              if (p <= 1) {
                if (cb != null) {
                  cb.bind(_this)();
                }

                if (!tt.destroyed()) {
                  tt.destroy(); // 呼べる？
                }
              }
            }, delay + stop);
          } else {
            tt.create(_es, {
              modified: _es.modified,
              destroyed: _es.destroyed
            }).scaleTo(1, 1, _hdelay).fadeOut(_hdelay, Easing_1.easeOutQuad).con().scaleTo(1.5, 1.5, _hdelay).every(function (e, p) {
              if (p <= 1) {
                if (cb != null) {
                  cb.bind(_this)();
                }

                tt.destroy(); // 呼べる？
              }
            }, delay + stop);
          }
        };

        ReadyGo.prototype.fadeInAction = function (_s, _es, delay, cb) {
          var _this = this;

          var tt = new akashic_timeline_1.Timeline(this._s);
          tt.create(_es, {
            modified: _es.modified,
            destroyed: _es.destroyed
          }).fadeOut(delay, Easing_1.easeOutQuad).every(function (e, p) {
            if (1 <= p) {
              if (cb != null) {
                cb.bind(_this)();
              }
            }
          }, delay);
        };

        ReadyGo.prototype.fadeOutAction = function (_s, _es, delay, cb) {
          var _this = this;

          var tt = new akashic_timeline_1.Timeline(this._s);
          tt.create(_es, {
            modified: _es.modified,
            destroyed: _es.destroyed
          }).fadeOut(delay, Easing_1.easeOutQuad).every(function (e, p) {
            if (p <= 1) {
              if (cb != null) {
                cb.bind(_this)();
              }
            }
          }, delay);
        };

        ReadyGo.prototype.destroy = function () {
          var arr = [this.ready, this.go, this.rootEntity];
          arr.forEach(function (x) {
            if (!x.destroyed()) {
              x.destroy();
            }
          });
        };

        return ReadyGo;
      }();

      exports.ReadyGo = ReadyGo;
    }, {
      "./AudioPresenter": 7,
      "./SpriteFactory": 24,
      "@akashic-extension/akashic-timeline": 5,
      "@akashic-extension/akashic-timeline/lib/Easing": 2
    }],
    22: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var NumberValue_1 = require("./NumberValue");

      var RemainPieceView =
      /** @class */
      function (_super) {
        __extends(RemainPieceView, _super);

        function RemainPieceView(s, num) {
          if (num === void 0) {
            num = 0;
          }

          var _this = _super.call(this, {
            scene: s
          }) || this;

          var frm = SpriteFactory_1.SpriteFactory.createRemainPieceFrame(s);

          _this.append(frm);

          var l = NumberValue_1.NumberFont.instance.genelateLabel28(s);

          _this.append(l);

          _this.label = l;
          _this.Num = num;
          return _this;
        }

        Object.defineProperty(RemainPieceView.prototype, "Num", {
          set: function set(v) {
            var l = this.label;
            l.text = (v | 0).toString();
            l.invalidate();
            l.x = RemainPieceView.LABEL_X - (l.text.length - 1) * l.fontSize;
            l.y = RemainPieceView.LABEL_Y;
            l.modified();
          },
          enumerable: true,
          configurable: true
        });
        RemainPieceView.LABEL_X = 96;
        RemainPieceView.LABEL_Y = 18;
        return RemainPieceView;
      }(g.E);

      exports.RemainPieceView = RemainPieceView;
    }, {
      "./NumberValue": 16,
      "./SpriteFactory": 24
    }],
    23: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var NumberValue_1 = require("./NumberValue");

      var Global_1 = require("./Global");

      var AudioPresenter_1 = require("./AudioPresenter");

      var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

      var AStage_1 = require("./AStage");

      var OuterParamReceiver_1 = require("./OuterParamReceiver");

      var ResultScene =
      /** @class */
      function (_super) {
        __extends(ResultScene, _super);

        function ResultScene(scene) {
          var _this = _super.call(this) || this;

          _this.scoreValue = 12;
          _this.scene = scene;
          return _this;
        }

        Object.defineProperty(ResultScene.prototype, "val", {
          set: function set(v) {
            var _l = this.text;

            if (_l != null) {
              _l.text = v.toString();

              _l.invalidate();

              _l.x = 404 + 72 - _l.width;
              _l.y = 162;

              _l.modified();
            }
          },
          enumerable: true,
          configurable: true
        });

        ResultScene.prototype.activate = function (scene) {
          var _this = this;

          AudioPresenter_1.AudioPresenter.instance.stopBGM();
          var r = new g.E({
            scene: scene,
            width: scene.game.width,
            height: scene.game.height
          });
          OuterParamReceiver_1.OuterParamReceiver.setClearThreashold(1);
          var s = SpriteFactory_1.SpriteFactory.createSCOREFrame(scene);
          s.touchable = true;
          s.x = (scene.game.width - s.width) / 2;
          s.y = (scene.game.height - s.height) / 2;
          s.modified();
          var l = this.createScoreText(scene);
          r.append(s);
          r.append(l);
          l.text = Global_1.Global.instance.score.toString();
          l.invalidate();
          l.x = 404 + 72 - l.width;
          l.y = 162;
          l.modified();
          this.text = l;
          this.val = this.scoreValue = Global_1.Global.instance.score;

          var _tl = new akashic_timeline_1.Timeline(scene);

          _tl.create(l, {
            modified: l.modified,
            destroyed: l.destroyed
          }).every(function (e, p) {
            if (1 <= p) {
              _tl.destroy();

              _this.val = Global_1.Global.instance.score;
              return;
            }

            var _min = Math.pow(10, _this.text.text.length - 1); // **は べき乗との事


            var _max = Math.pow(10, _this.text.text.length) - 1;

            var _v = Global_1.Global.instance.random.get(_min, _max);

            _this.val = _v | 0;
          }, 1500);

          r.pointUp.add(function () {
            _this.finishStage();
          }, this);
          this.frame = s;
          scene.append(r);
          this.scene = scene;
          this.root = r;
          AudioPresenter_1.AudioPresenter.instance.playJINGLE("jin_000");
        };

        ResultScene.prototype.dispose = function () {
          if (this.frame.destroyed()) {
            return;
          }

          this.frame.destroy();
          this.root.destroy();
        };

        ResultScene.prototype.createScoreText = function (_s) {
          var nv = NumberValue_1.NumberFont.instance;
          return nv.genelateLabel72(_s);
        };

        return ResultScene;
      }(AStage_1.AStage);

      exports.ResultScene = ResultScene;
    }, {
      "./AStage": 6,
      "./AudioPresenter": 7,
      "./Global": 14,
      "./NumberValue": 16,
      "./OuterParamReceiver": 17,
      "./SpriteFactory": 24,
      "@akashic-extension/akashic-timeline": 5
    }],
    24: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory =
      /** @class */
      function () {
        function SpriteFactory() {}

        SpriteFactory.createTitle = function (_scene) {
          return SpriteFactory.createSpriteCore(_scene, "ui", 1, 289, 321, 519);
        };

        SpriteFactory.createManual = function (_scene) {
          return SpriteFactory.createSpriteCore(_scene, "ui", 1, 614, 453, 866);
        };

        SpriteFactory.createPictureFrame = function (_s) {
          return SpriteFactory.createSpriteCore(_s, "ui", 2, 2, 288, 288);
        };

        SpriteFactory.createRemainPieceFrame = function (s) {
          return SpriteFactory.createSpriteCore(s, "ui", 289, 1, 489, 65);
        };

        SpriteFactory.createSelectFrameL = function (s) {
          return SpriteFactory.createSpriteCore(s, "ui", 289, 66, 487, 264);
        };

        SpriteFactory.createSelectFrameM = function (s) {
          return SpriteFactory.createSpriteCore(s, "ui", 490, 1, 656, 167);
        };

        SpriteFactory.createSelectFrameS = function (s) {
          return SpriteFactory.createSpriteCore(s, "ui", 657, 1, 787, 131);
        };

        SpriteFactory.createMaskL = function (s) {
          var uv = [{
            left: 87,
            top: 571,
            right: 129,
            bottom: 613
          }, {
            left: 1,
            top: 571,
            right: 43,
            bottom: 613
          }, {
            left: 130,
            top: 571,
            right: 172,
            bottom: 613
          }, {
            left: 44,
            top: 571,
            right: 86,
            bottom: 613
          }];
          var sprT = [];
          uv.forEach(function (x) {
            sprT.push(SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom));
          });
          return sprT;
        };

        SpriteFactory.createMaskM = function (s) {
          var uv = [{
            left: 1,
            top: 542,
            right: 29,
            bottom: 570
          }, {
            left: 30,
            top: 542,
            right: 58,
            bottom: 570
          }, {
            left: 88,
            top: 542,
            right: 116,
            bottom: 570
          }, {
            left: 59,
            top: 542,
            right: 87,
            bottom: 570
          }];
          var sprT = [];
          uv.forEach(function (x) {
            sprT.push(SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom));
          });
          return sprT;
        };

        SpriteFactory.createMaskS = function (s) {
          var uv = [{
            left: 23,
            top: 520,
            right: 44,
            bottom: 541
          }, {
            left: 1,
            top: 520,
            right: 22,
            bottom: 541
          }, {
            left: 67,
            top: 520,
            right: 88,
            bottom: 541
          }, {
            left: 45,
            top: 520,
            right: 66,
            bottom: 541
          }];
          var sprT = [];
          uv.forEach(function (x) {
            sprT.push(SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom));
          });
          return sprT;
        };

        SpriteFactory.createGuideL = function (s) {
          var uv = [{
            left: 621,
            top: 330,
            right: 747,
            bottom: 415
          }, {
            left: 322,
            top: 289,
            right: 407,
            bottom: 415
          }, {
            left: 494,
            top: 330,
            right: 620,
            bottom: 415
          }, {
            left: 408,
            top: 289,
            right: 493,
            bottom: 415
          }];
          var sprT = [];
          uv.forEach(function (x) {
            sprT.push(SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom));
          });
          return sprT;
        };

        SpriteFactory.createGuideM = function (s) {
          var uv = [{
            left: 523,
            top: 416,
            right: 607,
            bottom: 473
          }, {
            left: 322,
            top: 416,
            right: 379,
            bottom: 500
          }, {
            left: 438,
            top: 416,
            right: 522,
            bottom: 473
          }, {
            left: 380,
            top: 416,
            right: 437,
            bottom: 500
          }];
          var sprT = [];
          uv.forEach(function (x) {
            sprT.push(SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom));
          });
          return sprT;
        };

        SpriteFactory.createGuideS = function (s) {
          var uv = [{
            left: 501,
            top: 501,
            right: 564,
            bottom: 544
          }, {
            left: 349,
            top: 501,
            right: 392,
            bottom: 564
          }, {
            left: 437,
            top: 501,
            right: 500,
            bottom: 544
          }, {
            left: 393,
            top: 501,
            right: 436,
            bottom: 564
          }];
          var sprT = [];
          uv.forEach(function (x) {
            sprT.push(SpriteFactory.createSpriteCore(s, "ui", x.left, x.top, x.right, x.bottom));
          });
          return sprT;
        };

        SpriteFactory.createAnimationSprite = function (_scene, srow, scolumn, row, column, show) {
          if (show === void 0) {
            show = true;
          }

          var spriteTable = [];
          var sw = 76;
          var sh = 78;
          var bx = 1 + srow * sw;
          var by = 538 + scolumn * sh + 1;
          var spr = null;

          for (var y = 0, ymax = column; y < ymax; ++y) {
            for (var x = 0, xmax = row; x < xmax; ++x) {
              var nbx = bx + x * sw + x;
              var nby = by + y * sh + y;
              spr = SpriteFactory.createSpriteCore(_scene, "ui", nbx, nby, nbx + sw, nby + sh);

              if (!show) {
                spr.hide();
              }

              spriteTable.push(spr);
            }
          }

          return spriteTable;
        };

        SpriteFactory.createRestNUMFrame = function (_s) {
          return SpriteFactory.createSprite(_s, 784, 1, 944, 47);
        };

        SpriteFactory.createSCOREFrame = function (_s) {
          return SpriteFactory.createSprite(_s, 1, 188, 446, 356);
        };

        SpriteFactory.createClockIcon = function (_s) {
          return SpriteFactory.createSprite(_s, 1, 524, 37, 560);
        };

        SpriteFactory.createPtImage = function (_s) {
          return SpriteFactory.createSprite(_s, 38, 524, 66, 552);
        };

        SpriteFactory.createComboRedBase = function (_s) {
          return SpriteFactory.createSprite(_s, 67, 524, 173, 554);
        };

        SpriteFactory.createComboYellowBase = function (_s) {
          return SpriteFactory.createSprite(_s, 174, 524, 297, 562);
        };

        SpriteFactory.createReady = function (_s) {
          return SpriteFactory.createSprite(_s, 447, 188, 691, 284);
        };

        SpriteFactory.createStart = function (_s) {
          return SpriteFactory.createSprite(_s, 447, 285, 733, 364);
        };

        SpriteFactory.createTimeUp = function (_s) {
          return SpriteFactory.createSprite(_s, 478, 444, 826, 539);
        };

        SpriteFactory.createSprite = function (_scene, sx, sy, ex, ey) {
          return this.createSpriteCore(_scene, "ui_common", sx, sy, ex, ey);
        };

        SpriteFactory.createSpriteCore = function (_s, name, sx, sy, ex, ey) {
          var sw = ex - sx;
          var sh = ey - sy;
          return new g.Sprite({
            scene: _s,
            src: _s.assets[name],
            srcX: sx,
            srcY: sy,
            srcWidth: sw,
            srcHeight: sh,
            width: sw,
            height: sh
          });
        };

        return SpriteFactory;
      }();

      exports.SpriteFactory = SpriteFactory;
    }, {}],
    25: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

      var AudioPresenter_1 = require("./AudioPresenter");

      var TimeOver =
      /** @class */
      function () {
        function TimeOver(_s) {
          this.finishCallback = new Array();
          this._s = _s;
          this.rootEntity = new g.E({
            scene: _s
          });

          var _t = SpriteFactory_1.SpriteFactory.createTimeUp(_s);

          _t.x = (_s.game.width - _t.width) / 2;
          _t.y = (_s.game.height - _t.height) / 2;

          _t.modified();

          _t.hide();

          this.timeUp = _t;
          this.rootEntity.append(_t);
        }

        TimeOver.prototype.show = function (intime, wait) {
          var _this = this;

          var tt = new akashic_timeline_1.Timeline(this._s);
          AudioPresenter_1.AudioPresenter.instance.playSE("se_006B_mono");
          var _tu = this.timeUp;

          _tu.scale(1.5);

          _tu.opacity = 0;

          _tu.modified();

          _tu.show();

          tt.create(this.timeUp, {
            modified: this.timeUp.modified,
            destroyed: this.timeUp.destroyed
          }).scaleTo(1, 1, intime).con().fadeIn(intime).wait(wait).every(function (e, p) {
            if (1 <= p) {
              tt.destroy();

              _this.finishCallback.forEach(function (c) {
                return c();
              });

              _tu.hide();
            }
          }, intime + wait);
          return this;
        };

        return TimeOver;
      }();

      exports.TimeOver = TimeOver;
    }, {
      "./AudioPresenter": 7,
      "./SpriteFactory": 24,
      "@akashic-extension/akashic-timeline": 5
    }],
    26: [function (require, module, exports) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (d, b) {
          d.__proto__ = b;
        } || function (d, b) {
          for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
          }
        };

        return function (d, b) {
          extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var SpriteFactory_1 = require("./SpriteFactory");

      var AudioPresenter_1 = require("./AudioPresenter");

      var AStage_1 = require("./AStage");

      var TitleScene =
      /** @class */
      function (_super) {
        __extends(TitleScene, _super);

        function TitleScene(scene) {
          var _this = _super.call(this) || this;

          _this.scene = scene;
          return _this;
        }

        TitleScene.prototype.activate = function (_s) {
          var _this = this;

          AudioPresenter_1.AudioPresenter.instance.playBGM("bgm_130");
          var s = SpriteFactory_1.SpriteFactory.createTitle(_s);
          s.touchable = true;
          s.x = (_s.game.width - s.width) / 2;
          s.y = (_s.game.height - s.height) / 2;
          s.modified();
          var ap = null;

          _s.setTimeout(function () {
            ap = AudioPresenter_1.AudioPresenter.instance.playSE("se_002c");

            _s.setTimeout(function () {
              // 次のシーンへ行く何か
              _this.finishStage();
            }, 1000);
          }, 5000);

          this.title = s;

          _s.append(s);

          this.scene = _s;
        };

        TitleScene.prototype.dispose = function () {
          if (this.title.destroyed()) {
            return;
          }

          this.title.destroy();
        };

        return TitleScene;
      }(AStage_1.AStage);

      exports.TitleScene = TitleScene;
    }, {
      "./AStage": 6,
      "./AudioPresenter": 7,
      "./SpriteFactory": 24
    }],
    27: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Global_1 = require("./Global");

      var Util =
      /** @class */
      function () {
        function Util() {}

        Util.shuffle = function (array) {
          var length = array == null ? 0 : array.length;

          if (!length) {
            return [];
          }

          if (length === 1) {
            return array.slice(0);
          }

          var index = -1;
          var lastIndex = length - 1;
          var result = [];
          result = array.slice(0);

          while (++index < length) {
            var rand = index + (Global_1.Global.instance.random.get(0, lastIndex - index) | 0);
            var value = result[rand];
            result[rand] = result[index];
            result[index] = value;
          }

          return result;
        };

        Util.readJSON = function (_s, name) {
          return JSON.parse(_s.assets[name].data);
        };

        Util.lerp = function (a, b, t, matchThreshold) {
          if (matchThreshold === void 0) {
            matchThreshold = 0;
          }

          var r = (1 - t) * a + t * b;

          if (0 < matchThreshold) {
            if (Math.abs(r - a) < matchThreshold) {
              r = b;
            }
          }

          return r;
        };

        Util.getWorldPos = function (r, px, py) {
          if (px === void 0) {
            px = 0;
          }

          if (py === void 0) {
            py = 0;
          }

          var rt = r;
          var mx = new g.PlainMatrix();
          mx.reset(px, py);

          do {
            var cx = rt.getMatrix();
            mx = cx.multiplyNew(mx);
            rt = rt.parent;
          } while (rt instanceof g.E);

          var ofs = mx.multiplyPoint({
            x: 0,
            y: 0
          });
          return {
            x: ofs.x,
            y: ofs.y,
            width: r.width,
            height: r.height
          };
        };

        Util.range = function (start, count, step) {
          if (step === void 0) {
            step = 1;
          }

          var result = [];

          for (var i = 0; i < count; i++) {
            result.push(start + i * step);
          }

          return result;
        };

        Util.repeat = function (obj, count) {
          var result = [];

          for (var i = 0; i < count; i++) {
            result.push(obj);
          }

          return result;
        };

        return Util;
      }();

      exports.Util = Util;
    }, {
      "./Global": 14
    }],
    28: [function (require, module, exports) {
      "use strict";

      var FieldScene_1 = require("./FieldScene");

      var TitleScene_1 = require("./TitleScene");

      var ManualScene_1 = require("./ManualScene");

      var ResultScene_1 = require("./ResultScene");

      var Global_1 = require("./Global");

      var AudioPresenter_1 = require("./AudioPresenter");

      var NumberValue_1 = require("./NumberValue");

      var OuterParamReceiver_1 = require("./OuterParamReceiver");

      var GameFont_1 = require("./GameFont");

      function main(param) {
        var scene = new g.Scene({
          game: g.game,
          assetIds: ["ui_common", "ui", "ui_2", "glyph28", "glyph72", "glyph32_yellow", "bgm_130", "jin_000", "jin_002", "se_005A_mono", "se_006B_mono", "se_001a", "se_001c", "se_002c", "se_003", "se_004", "se_100c"]
        });
        Global_1.Global.init();
        OuterParamReceiver_1.OuterParamReceiver.receiveParamFromMessage(scene);
        OuterParamReceiver_1.OuterParamReceiver.paramSetting();
        scene.loaded.add(function () {
          AudioPresenter_1.AudioPresenter.initialize(scene);
          NumberValue_1.NumberFont.instance.initialize(scene);
          GameFont_1.GameFont.instance.initialize(scene);
          var title = new TitleScene_1.TitleScene(scene);
          var manual = new ManualScene_1.ManualScene(scene);
          var field = new FieldScene_1.FieldScene(scene);
          var result = new ResultScene_1.ResultScene(scene);
          title.finishCallback.push(function () {
            title.dispose();
            manual.activate(scene);
          });
          manual.finishCallback.push(function () {
            manual.dispose();
            field.activate(scene);
          });
          field.finishCallback.push(function () {
            field.dispose();
            result.activate(scene);
          });
          result.finishCallback.push(function () {
            result.dispose();
            title.activate(scene);
          });

          if (Global_1.Global.instance.DEBUG) {
            field.activate(scene);
          } else {
            title.activate(scene);
          }
        });
        g.game.pushScene(scene);
      }

      module.exports = main;
    }, {
      "./AudioPresenter": 7,
      "./FieldScene": 9,
      "./GameFont": 12,
      "./Global": 14,
      "./ManualScene": 15,
      "./NumberValue": 16,
      "./OuterParamReceiver": 17,
      "./ResultScene": 23,
      "./TitleScene": 26
    }]
  }, {}, [28])(28);
});