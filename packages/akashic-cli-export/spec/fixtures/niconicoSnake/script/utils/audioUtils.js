"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeAudioMasterVolume = void 0;
/**
 * 対象のオーディオをパラメータで指定したボリュームに設定する
 * @param audioPlayer : 対象の g.AudioPlayer
 * @param config : セッションパラメータのコンフィグ
 */

function changeAudioMasterVolume(audioPlayer, config) {
  if (audioPlayer == null) return;

  if (!!config.debug && config.debug.audioVolume) {
    audioPlayer.changeVolume(config.debug.audioVolume);
  } else {
    audioPlayer.changeVolume(config.audio.audioVolume);
  }
}

exports.changeAudioMasterVolume = changeAudioMasterVolume;