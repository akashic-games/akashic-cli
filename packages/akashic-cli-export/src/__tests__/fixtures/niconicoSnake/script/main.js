"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = void 0;

var defaultParameter_1 = require("./config/defaultParameter");

var StateManager_1 = require("./StateManager");

function main(param) {
  var userSessionParameter = param.sessionParameter;

  if (userSessionParameter) {
    assign(defaultParameter_1.sessionParameter, userSessionParameter);
  }

  var stateManager = new StateManager_1.StateManager({
    sessionParameter: defaultParameter_1.sessionParameter,
    broadcaster: param.broadcasterPlayer
  });

  if (!!stateManager.sessionParameter.config.debug && stateManager.sessionParameter.config.debug.skipLottery) {
    stateManager.playerList = {};
    stateManager.playerList[stateManager.broadcaster.id] = new StateManager_1.PlayerInfo({
      player: stateManager.broadcaster,
      user: {
        name: "debug",
        id: "000000000",
        isPremium: false
      },
      isBroadcaster: true,
      snakeType: "A"
    });
    stateManager.randomGenerator = new g.XorshiftRandomGenerator(2525);
    stateManager.changeMainGameScene();
  } else {
    stateManager.changeTitleScene();
  }
}

exports.main = main;

function assign(target, _) {
  var to = Object(target);

  for (var index = 1; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource != null) {
      for (var nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          if (nextSource[nextKey] != null && _typeof(nextSource[nextKey]) === "object") {
            to[nextKey] = assign(to[nextKey], nextSource[nextKey]);
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }

  return to;
}