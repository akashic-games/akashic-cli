"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreventType = exports.CountDownType = exports.AnimationType = exports.ScopeType = exports.MessageEventType = void 0;
var MessageEventType;

(function (MessageEventType) {
  // ----------
  // 募集～抽選画面のイベント
  // ----------

  /**
   * 放送者が参加者募集を開始する。
   * startRecruitmentのタイミングは生主のユーザーアクションによって決定される。
   */
  MessageEventType["startRecruitment"] = "startRecruitment";
  /**
   * 参加者募集状態にする。
   */

  MessageEventType["waitRecruitment"] = "waitRecruitment";
  /**
   * 視聴者がゲーム参加を希望する。
   */

  MessageEventType["joinRequest"] = "joinRequest";
  /**
   * 抽選結果を全インスタンスに共有する。
   */

  MessageEventType["lotteryResult"] = "lotteryResult";
  /**
   * 参加者が集まらなかった時に募集をやりなおす
   */

  MessageEventType["restartRecruitment"] = "restartRecruitment";
  /**
   * ゲーム開始を全インスタンスに通知する。
   */

  MessageEventType["startGame"] = "startGame"; // ----------
  // ゲーム画面のイベント
  // ----------

  /**
   * ゲーム画面の初期化を通知する。
   */

  MessageEventType["initMainGame"] = "initMainGame";
  /**
   * 全スネーク・指定したスネークの無敵状態を解除し、PlayerStateをPlayingにセットすることを通知する。
   */

  MessageEventType["setPlaying"] = "setPlaying";
  /**
   * ユーザによって操作状態が変わったことを通知する。
   */

  MessageEventType["changeUserTouchState"] = "changeUserTouchState";
  /**
   * 衝突したプレイヤーを全インスタンスに通知する。
   */

  MessageEventType["sendPlayersInConflict"] = "sendPlayersInConflict";
  /**
   * リスポーンしたプレイヤーのスネークを全インスタンスに通知する。
   */

  MessageEventType["respawnSnake"] = "respawnSnake";
  /**
   * お宝のリスポーンを全インスタンスに通知する。
   */

  MessageEventType["respawnJewel"] = "respawnJewel";
  /**
   * エサが食べられた情報を全インスタンスに通知する。
   */

  MessageEventType["eatenFoods"] = "eatenFoods";
  /**
   * 放送者のスネークが天使スネークになったことを全インスタンスに通知する。
   */

  MessageEventType["respawnBroadcasterAngelSnake"] = "respawnBroadcasterAngelSnake";
  /**
   * お宝所有者の更新情報を全インスタンスに通知する。
   */

  MessageEventType["updateJewelOwner"] = "updateJewelOwner";
  /**
   * ランキング情報を全インスタンスに通知する。
   */

  MessageEventType["rankingAccountData"] = "rankingAccountData";
  /**
   * 残りの制限時間を全インスタンスに通知する。
   */

  MessageEventType["updateRemainTime"] = "updateRemainTime";
  /**
   * アニメーション開始を通知する。
   */

  MessageEventType["animation"] = "animation";
  /**
   * カウントダウン表示を全インスタンスに通知する。
   */

  MessageEventType["countDown"] = "countDown";
  /**
   * ユーザによる操作状態の変更を全インスタンスに通知する。
   */

  MessageEventType["preventUsertouch"] = "preventUsertouch";
  /**
   * あるスネークをdestroyすることを全インスタンスに通知する。
   */

  MessageEventType["destroySnake"] = "destroySnake";
  /**
   * ゲーム終了手続き開始を全インスタンスに通知する。
   */

  MessageEventType["finishGame"] = "finishGame";
  /**
   * リザルト画面遷移を全インスタンスに通知する。
   */

  MessageEventType["startResult"] = "startResult"; // ----------
  // リザルト画面のイベント
  // ----------

  /**
   * リザルト画面の初期化を全インスタンスに通知する。
   */

  MessageEventType["initResult"] = "initResult";
  /**
   * 次に表示するランキングの種類を全インスタンスに通知する。
   */

  MessageEventType["nextRankingType"] = "nextRankingType";
  /**
   * ランキングスクロール速度変更を全インスタンスに通知する。
   */

  MessageEventType["changeScrollSpeed"] = "changeScrollSpeed";
})(MessageEventType = exports.MessageEventType || (exports.MessageEventType = {}));

;
/**
 * 対象Scopeの種類
 */

var ScopeType;

(function (ScopeType) {
  /**
   * 全員対象
   */
  ScopeType["All"] = "All";
  /**
   * ある特定の一人対象
   */

  ScopeType["One"] = "One";
})(ScopeType = exports.ScopeType || (exports.ScopeType = {}));
/**
 * Animationの種類
 */


var AnimationType;

(function (AnimationType) {
  /**
   * 透過度変更によりスネークを点滅させる
   */
  AnimationType["Blinking"] = "Blinking";
  /**
   * スネークを見えなくして「放送者画面に切り替わります」を表示
   */

  AnimationType["ToBroadcasterView"] = "ToBroadcasterView";
})(AnimationType = exports.AnimationType || (exports.AnimationType = {}));
/**
 * カウントダウン表示の種類
 */


var CountDownType;

(function (CountDownType) {
  CountDownType["Start"] = "Start";
  CountDownType["Finish"] = "Finish";
  CountDownType["One"] = "One";
  CountDownType["Two"] = "Two";
  CountDownType["Three"] = "Three";
})(CountDownType = exports.CountDownType || (exports.CountDownType = {}));

var PreventType;

(function (PreventType) {
  PreventType["TouchState"] = "TouchState";
  PreventType["None"] = "None";
})(PreventType = exports.PreventType || (exports.PreventType = {}));