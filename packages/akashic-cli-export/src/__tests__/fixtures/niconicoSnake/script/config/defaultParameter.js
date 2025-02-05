"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionParameter = void 0;
exports.sessionParameter = {
  entrySec: 10,
  numPlayers: 99,
  howtoMessage: "スネークを操作して他のスネークを倒しましょう！\n" + "他のスネークのからだに頭がぶつかると死んでしまいます。\n" + "えさを拾うとからだが伸びます。\n" + "クリック/タップ/ドラッグ：方向転換\n" + "ダブルクリック/タップ：ダッシュ",
  premiumWeight: 2.5,
  config: {
    field: {
      radius: [1800, 1600, 1400, 1200, 1000],
      narrowRadiusPerSec: 5,
      bgOpacity: 0.8
    },
    food: {
      interval: 10000,
      volume: [5, 5, 5, 5, 5]
    },
    snake: {
      dashingTime: 3,
      baseSpeed: 5,
      maxSpeedScale: 4,
      amountDashingGaugeRecoveryPerFrame: 1,
      maxNameLength: 5,
      maxKnotLength: 30,
      respawnTimes: 0,
      premiumRespawnTimes: 1,
      invincibleTime: 10000
    },
    time: {
      isTimeBased: true,
      limit: 300
    },
    userInput: {
      pointMoveDistance: 30,
      doublePointDuration: 0.1,
      radianFineness: 72
    },
    audio: {
      audioVolume: 1.0
    }
  }
};