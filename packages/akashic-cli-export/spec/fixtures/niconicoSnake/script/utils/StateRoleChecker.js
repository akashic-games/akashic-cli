"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkStateRole = exports.StateRoleType = void 0;

var StateManager_1 = require("../StateManager");

var StateRoleType;

(function (StateRoleType) {
  /**
   * 衝突判定がある PlayerState群
   */
  StateRoleType["CanCollideType"] = "CanCollideType";
  /**
   * 音を鳴らしてよい PlayerState群
   */

  StateRoleType["CanSoundType"] = "CanSoundType";
  /**
   * フィールド上に生存しているスネークとしてカウントする PlayerState群
   */

  StateRoleType["CanCountType"] = "CanCountType";
  /**
   * 操作ハンドラを呼んで良い PlayerState群
   */

  StateRoleType["CanOperateType"] = "CanOperateType";
  /**
   * 移動可能な PlayerState群
   */

  StateRoleType["CanMoveType"] = "CanMoveType";
  /**
   * 節、お宝を落とすことが可能な PlayerState群
   */

  StateRoleType["CanDropType"] = "CanDropType";
  /**
   * ゲーム観戦者になっている時の PlayerState群
   */

  StateRoleType["IsAudienceType"] = "IsAudienceType";
})(StateRoleType = exports.StateRoleType || (exports.StateRoleType = {}));
/**
 * PlayerStateの役割を判定する
 */


function checkStateRole(playerState, roleType) {
  switch (roleType) {
    case StateRoleType.CanCollideType:
      return playerState !== StateManager_1.PlayerState.ghost && playerState !== StateManager_1.PlayerState.invincible && playerState !== StateManager_1.PlayerState.staging;

    case StateRoleType.CanSoundType:
      return playerState === StateManager_1.PlayerState.playing || playerState === StateManager_1.PlayerState.invincible;

    case StateRoleType.CanCountType:
      return playerState === StateManager_1.PlayerState.playing || playerState === StateManager_1.PlayerState.invincible || playerState === StateManager_1.PlayerState.staging;

    case StateRoleType.CanOperateType:
      return playerState !== StateManager_1.PlayerState.staging && playerState !== StateManager_1.PlayerState.dead;

    case StateRoleType.CanMoveType:
      return playerState !== StateManager_1.PlayerState.staging && playerState !== StateManager_1.PlayerState.dead;

    case StateRoleType.CanDropType:
      return playerState === StateManager_1.PlayerState.playing;

    case StateRoleType.IsAudienceType:
      return playerState === StateManager_1.PlayerState.dead || playerState === StateManager_1.PlayerState.staging;

    default:
      // never
      return false;
  }
}

exports.checkStateRole = checkStateRole;