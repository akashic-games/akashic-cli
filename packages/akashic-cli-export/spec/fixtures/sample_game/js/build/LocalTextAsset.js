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
var LocalTextAsset = /** @class */ (function (_super) {
    __extends(LocalTextAsset, _super);
    function LocalTextAsset(id, path) {
        var _this = _super.call(this, id, path) || this;
        _this.data = decodeURIComponent(window.gLocalAssetContainer[id]);
        return _this;
    }
    LocalTextAsset.prototype._load = function (loader) {
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
    return LocalTextAsset;
}(g.TextAsset));
