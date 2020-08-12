!function(f) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = f() : "function" == typeof define && define.amd ? define([], f) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).gameStorage = f();
}(function() {
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = "function" == typeof require && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n || e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        1: [ function(require, module, exports) {
            "use strict";
            var g = require("@akashic/akashic-engine"), validator = require("./validator"), GameStorage = function() {
                function GameStorage(localStorage, metaData) {
                    this._localStorage = localStorage, this._metaData = metaData;
                }
                return GameStorage.prototype.set = function(key, value, option) {
                    validator.validateStorageKey(key), this.expandVariables(key);
                    var date, finalValue, strKey = this.storageKeyToStringKey(key), current = this.getValue(strKey), newValue = null;
                    switch (key.region) {
                      case g.StorageRegion.Values:
                        newValue = this.createValuesValue(current, value, option);
                        break;

                      case g.StorageRegion.Counts:
                        newValue = this.createCountsValue(current, value, option);
                        break;

                      case g.StorageRegion.Scores:
                        newValue = this.createScoresValue(current, value, option);
                        break;

                      case g.StorageRegion.Slots:
                        throw new Error("Slots is not supported.");

                      default:
                        throw new Error("Unknown region.");
                    }
                    newValue && (finalValue = null, date = new Date(), finalValue = current ? {
                        data: newValue.data,
                        tag: newValue.tag,
                        createdAt: current.createdAt,
                        updatedAt: date
                    } : {
                        data: newValue.data,
                        tag: newValue.tag,
                        createdAt: date,
                        updatedAt: date
                    }, this.setValue(strKey, finalValue));
                }, GameStorage.prototype.load = function(readKeys) {
                    var _this = this, allValues = {};
                    Object.keys(this._localStorage).forEach(function(key) {
                        var k;
                        0 === key.indexOf("akst:") && (k = key.slice("akst:".length), allValues[k] = _this.getValue(k));
                    });
                    var results = [];
                    return readKeys.forEach(function(readKey) {
                        validator.validateStorageReadKey(readKey), _this.expandVariables(readKey);
                        var regexp, readStrKey, v, sv, values = [];
                        -1 !== readKey.regionKey.indexOf("*") || "*" === readKey.userId ? (regexp = _this.storageReadKeyToRegExp(readKey), 
                        Object.keys(allValues).forEach(function(key) {
                            var lv, sv;
                            regexp.test(key) && (sv = {
                                data: (lv = allValues[key]).data,
                                storageKey: _this.stringKeyToStorageKey(key)
                            }, null != lv.tag && (sv.tag = lv.tag), values.push(sv));
                        }), readKey.option && (void 0 !== readKey.option.valueOrder && _this.sortByValue(values, readKey.option.valueOrder), 
                        void 0 !== readKey.option.keyOrder && _this.sortByRegionKey(values, readKey.option.keyOrder))) : (readStrKey = _this.storageKeyToStringKey(readKey), 
                        (v = allValues[readStrKey]) && (sv = {
                            data: v.data,
                            storageKey: {
                                region: readKey.region,
                                regionKey: readKey.regionKey,
                                userId: readKey.userId,
                                gameId: readKey.gameId
                            }
                        }, null != v.tag && (sv.tag = v.tag), values.push(sv))), results.push(values);
                    }), results;
                }, GameStorage.prototype.clearAll = function() {
                    var _this = this;
                    Object.keys(this._localStorage).forEach(function(key) {
                        0 === key.indexOf("akst:") && _this._localStorage.removeItem(key);
                    });
                }, GameStorage.prototype.createValuesValue = function(current, value, option) {
                    if (!value) return null;
                    if (option && null != option.condition && null != option.comparisonValue && current && null != current.data) {
                        if (option.condition !== g.StorageCondition.Equal) throw new Error("Invalid condition.");
                        if (current.data !== option.comparisonValue) return null;
                    }
                    var result = {
                        data: value.data
                    };
                    return null != value.tag ? result.tag = value.tag : current && null != current.tag && (result.tag = current.tag), 
                    result;
                }, GameStorage.prototype.createScoresValue = function(current, value, option) {
                    if (!value) return null;
                    if (option && null != option.condition && null != option.comparisonValue && current && null != current.data) switch (option.condition) {
                      case g.StorageCondition.Equal:
                        if (current.data !== option.comparisonValue) return null;
                        break;

                      case g.StorageCondition.GreaterThan:
                        if (!(current.data > option.comparisonValue)) return null;
                        break;

                      case g.StorageCondition.LessThan:
                        if (!(current.data < option.comparisonValue)) return null;
                    }
                    var result = {
                        data: value.data
                    };
                    return null != value.tag ? result.tag = value.tag : current && null != current.tag && (result.tag = current.tag), 
                    result;
                }, GameStorage.prototype.createCountsIncrDecrValue = function(current, value, option) {
                    var result = {
                        data: 0
                    }, currentCount = 0;
                    if (current && (currentCount = Number(current.data)), null != option.condition && null != option.comparisonValue) switch (option.condition) {
                      case g.StorageCondition.Equal:
                        if (currentCount !== option.comparisonValue) return current ? null : result;
                        break;

                      case g.StorageCondition.GreaterThan:
                        if (!(currentCount > option.comparisonValue)) return current ? null : result;
                        break;

                      case g.StorageCondition.LessThan:
                        if (!(currentCount < option.comparisonValue)) return current ? null : result;
                    }
                    if (option.operation === g.StorageCountsOperation.Incr) value && null != value.data ? result.data = currentCount + Number(value.data) : result.data = currentCount + 1; else {
                        if (option.operation !== g.StorageCountsOperation.Decr) throw new Error("Unknown StorageCountsOperation");
                        value && null != value.data ? result.data = currentCount - Number(value.data) : result.data = currentCount - 1;
                    }
                    return value && null != value.tag ? result.tag = value.tag : current && null != current.tag && (result.tag = current.tag), 
                    result;
                }, GameStorage.prototype.createCountsValue = function(current, value, option) {
                    if (option) {
                        if (option.operation === g.StorageCountsOperation.Incr || option.operation === g.StorageCountsOperation.Decr) return this.createCountsIncrDecrValue(current, value, option);
                        if (null != option.condition && null != option.comparisonValue && current && null != current.data) switch (option.condition) {
                          case g.StorageCondition.Equal:
                            if (current.data !== option.comparisonValue) return null;
                            break;

                          case g.StorageCondition.GreaterThan:
                            if (!(current.data > option.comparisonValue)) return null;
                            break;

                          case g.StorageCondition.LessThan:
                            if (!(current.data < option.comparisonValue)) return null;
                        }
                    }
                    var result = {
                        data: value.data
                    };
                    return value && null != value.tag ? result.tag = value.tag : current && null != current.tag && (result.tag = current.tag), 
                    result;
                }, GameStorage.prototype.setValue = function(key, value) {
                    this._localStorage.setItem("akst:" + key, JSON.stringify(value));
                }, GameStorage.prototype.getValue = function(key) {
                    return JSON.parse(this._localStorage.getItem("akst:" + key));
                }, GameStorage.prototype.storageKeyToStringKey = function(key) {
                    return (key.region || "") + "/" + (null != key.gameId ? String(key.gameId) : "") + "/" + (null != key.userId ? String(key.userId) : "") + "/" + (key.regionKey || "");
                }, GameStorage.prototype.stringKeyToStorageKey = function(key) {
                    var s = key.split("/"), res = {
                        region: Number(s[0]),
                        regionKey: s[3]
                    };
                    return s[1] && (res.gameId = s[1]), s[2] && (res.userId = s[2]), res;
                }, GameStorage.prototype.storageReadKeyToRegExp = function(key) {
                    var layerKeys, region = key.region || "", gameId = null != key.gameId ? String(key.gameId) : "", userId = null != key.userId ? String(key.userId) : "", regionKey = "";
                    return "*" === userId && (userId = "[0-9]+"), -1 !== key.regionKey.indexOf("*") ? (layerKeys = key.regionKey.split(".")).forEach(function(layerKey, index) {
                        "*" === layerKey ? regionKey += "[.a-z0-9]*" : -1 !== layerKey.indexOf("*") ? regionKey += layerKey.replace("*", "[a-z0-9]*") : regionKey += layerKey, 
                        index !== layerKeys.length - 1 && (regionKey += ".");
                    }) : regionKey = key.regionKey.replace(".", "."), new RegExp("^" + region + "/" + gameId + "/" + userId + "/" + regionKey + "$");
                }, GameStorage.prototype.sortByValue = function(values, order) {
                    values.sort(function(a, b) {
                        var va = a.data, vb = b.data;
                        if (order === g.StorageOrder.Asc) {
                            if (va < vb) return -1;
                            if (vb < va) return 1;
                        } else if (order === g.StorageOrder.Desc) {
                            if (va < vb) return 1;
                            if (vb < va) return -1;
                        }
                        return 0;
                    });
                }, GameStorage.prototype.sortByRegionKey = function(values, order) {
                    values.sort(function(a, b) {
                        var ka = a.storageKey.regionKey, kb = b.storageKey.regionKey;
                        if (order === g.StorageOrder.Asc) {
                            if (ka < kb) return -1;
                            if (kb < ka) return 1;
                        } else if (order === g.StorageOrder.Desc) {
                            if (ka < kb) return 1;
                            if (kb < ka) return -1;
                        }
                        return 0;
                    });
                }, GameStorage.prototype.expandVariables = function(key) {
                    key.gameId && -1 !== key.gameId.indexOf("$gameId") && this._metaData.gameId && (key.gameId = key.gameId.replace(/\$gameId/g, this._metaData.gameId));
                }, GameStorage;
            }();
            exports.GameStorage = GameStorage;
        }, {
            "./validator": 3,
            "@akashic/akashic-engine": "@akashic/akashic-engine"
        } ],
        2: [ function(require, module, exports) {
            "use strict";
            var gs = require("./GameStorage");
            exports.GameStorage = gs.GameStorage;
        }, {
            "./GameStorage": 1
        } ],
        3: [ function(require, module, exports) {
            "use strict";
            var assert = require("assert"), g = require("@akashic/akashic-engine"), REGIONKEY_MAX_LAYER_NUM = 4;
            function validateRegionKey(regionKey, forReading) {
                assert(0 < regionKey.length, "regionKey is empty.");
                var layerKeys = regionKey.split(".");
                assert(layerKeys.length <= REGIONKEY_MAX_LAYER_NUM, "The maximum number of layers in the region key is " + REGIONKEY_MAX_LAYER_NUM + ".");
                for (var hasWildcard = !1, i = 0; i < layerKeys.length; ++i) forReading ? "*" === layerKeys[i] ? (assert(!hasWildcard, "The only one layer of the region key for reading consists of a wildcard character."), 
                hasWildcard = !0) : assert(/^(\*|[a-z])[a-z0-9]{0,31}\*?$/.test(layerKeys[i]), "The layer of the region key for reading must match '^(*|[a-z])[a-z0-9]{0,31}*?$'.") : assert(/^[a-z][a-z0-9]{0,31}$/.test(layerKeys[i]), "The layer of the region key for writing must match '^[a-z][a-z0-9]{0,31}$'.");
            }
            function validateStorageKey(key, forReading) {
                void 0 === forReading && (forReading = !1), assert(key.region === g.StorageRegion.Counts || key.region === g.StorageRegion.Scores || key.region === g.StorageRegion.Values, "Invalid region."), 
                assert(key.regionKey, "regionKey must be set."), validateRegionKey(key.regionKey, forReading), 
                assert(key.gameId || key.userId, "StorageKey must have any one at least from gameId and userId."), 
                null != key.gameId && (assert.equal(typeof key.gameId, "string", "gameId must be a string type."), 
                assert(0 < key.gameId.length, "gameId is empty.")), null != key.userId && (assert.equal(typeof key.userId, "string", "userId must be a string type."), 
                assert(0 < key.userId.length, "userId is empty."), forReading ? "*" === key.userId && (assert(key.gameId, 'gameId for reading must be set when userId is "*".'), 
                assert(-1 === key.regionKey.indexOf("*"), 'regionKey for reading must not include "*" when userId is "*".')) : assert("*" !== key.userId, 'userId for writing must not include "*".'));
            }
            exports.validateRegionKey = validateRegionKey, exports.validateStorageKey = validateStorageKey, 
            exports.validateStorageReadKey = function(key) {
                var opt;
                validateStorageKey(key, !0), null != key.option && (null != (opt = key.option).keyOrder && assert(opt.keyOrder === g.StorageOrder.Asc || opt.keyOrder === g.StorageOrder.Desc, "Invalid keyOrder."), 
                null != opt.valueOrder && assert(opt.valueOrder === g.StorageOrder.Asc || opt.valueOrder === g.StorageOrder.Desc, "Invalid valueOrder."));
            }, exports.validateStorageWriteOption = function(option) {};
        }, {
            "@akashic/akashic-engine": "@akashic/akashic-engine",
            assert: 4
        } ],
        4: [ function(require, module, exports) {
            (function(global) {
                "use strict";
                /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */                function compare(a, b) {
                    if (a === b) return 0;
                    for (var x = a.length, y = b.length, i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
                        x = a[i], y = b[i];
                        break;
                    }
                    return x < y ? -1 : y < x ? 1 : 0;
                }
                function isBuffer(b) {
                    return global.Buffer && "function" == typeof global.Buffer.isBuffer ? global.Buffer.isBuffer(b) : !(null == b || !b._isBuffer);
                }
                // Copyright (c) 2009 Thomas Robinson <280north.com>
                //
                // Permission is hereby granted, free of charge, to any person obtaining a copy
                // of this software and associated documentation files (the 'Software'), to
                // deal in the Software without restriction, including without limitation the
                // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
                // sell copies of the Software, and to permit persons to whom the Software is
                // furnished to do so, subject to the following conditions:
                //
                // The above copyright notice and this permission notice shall be included in
                // all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
                // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
                // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                                var util = require("util/"), hasOwn = Object.prototype.hasOwnProperty, pSlice = Array.prototype.slice, functionsHaveNames = "foo" === function() {}.name;
                function pToString(obj) {
                    return Object.prototype.toString.call(obj);
                }
                function isView(arrbuf) {
                    if (!isBuffer(arrbuf) && "function" == typeof global.ArrayBuffer) {
                        if ("function" == typeof ArrayBuffer.isView) return ArrayBuffer.isView(arrbuf);
                        if (arrbuf) return arrbuf instanceof DataView || !!(arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer);
                    }
                }
                var assert = module.exports = ok, regex = /\s*function\s+([^\(\s]*)\s*/;
                function getName(func) {
                    if (util.isFunction(func)) {
                        if (functionsHaveNames) return func.name;
                        var match = func.toString().match(regex);
                        return match && match[1];
                    }
                }
                function truncate(s, n) {
                    return "string" != typeof s || s.length < n ? s : s.slice(0, n);
                }
                function inspect(something) {
                    if (functionsHaveNames || !util.isFunction(something)) return util.inspect(something);
                    var rawname = getName(something);
                    return "[Function" + (rawname ? ": " + rawname : "") + "]";
                }
                function fail(actual, expected, message, operator, stackStartFunction) {
                    throw new assert.AssertionError({
                        message: message,
                        actual: actual,
                        expected: expected,
                        operator: operator,
                        stackStartFunction: stackStartFunction
                    });
                }
                function ok(value, message) {
                    value || fail(value, !0, message, "==", assert.ok);
                }
                function _deepEqual(actual, expected, strict, memos) {
                    if (actual === expected) return !0;
                    if (isBuffer(actual) && isBuffer(expected)) return 0 === compare(actual, expected);
                    if (util.isDate(actual) && util.isDate(expected)) return actual.getTime() === expected.getTime();
                    if (util.isRegExp(actual) && util.isRegExp(expected)) return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;
                    if (null !== actual && "object" == typeof actual || null !== expected && "object" == typeof expected) {
                        if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) return 0 === compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer));
                        if (isBuffer(actual) !== isBuffer(expected)) return !1;
                        var actualIndex = (memos = memos || {
                            actual: [],
                            expected: []
                        }).actual.indexOf(actual);
                        return -1 !== actualIndex && actualIndex === memos.expected.indexOf(expected) || (memos.actual.push(actual), 
                        memos.expected.push(expected), function(a, b, strict, actualVisitedObjects) {
                            if (null == a || null == b) return !1;
                            if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
                            if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return !1;
                            var aIsArgs = isArguments(a), bIsArgs = isArguments(b);
                            if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return !1;
                            if (aIsArgs) return a = pSlice.call(a), b = pSlice.call(b), _deepEqual(a, b, strict);
                            var key, i, ka = objectKeys(a), kb = objectKeys(b);
                            if (ka.length !== kb.length) return !1;
                            for (ka.sort(), kb.sort(), i = ka.length - 1; 0 <= i; i--) if (ka[i] !== kb[i]) return !1;
                            for (i = ka.length - 1; 0 <= i; i--) if (key = ka[i], !_deepEqual(a[key], b[key], strict, actualVisitedObjects)) return !1;
                            return !0;
                        }(actual, expected, strict, memos));
                    }
                    return strict ? actual === expected : actual == expected;
                }
                function isArguments(object) {
                    return "[object Arguments]" == Object.prototype.toString.call(object);
                }
                function expectedException(actual, expected) {
                    if (actual && expected) {
                        if ("[object RegExp]" == Object.prototype.toString.call(expected)) return expected.test(actual);
                        try {
                            if (actual instanceof expected) return 1;
                        } catch (e) {}
                        if (!Error.isPrototypeOf(expected)) return !0 === expected.call({}, actual);
                    }
                }
                function _throws(shouldThrow, block, expected, message) {
                    var actual;
                    if ("function" != typeof block) throw new TypeError('"block" argument must be a function');
                    "string" == typeof expected && (message = expected, expected = null), actual = function(block) {
                        var error;
                        try {
                            block();
                        } catch (e) {
                            error = e;
                        }
                        return error;
                    }(block), message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : "."), 
                    shouldThrow && !actual && fail(actual, expected, "Missing expected exception" + message);
                    var userProvidedMessage = "string" == typeof message, isUnexpectedException = !shouldThrow && actual && !expected;
                    if ((!shouldThrow && util.isError(actual) && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) && fail(actual, expected, "Got unwanted exception" + message), 
                    shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) throw actual;
                }
                assert.AssertionError = function(options) {
                    var self;
                    this.name = "AssertionError", this.actual = options.actual, this.expected = options.expected, 
                    this.operator = options.operator, options.message ? (this.message = options.message, 
                    this.generatedMessage = !1) : (this.message = truncate(inspect((self = this).actual), 128) + " " + self.operator + " " + truncate(inspect(self.expected), 128), 
                    this.generatedMessage = !0);
                    var err, fn_name, idx, next_line, out, stackStartFunction = options.stackStartFunction || fail;
                    Error.captureStackTrace ? Error.captureStackTrace(this, stackStartFunction) : (err = new Error()).stack && (out = err.stack, 
                    fn_name = getName(stackStartFunction), 0 <= (idx = out.indexOf("\n" + fn_name)) && (next_line = out.indexOf("\n", idx + 1), 
                    out = out.substring(next_line + 1)), this.stack = out);
                }, util.inherits(assert.AssertionError, Error), assert.fail = fail, assert.ok = ok, 
                assert.equal = function(actual, expected, message) {
                    actual != expected && fail(actual, expected, message, "==", assert.equal);
                }, assert.notEqual = function(actual, expected, message) {
                    actual == expected && fail(actual, expected, message, "!=", assert.notEqual);
                }, assert.deepEqual = function(actual, expected, message) {
                    _deepEqual(actual, expected, !1) || fail(actual, expected, message, "deepEqual", assert.deepEqual);
                }, assert.deepStrictEqual = function(actual, expected, message) {
                    _deepEqual(actual, expected, !0) || fail(actual, expected, message, "deepStrictEqual", assert.deepStrictEqual);
                }, assert.notDeepEqual = function(actual, expected, message) {
                    _deepEqual(actual, expected, !1) && fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
                }, assert.notDeepStrictEqual = function notDeepStrictEqual(actual, expected, message) {
                    _deepEqual(actual, expected, !0) && fail(actual, expected, message, "notDeepStrictEqual", notDeepStrictEqual);
                }, assert.strictEqual = function(actual, expected, message) {
                    actual !== expected && fail(actual, expected, message, "===", assert.strictEqual);
                }, assert.notStrictEqual = function(actual, expected, message) {
                    actual === expected && fail(actual, expected, message, "!==", assert.notStrictEqual);
                }, assert.throws = function(block, error, message) {
                    _throws(!0, block, error, message);
                }, assert.doesNotThrow = function(block, error, message) {
                    _throws(!1, block, error, message);
                }, assert.ifError = function(err) {
                    if (err) throw err;
                };
                var objectKeys = Object.keys || function(obj) {
                    var keys = [];
                    for (var key in obj) hasOwn.call(obj, key) && keys.push(key);
                    return keys;
                };
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "util/": 8
        } ],
        5: [ function(require, module, exports) {
            var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
            function defaultSetTimout() {
                throw new Error("setTimeout has not been defined");
            }
            function defaultClearTimeout() {
                throw new Error("clearTimeout has not been defined");
            }
            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
                setTimeout(fun, 0);
                try {
                    return cachedSetTimeout(fun, 0);
                } catch (e) {
                    try {
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch (e) {
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }
            }
            !function() {
                try {
                    cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
                } catch (e) {
                    cachedSetTimeout = defaultSetTimout;
                }
                try {
                    cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
                } catch (e) {
                    cachedClearTimeout = defaultClearTimeout;
                }
            }();
            var currentQueue, queue = [], draining = !1, queueIndex = -1;
            function cleanUpNextTick() {
                draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
                queue.length && drainQueue());
            }
            function drainQueue() {
                if (!draining) {
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = !0;
                    for (var len = queue.length; len; ) {
                        for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                        queueIndex = -1, len = queue.length;
                    }
                    currentQueue = null, draining = !1, function(marker) {
                        if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
                        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
                        clearTimeout(marker);
                        try {
                            cachedClearTimeout(marker);
                        } catch (e) {
                            try {
                                return cachedClearTimeout.call(null, marker);
                            } catch (e) {
                                return cachedClearTimeout.call(this, marker);
                            }
                        }
                    }(timeout);
                }
            }
            function Item(fun, array) {
                this.fun = fun, this.array = array;
            }
            function noop() {}
            process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (1 < arguments.length) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
                queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
            }, Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
            process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
            process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
            process.emit = noop, process.binding = function(name) {
                throw new Error("process.binding is not supported");
            }, process.cwd = function() {
                return "/";
            }, process.chdir = function(dir) {
                throw new Error("process.chdir is not supported");
            }, process.umask = function() {
                return 0;
            };
        }, {} ],
        6: [ function(require, module, exports) {
            "function" == typeof Object.create ? module.exports = function(ctor, superCtor) {
                ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
                    constructor: {
                        value: ctor,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                });
            } : module.exports = function(ctor, superCtor) {
                ctor.super_ = superCtor;
                function TempCtor() {}
                TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor(), ctor.prototype.constructor = ctor;
            };
        }, {} ],
        7: [ function(require, module, exports) {
            module.exports = function(arg) {
                return arg && "object" == typeof arg && "function" == typeof arg.copy && "function" == typeof arg.fill && "function" == typeof arg.readUInt8;
            };
        }, {} ],
        8: [ function(require, module, exports) {
            (function(process, global) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.
                var formatRegExp = /%[sdj%]/g;
                exports.format = function(f) {
                    if (!isString(f)) {
                        for (var objects = [], i = 0; i < arguments.length; i++) objects.push(inspect(arguments[i]));
                        return objects.join(" ");
                    }
                    for (var i = 1, args = arguments, len = args.length, str = String(f).replace(formatRegExp, function(x) {
                        if ("%%" === x) return "%";
                        if (len <= i) return x;
                        switch (x) {
                          case "%s":
                            return String(args[i++]);

                          case "%d":
                            return Number(args[i++]);

                          case "%j":
                            try {
                                return JSON.stringify(args[i++]);
                            } catch (_) {
                                return "[Circular]";
                            }

                          default:
                            return x;
                        }
                    }), x = args[i]; i < len; x = args[++i]) null !== x && isObject(x) ? str += " " + inspect(x) : str += " " + x;
                    return str;
                }, exports.deprecate = function(fn, msg) {
                    if (void 0 === global.process) return function() {
                        return exports.deprecate(fn, msg).apply(this, arguments);
                    };
                    if (!0 === process.noDeprecation) return fn;
                    var warned = !1;
                    return function() {
                        if (!warned) {
                            if (process.throwDeprecation) throw new Error(msg);
                            process.traceDeprecation ? console.trace(msg) : console.error(msg), warned = !0;
                        }
                        return fn.apply(this, arguments);
                    };
                };
                var debugEnviron, debugs = {};
                function inspect(obj, opts) {
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    return 3 <= arguments.length && (ctx.depth = arguments[2]), 4 <= arguments.length && (ctx.colors = arguments[3]), 
                    isBoolean(opts) ? ctx.showHidden = opts : opts && exports._extend(ctx, opts), void 0 === ctx.showHidden && (ctx.showHidden = !1), 
                    void 0 === ctx.depth && (ctx.depth = 2), void 0 === ctx.colors && (ctx.colors = !1), 
                    void 0 === ctx.customInspect && (ctx.customInspect = !0), ctx.colors && (ctx.stylize = stylizeWithColor), 
                    formatValue(ctx, obj, ctx.depth);
                }
                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];
                    return style ? "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m" : str;
                }
                function stylizeNoColor(str, styleType) {
                    return str;
                }
                function formatValue(ctx, value, recurseTimes) {
                    if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && (!value.constructor || value.constructor.prototype !== value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        return isString(ret) || (ret = formatValue(ctx, ret, recurseTimes)), ret;
                    }
                    var primitive = function(ctx, value) {
                        if (void 0 === value) return ctx.stylize("undefined", "undefined");
                        if (isString(value)) {
                            var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                            return ctx.stylize(simple, "string");
                        }
                        if (isNumber(value)) return ctx.stylize("" + value, "number");
                        if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
                        if (null === value) return ctx.stylize("null", "null");
                    }(ctx, value);
                    if (primitive) return primitive;
                    var keys = Object.keys(value), visibleKeys = function(array) {
                        var hash = {};
                        return array.forEach(function(val, idx) {
                            hash[val] = !0;
                        }), hash;
                    }(keys);
                    if (ctx.showHidden && (keys = Object.getOwnPropertyNames(value)), isError(value) && (0 <= keys.indexOf("message") || 0 <= keys.indexOf("description"))) return formatError(value);
                    if (0 === keys.length) {
                        if (isFunction(value)) {
                            var name = value.name ? ": " + value.name : "";
                            return ctx.stylize("[Function" + name + "]", "special");
                        }
                        if (isRegExp(value)) return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                        if (isDate(value)) return ctx.stylize(Date.prototype.toString.call(value), "date");
                        if (isError(value)) return formatError(value);
                    }
                    var output, base = "", array = !1, braces = [ "{", "}" ];
                    return isArray(value) && (array = !0, braces = [ "[", "]" ]), isFunction(value) && (base = " [Function" + (value.name ? ": " + value.name : "") + "]"), 
                    isRegExp(value) && (base = " " + RegExp.prototype.toString.call(value)), isDate(value) && (base = " " + Date.prototype.toUTCString.call(value)), 
                    isError(value) && (base = " " + formatError(value)), 0 !== keys.length || array && 0 != value.length ? recurseTimes < 0 ? isRegExp(value) ? ctx.stylize(RegExp.prototype.toString.call(value), "regexp") : ctx.stylize("[Object]", "special") : (ctx.seen.push(value), 
                    output = array ? function(ctx, value, recurseTimes, visibleKeys, keys) {
                        for (var output = [], i = 0, l = value.length; i < l; ++i) hasOwnProperty(value, String(i)) ? output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), !0)) : output.push("");
                        return keys.forEach(function(key) {
                            key.match(/^\d+$/) || output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, !0));
                        }), output;
                    }(ctx, value, recurseTimes, visibleKeys, keys) : keys.map(function(key) {
                        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                    }), ctx.seen.pop(), function(output, base, braces) {
                        if (60 < output.reduce(function(prev, cur) {
                            return 0 <= cur.indexOf("\n") && 0, prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
                        }, 0)) return braces[0] + ("" === base ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
                        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
                    }(output, base, braces)) : braces[0] + base + braces[1];
                }
                function formatError(value) {
                    return "[" + Error.prototype.toString.call(value) + "]";
                }
                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc = Object.getOwnPropertyDescriptor(value, key) || {
                        value: value[key]
                    };
                    if (desc.get ? str = desc.set ? ctx.stylize("[Getter/Setter]", "special") : ctx.stylize("[Getter]", "special") : desc.set && (str = ctx.stylize("[Setter]", "special")), 
                    hasOwnProperty(visibleKeys, key) || (name = "[" + key + "]"), str || (ctx.seen.indexOf(desc.value) < 0 ? -1 < (str = formatValue(ctx, desc.value, null === recurseTimes ? null : recurseTimes - 1)).indexOf("\n") && (str = array ? str.split("\n").map(function(line) {
                        return "  " + line;
                    }).join("\n").substr(2) : "\n" + str.split("\n").map(function(line) {
                        return "   " + line;
                    }).join("\n")) : str = ctx.stylize("[Circular]", "special")), void 0 === name) {
                        if (array && key.match(/^\d+$/)) return str;
                        name = (name = JSON.stringify("" + key)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (name = name.substr(1, name.length - 2), 
                        ctx.stylize(name, "name")) : (name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), 
                        ctx.stylize(name, "string"));
                    }
                    return name + ": " + str;
                }
                function isArray(ar) {
                    return Array.isArray(ar);
                }
                function isBoolean(arg) {
                    return "boolean" == typeof arg;
                }
                function isNull(arg) {
                    return null === arg;
                }
                function isNumber(arg) {
                    return "number" == typeof arg;
                }
                function isString(arg) {
                    return "string" == typeof arg;
                }
                function isUndefined(arg) {
                    return void 0 === arg;
                }
                function isRegExp(re) {
                    return isObject(re) && "[object RegExp]" === objectToString(re);
                }
                function isObject(arg) {
                    return "object" == typeof arg && null !== arg;
                }
                function isDate(d) {
                    return isObject(d) && "[object Date]" === objectToString(d);
                }
                function isError(e) {
                    return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error);
                }
                function isFunction(arg) {
                    return "function" == typeof arg;
                }
                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
                function pad(n) {
                    return n < 10 ? "0" + n.toString(10) : n.toString(10);
                }
                exports.debuglog = function(set) {
                    var pid;
                    return void 0 === debugEnviron && (debugEnviron = process.env.NODE_DEBUG || ""), 
                    set = set.toUpperCase(), debugs[set] || (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron) ? (pid = process.pid, 
                    debugs[set] = function() {
                        var msg = exports.format.apply(exports, arguments);
                        console.error("%s %d: %s", set, pid, msg);
                    }) : debugs[set] = function() {}), debugs[set];
                }, (exports.inspect = inspect).colors = {
                    bold: [ 1, 22 ],
                    italic: [ 3, 23 ],
                    underline: [ 4, 24 ],
                    inverse: [ 7, 27 ],
                    white: [ 37, 39 ],
                    grey: [ 90, 39 ],
                    black: [ 30, 39 ],
                    blue: [ 34, 39 ],
                    cyan: [ 36, 39 ],
                    green: [ 32, 39 ],
                    magenta: [ 35, 39 ],
                    red: [ 31, 39 ],
                    yellow: [ 33, 39 ]
                }, inspect.styles = {
                    special: "cyan",
                    number: "yellow",
                    boolean: "yellow",
                    undefined: "grey",
                    null: "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                }, exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, 
                exports.isNullOrUndefined = function(arg) {
                    return null == arg;
                }, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = function(arg) {
                    return "symbol" == typeof arg;
                }, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, 
                exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, 
                exports.isPrimitive = function(arg) {
                    return null === arg || "boolean" == typeof arg || "number" == typeof arg || "string" == typeof arg || "symbol" == typeof arg || void 0 === arg;
                }, exports.isBuffer = require("./support/isBuffer");
                var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }
                exports.log = function() {
                    var d, time;
                    console.log("%s - %s", (d = new Date(), time = [ pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds()) ].join(":"), 
                    [ d.getDate(), months[d.getMonth()], time ].join(" ")), exports.format.apply(exports, arguments));
                }, exports.inherits = require("inherits"), exports._extend = function(origin, add) {
                    if (!add || !isObject(add)) return origin;
                    for (var keys = Object.keys(add), i = keys.length; i--; ) origin[keys[i]] = add[keys[i]];
                    return origin;
                };
            }).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./support/isBuffer": 7,
            _process: 5,
            inherits: 6
        } ]
    }, {}, [ 2 ])(2);
});