"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weightedLottery = void 0;
/**
 * 重み付け抽選。
 *
 * 配列からランダムに指定個数の要素を選び、それらを格納した配列を返す。
 *
 * weightedItemCond() が真を返す要素は当選確率が weight だけ重み付けされる。
 * たとえば weight が 2 なら、 weightedItemCond が真を返す要素はそうでない要素
 * と比較して 2 倍の当選確率になる。
 *
 * @param items 抽選される要素の配列。
 * @param numWinners 抽選で選ばれる要素数。
 * @param weight 当選確率の重みづけ。重み付けされない要素の当選確率に対する比。
 * @param rand 乱数生成器。
 * @param weightedItemCond 当選率を重み付けされる要素を与えた時真を返す関数。
 */

function weightedLottery(items, numWinners, weight, rand, weightedItemCond) {
  items = __spreadArrays(items); // 全て当選とするケース。

  if (numWinners >= items.length) {
    return items;
  } // 当選確率を重み付けされる要素を配列の先頭に集める。


  items = items.sort(function (item1, item2) {
    var n1 = weightedItemCond(item1) ? 0 : 1;
    var n2 = weightedItemCond(item2) ? 0 : 1;
    return n1 - n2;
  }); // 一様乱数を weight などにしたがって非一様乱数に変換する関数。

  var Gi = function Gi(w, a, b, gx) {
    var t = 1 / (a * (w - 1) + b);
    var atw = a * t * w;

    if (gx < atw) {
      return gx / (t * w);
    } else {
      return (b - a) * (gx - atw) / (1 - atw) + a;
    }
  };

  var A = items.filter(function (item) {
    return weightedItemCond(item);
  }).length;
  var B = items.length;
  var winners = [];

  for (var i = 0; i < numWinners; i++) {
    var g_x = rand.generate();
    var x = Gi(weight, A, B, g_x);
    var idx = Math.floor(x);
    if (idx < A) A--;
    B--;
    winners.push(items.splice(idx, 1)[0]);
  }

  return winners;
}

exports.weightedLottery = weightedLottery;