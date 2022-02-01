"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localToGlobal = void 0;

function localToGlobal(offset) {
  var point = offset;

  for (var entity = this; entity instanceof g.E; entity = entity.parent) {
    point = entity.getMatrix().multiplyPoint(point);
  }

  return point;
}

exports.localToGlobal = localToGlobal;