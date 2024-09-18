"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinRequestSequence = exports.startRecruitmentSequence = void 0;

var resolve_player_info_1 = require("@akashic-extension/resolve-player-info");

var MessageEventType_1 = require("../types/MessageEventType");
/**
 * 放送者が参加募集を開始するシーケンス
 */


function startRecruitmentSequence() {
  resolve_player_info_1.resolvePlayerInfo({
    raises: false
  }, function (error, playerInfo) {
    var _a;

    var joinUser;

    if (error || !((_a = playerInfo === null || playerInfo === void 0 ? void 0 : playerInfo.userData) === null || _a === void 0 ? void 0 : _a.accepted)) {
      joinUser = {
        name: "broadcaster",
        id: "000000000",
        isPremium: false
      };
    } else {
      joinUser = {
        name: playerInfo.name,
        id: "000000000",
        isPremium: !!playerInfo.userData.premium
      };
    }

    var message = {
      messageType: MessageEventType_1.MessageEventType.startRecruitment,
      messageData: {
        broadcasterUser: joinUser
      }
    };
    g.game.raiseEvent(new g.MessageEvent(message));
  });
}

exports.startRecruitmentSequence = startRecruitmentSequence;
/**
 * プレイヤーがゲームに参加リクエストを送るシーケンス
 */

function joinRequestSequence(player) {
  resolve_player_info_1.resolvePlayerInfo({
    raises: false
  }, function (error, playerInfo) {
    var _a;

    var joinUser;

    if (error || !((_a = playerInfo === null || playerInfo === void 0 ? void 0 : playerInfo.userData) === null || _a === void 0 ? void 0 : _a.accepted)) {
      joinUser = {
        name: !!player.name ? player.name : "niconico",
        id: player.id,
        isPremium: false
      };
    } else {
      joinUser = {
        name: playerInfo.name,
        id: player.id,
        isPremium: !!playerInfo.userData.premium
      };
    }

    var message = {
      messageType: MessageEventType_1.MessageEventType.joinRequest,
      messageData: {
        joinPlayer: player,
        joinUser: joinUser
      }
    };
    g.game.raiseEvent(new g.MessageEvent(message));
  });
}

exports.joinRequestSequence = joinRequestSequence;