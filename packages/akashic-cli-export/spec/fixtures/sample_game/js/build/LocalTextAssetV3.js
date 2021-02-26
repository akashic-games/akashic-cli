// 本来であればv3系のg.TextAssetをimplementsすべきだが、ビルド時に使用しているakashic-engineはv2系なので一からクラス定義している
var LocalTextAssetV3 = /** @class */ (function () {
    function LocalTextAssetV3(id, path) {
        this.type = "text";
        this.id = id;
        this.originalPath = path;
        this.path = this._assetPathFilter(path);
        this.onDestroyed = new g.Trigger();
        this.data = decodeURIComponent(window.gLocalAssetContainer[id]);
    }
    LocalTextAssetV3.prototype.destroy = function () {
        this.onDestroyed.fire(this);
        this.id = undefined;
        this.originalPath = undefined;
        this.path = undefined;
        this.onDestroyed.destroy();
        this.onDestroyed = undefined;
    };
    LocalTextAssetV3.prototype.destroyed = function () {
        return this.id === undefined;
    };
    LocalTextAssetV3.prototype.inUse = function () {
        return false;
    };
    LocalTextAssetV3.prototype._load = function (loader) {
        var _this = this;
        if (this.data !== undefined) {
            setTimeout(function () {
                loader._onAssetLoad(_this);
            }, 0);
        }
        else {
            setTimeout(function () {
                loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("can not load text asset"));
            }, 0);
        }
    };
    /**
     * @private
     */
    LocalTextAssetV3.prototype._assetPathFilter = function (path) {
        // 拡張子の補完・読み替えが必要なassetはこれをオーバーライドすればよい。(対応形式が限定されるaudioなどの場合)
        return path;
    };
    return LocalTextAssetV3;
}());
