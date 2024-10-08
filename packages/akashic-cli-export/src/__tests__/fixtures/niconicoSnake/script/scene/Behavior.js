"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Behavior = void 0;

var Behavior =
/** @class */
function () {
  function Behavior(param) {
    this.scene = param.scene;
    this.stateManager = param.stateManager;
  }

  return Behavior;
}();

exports.Behavior = Behavior;