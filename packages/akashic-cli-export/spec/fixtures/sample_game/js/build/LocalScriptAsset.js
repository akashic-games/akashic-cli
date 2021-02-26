var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LocalScriptAsset = /** @class */ (function (_super) {
    __extends(LocalScriptAsset, _super);
    function LocalScriptAsset(id, path) {
        var _this = _super.call(this, id, path) || this;
        _this.func = window.gLocalAssetContainer[id]; // gLocalScriptContainer は index.ect 上のscriptタグ内で宣言されている 
        return _this;
    }
    LocalScriptAsset.prototype._load = function (loader) {
        var _this = this;
        if (this.func !== undefined) {
            setTimeout(function () {
                loader._onAssetLoad(_this);
            }, 0);
        }
        else {
            setTimeout(function () {
                loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("can not load script asset"));
            }, 0);
        }
    };
    LocalScriptAsset.prototype.execute = function (execEnv) {
        this.func(execEnv);
        return execEnv.module.exports;
    };
    return LocalScriptAsset;
}(g.ScriptAsset));
