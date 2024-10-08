"use strict";

var main_1 = require("./main");

module.exports = function (originalParam) {
  var param = {};
  Object.keys(originalParam).forEach(function (key) {
    param[key] = originalParam[key];
  });
  param.sessionParameter = {};
  var sessionParameter;
  var broadcasterPlayer;
  var scene = new g.Scene({
    game: g.game
  });

  function start() {
    param.sessionParameter = sessionParameter;
    g.game.popScene();
    main_1.main(param);
  }

  g.game.onJoin.add(function (event) {
    broadcasterPlayer = event.player;
    param.broadcasterPlayer = broadcasterPlayer;
  });
  scene.onMessage.add(function (message) {
    if (message.data && message.data.type === "start" && message.data.parameters) {
      sessionParameter = message.data.parameters;
    }
  }); // 生主の playerId 確定とセッションパラメータが揃ったらゲーム開始

  scene.onUpdate.add(function () {
    if (broadcasterPlayer && sessionParameter) {
      start();
    }
  });
  g.game.pushScene(scene);
};