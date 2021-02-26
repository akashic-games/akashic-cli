"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameExternalStorage = void 0;
var types = require("./content-storage-types");
var GameExternalStorage = /** @class */ (function () {
    function GameExternalStorage(_a) {
        var storage = _a.kvs, playId = _a.playId, gameCode = _a.gameCode;
        this.apiVersion = 1; // 現状固定
        this.dataTable = Object.create(null);
        this.kvs = storage;
        this.playId = playId;
        this.gameCode = gameCode;
    }
    GameExternalStorage.prototype.read = function (req, callback) {
        try {
            var result_1 = this._readSync(req);
            setImmediate(function () { return callback(null, result_1); });
        }
        catch (e) {
            setImmediate(function () { return callback(e, null); });
        }
    };
    GameExternalStorage.prototype.write = function (req, callback) {
        try {
            var result_2 = this._writeSync(req);
            setImmediate(function () { return callback(null, result_2); });
        }
        catch (e) {
            setImmediate(function () { return callback(e, null); });
        }
    };
    GameExternalStorage.prototype._readSync = function (req) {
        var _a, _b, _c, _d;
        var gameCode = req.gameCode, playScope = req.playScope, key = req.key, playerIds = req.playerIds, type = req.type;
        var limit = (_a = req.limit) !== null && _a !== void 0 ? _a : types.DEFAULT_STORAGE_READ_REQUEST_LIMIT;
        var offset = (_b = req.offset) !== null && _b !== void 0 ? _b : types.DEFAULT_STORAGE_READ_REQUEST_OFFSET;
        var order = (_c = req.order) !== null && _c !== void 0 ? _c : "unspecified";
        if (playerIds && order !== "unspecified")
            throw new Error("could not be specified both playerIds and specified order");
        if (!playerIds && order === "unspecified")
            throw new Error("neither playerIds nor specified order given");
        if (order !== "unspecified" && (typeof limit !== "number" || limit < 0))
            throw new Error("invalid limit");
        if ((order === "asc" || order === "desc") && (type !== "number" && type !== "ordered-number"))
            throw new Error("asc/desc can be specified only for number");
        if (playerIds && type === "ordered-number")
            throw new Error("could not read value for key " + req.key + " specified playerIds and ordered-number");
        var dataTable = (_d = this.getDataTableFromKVS(playScope, req)) !== null && _d !== void 0 ? _d : Object.create(null);
        if (playerIds) {
            var data_1 = playerIds.map(function (playerId) {
                var value = playerId in dataTable ? dataTable[playerId] : null;
                return { playerId: playerId, value: value };
            });
            return { gameCode: gameCode, playScope: playScope, key: key, data: data_1, type: type };
        }
        var data = Object.keys(dataTable).map(function (playerId) { return ({ playerId: playerId, value: dataTable[playerId] }); });
        // asc/desc は JSON 上では効率的に実装できないので、全件取得したものをソートして limit 件切り出す。
        // 最適化された実装は declare() 時点で type: "number" を踏まえた適切なデータ構造を採用できるはず。
        switch (order) {
            case "asc":
                // order が asc/desc なら spec.type が number なのは上で確認済み、
                // かつ spec.type と一致しない値は書き込まないのを write() が保証しているので、常に `as number` できる。
                // (あるいは、TypeScript にこの invariant を推論させられないので明示的なキャストが必要)
                data.sort(function (a, b) { return a.value - b.value; });
                return { gameCode: gameCode, playScope: playScope, key: key, type: type, data: data.slice(offset, offset + limit) };
            case "desc":
                data.sort(function (a, b) { return b.value - a.value; });
                return { gameCode: gameCode, playScope: playScope, key: key, type: type, data: data.slice(offset, offset + limit) };
            default:
                return { gameCode: gameCode, playScope: playScope, key: key, type: type, data: data.slice(offset, offset + limit) };
        }
    };
    GameExternalStorage.prototype._writeSync = function (req) {
        var _a, _b, _c, _d;
        var gameCode = req.gameCode, key = req.key, playScope = req.playScope, data = req.data, type = req.type;
        var writeType = (_a = req.writeType) !== null && _a !== void 0 ? _a : "overwrite";
        var min = (_b = req.min) !== null && _b !== void 0 ? _b : types.STORAGE_MIN_NUMBER;
        var max = (_c = req.max) !== null && _c !== void 0 ? _c : types.STORAGE_MAX_NUMBER;
        if (type !== "number" && type !== "ordered-number") {
            if (writeType === "incr" || writeType === "decr")
                throw new Error("incr/decr cannot be used for type " + type);
        }
        var dataTable = (_d = this.getDataTableFromKVS(playScope, req)) !== null && _d !== void 0 ? _d : Object.create(null);
        var failed = data.map(function (_a) {
            var playerId = _a.playerId, value = _a.value;
            if (typeof value !== "number") {
                if (value != null && type !== "string" && type !== "general") {
                    throw new Error("type mismatch: the value " + value + " for player " + playerId + " does not match the type " + type);
                }
                dataTable[playerId] = value;
                return null;
            }
            if (type !== "number" && type !== "ordered-number") {
                throw new Error("type mismatch: the value " + value + " for player " + playerId + " does not match the type " + type);
            }
            var needsCalc = (writeType === "incr" || writeType === "decr");
            var current = null;
            if (needsCalc) {
                if (playerId in dataTable) {
                    current = dataTable[playerId];
                }
                else if (typeof current !== "number") {
                    throw new Error("no value for key " + key + " of player " + playerId);
                }
            }
            var calculated = 
            // current が number でなければ incr/decr でないことは上でチェック済みなのでキャストできる
            (writeType === "incr") ? current + value :
                (writeType === "decr") ? current - value :
                    value;
            var clamped = Math.min(max, Math.max(min, calculated));
            var diff = calculated - clamped;
            if (diff < 0) {
                return {
                    gameCode: gameCode,
                    playScope: playScope,
                    key: key,
                    playerId: playerId,
                    type: type,
                    failureType: "subceedMin",
                    message: "subceedMin (message T.B.D)"
                };
            }
            else if (diff > 0) {
                return {
                    gameCode: gameCode,
                    playScope: playScope,
                    key: key,
                    playerId: playerId,
                    type: type,
                    failureType: "exceedMax",
                    message: "exceedMax (message T.B.D)"
                };
            }
            else {
                dataTable[playerId] = calculated;
                return null;
            }
        }).filter(function (failed) { return failed != null; });
        this.setDataTableToKVS(playScope, req, dataTable);
        return failed.length ? { failed: failed } : null;
    };
    GameExternalStorage.prototype.getDataTableFromKVS = function (playScope, loc) {
        var str = this.kvs.getItem(GameExternalStorage.kvsPrefix +
            this._resolvePlayId(playScope) +
            "__" +
            this._locatorIdOf(loc) +
            "__");
        try {
            var data = JSON.parse(str);
            return data;
        }
        catch (_e) { }
        return null;
    };
    GameExternalStorage.prototype.setDataTableToKVS = function (playScope, loc, data) {
        this.kvs.setItem(GameExternalStorage.kvsPrefix +
            this._resolvePlayId(playScope) +
            "__" +
            this._locatorIdOf(loc) +
            "__", JSON.stringify(data));
    };
    GameExternalStorage.prototype._resolvePlayId = function (playScope) {
        switch (playScope) {
            case "play":
                return this.playId;
            case "rootPlay":
                return "$ROOTPLAY";
            case "global":
            default:
                return "$GLOBAL";
        }
    };
    GameExternalStorage.prototype._locatorIdOf = function (loc) {
        return this.gameCode + "___" + loc.key;
    };
    GameExternalStorage.kvsPrefix = "__akashic_game_storage__";
    return GameExternalStorage;
}());
exports.GameExternalStorage = GameExternalStorage;
