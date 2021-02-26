// 本来であればv3系のg.ScriptAssetをimplementsすべきだが、ビルド時に使用しているakashic-engineはv2系なので一からクラス定義している
var LocalScriptAssetV3 = /** @class */ (function () {
    function LocalScriptAssetV3(id, path) {
        this.type = "script";
        this.id = id;
        this.originalPath = path;
        this.path = this._assetPathFilter(path);
        this.onDestroyed = new g.Trigger();
        this.func = window.gLocalAssetContainer[id]; // gLocalScriptContainer は index.ect 上のscriptタグ内で宣言されている 
    }
    LocalScriptAssetV3.prototype.destroy = function () {
        this.onDestroyed.fire(this);
        this.id = undefined;
        this.originalPath = undefined;
        this.path = undefined;
        this.onDestroyed.destroy();
        this.onDestroyed = undefined;
    };
    LocalScriptAssetV3.prototype.destroyed = function () {
        return this.id === undefined;
    };
    LocalScriptAssetV3.prototype.inUse = function () {
        return false;
    };
    // 引数の型はg.ScriptAssetRuntimeValueだが、v2系には無いものなのでanyを指定している
    LocalScriptAssetV3.prototype.execute = function (execEnv) {
        this.func(execEnv);
        return execEnv.module.exports;
    };
    LocalScriptAssetV3.prototype._load = function (loader) {
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
    /**
     * @private
     */
    LocalScriptAssetV3.prototype._assetPathFilter = function (path) {
        // 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
        return path;
    };
    return LocalScriptAssetV3;
}());
