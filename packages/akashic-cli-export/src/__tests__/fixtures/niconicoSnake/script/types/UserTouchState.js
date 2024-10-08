"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserTouchState = void 0;
var UserTouchState;

(function (UserTouchState) {
  /**
   * そのインスタンスのユーザが移動操作を開始した状態を表す
   */
  UserTouchState["onPoint"] = "onPoint";
  /**
   * 操作していない状態を表す
   * 主にpointUp後の状態
   */

  UserTouchState["noPoint"] = "noPoint";
  /**
   * ダブルタップしている状態
   * ダッシュ可能時間内
   */

  UserTouchState["onDoubleTap"] = "onDoubleTap";
  /**
   * ダッシュ終了後もタップし続けている状態
   */

  UserTouchState["onHold"] = "onHold";
})(UserTouchState = exports.UserTouchState || (exports.UserTouchState = {}));