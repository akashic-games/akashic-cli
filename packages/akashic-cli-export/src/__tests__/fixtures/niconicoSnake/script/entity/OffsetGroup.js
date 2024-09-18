"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OffsetGroup = void 0;

var OffsetGroup =
/** @class */
function () {
  function OffsetGroup(param) {
    this.parent = param.parent;
    this.root = new g.E({
      scene: this.parent.scene
    });
    this.parent.append(this.root);
  }

  OffsetGroup.prototype.destroy = function () {
    this.root.destroy();
  };

  return OffsetGroup;
}();

exports.OffsetGroup = OffsetGroup;