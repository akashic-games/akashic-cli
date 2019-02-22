require = function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function(r) {
                    var n = e[i][1][r];
                    return o(n || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    }
    return r;
}()({
    1: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), Clock = function() {
            function Clock(param) {
                this.fps = param.fps, this.scaleFactor = param.scaleFactor || 1, this.frameTrigger = new g.Trigger(), 
                this.rawFrameTrigger = new g.Trigger(), this._platform = param.platform, this._maxFramePerOnce = param.maxFramePerOnce, 
                this._deltaTimeBrokenThreshold = param.deltaTimeBrokenThreshold || Clock.DEFAULT_DELTA_TIME_BROKEN_THRESHOLD, 
                param.frameHandler && this.frameTrigger.handle(param.frameHandlerOwner, param.frameHandler), 
                this.running = !1, this._totalDeltaTime = 0, this._onLooperCall_bound = this._onLooperCall.bind(this), 
                this._looper = this._platform.createLooper(this._onLooperCall_bound), this._waitTime = 0, 
                this._waitTimeDoubled = 0, this._waitTimeMax = 0, this._skipFrameWaitTime = 0, this._realMaxFramePerOnce = 0;
            }
            return Clock.prototype.start = function() {
                this.running || (this._totalDeltaTime = 0, this._updateWaitTimes(this.fps, this.scaleFactor), 
                this._looper.start(), this.running = !0);
            }, Clock.prototype.stop = function() {
                this.running && (this._looper.stop(), this.running = !1);
            }, Clock.prototype.changeScaleFactor = function(scaleFactor) {
                this.running ? (this.stop(), this.scaleFactor = scaleFactor, this.start()) : this.scaleFactor = scaleFactor;
            }, Clock.prototype._onLooperCall = function(deltaTime) {
                if (0 >= deltaTime) return this._waitTime - this._totalDeltaTime;
                deltaTime > this._deltaTimeBrokenThreshold && (deltaTime = this._waitTime);
                var totalDeltaTime = this._totalDeltaTime;
                if (totalDeltaTime += deltaTime, totalDeltaTime <= this._skipFrameWaitTime) return this._totalDeltaTime = totalDeltaTime, 
                this._waitTime - totalDeltaTime;
                for (var frameCount = totalDeltaTime < this._waitTimeDoubled ? 1 : totalDeltaTime > this._waitTimeMax ? this._realMaxFramePerOnce : totalDeltaTime / this._waitTime | 0, fc = frameCount, arg = {
                    interrupt: !1
                }; fc > 0 && this.running && !arg.interrupt; ) --fc, this.frameTrigger.fire(arg);
                return totalDeltaTime -= (frameCount - fc) * this._waitTime, this.rawFrameTrigger.fire(), 
                this._totalDeltaTime = totalDeltaTime, this._waitTime - totalDeltaTime;
            }, Clock.prototype._updateWaitTimes = function(fps, scaleFactor) {
                var realFps = fps * scaleFactor;
                this._waitTime = 1e3 / realFps, this._waitTimeDoubled = Math.max(2e3 / realFps | 0, 1), 
                this._waitTimeMax = Math.max(scaleFactor * (1e3 * this._maxFramePerOnce / realFps) | 0, 1), 
                this._skipFrameWaitTime = this._waitTime * Clock.ANTICIPATE_RATE | 0, this._realMaxFramePerOnce = this._maxFramePerOnce * scaleFactor;
            }, Clock.ANTICIPATE_RATE = .8, Clock.DEFAULT_DELTA_TIME_BROKEN_THRESHOLD = 150, 
            Clock;
        }();
        exports.Clock = Clock;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    2: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = (require("@akashic/akashic-pdi"), require("@akashic/akashic-engine")), PointEventResolver_1 = require("./PointEventResolver"), EventBuffer = function() {
            function EventBuffer(param) {
                this._amflow = param.amflow, this._isLocalReceiver = !0, this._isReceiver = !1, 
                this._isSender = !1, this._isDiscarder = !1, this._defaultEventPriority = 0, this._buffer = null, 
                this._joinLeaveBuffer = null, this._localBuffer = null, this._filters = null, this._unfilteredLocalEvents = [], 
                this._unfilteredEvents = [], this._unfilteredJoinLeaves = [], this._pointEventResolver = new PointEventResolver_1.PointEventResolver({
                    game: param.game
                }), this._onEvent_bound = this.onEvent.bind(this);
            }
            return EventBuffer.isEventLocal = function(pev) {
                switch (pev[0]) {
                  case 0:
                    return pev[5];

                  case 1:
                    return pev[3];

                  case 2:
                    return pev[4];

                  case 32:
                    return pev[4];

                  case 33:
                    return pev[7];

                  case 34:
                    return pev[11];

                  case 35:
                    return pev[11];

                  case 64:
                    return pev[5];

                  default:
                    throw g.ExceptionFactory.createAssertionError("EventBuffer.isEventLocal");
                }
            }, EventBuffer.prototype.setMode = function(param) {
                null != param.isLocalReceiver && (this._isLocalReceiver = param.isLocalReceiver), 
                null != param.isReceiver && this._isReceiver !== param.isReceiver && (this._isReceiver = param.isReceiver, 
                param.isReceiver ? this._amflow.onEvent(this._onEvent_bound) : this._amflow.offEvent(this._onEvent_bound)), 
                null != param.isSender && (this._isSender = param.isSender), null != param.isDiscarder && (this._isDiscarder = param.isDiscarder), 
                null != param.defaultEventPriority && (this._defaultEventPriority = param.defaultEventPriority);
            }, EventBuffer.prototype.getMode = function() {
                return {
                    isLocalReceiver: this._isLocalReceiver,
                    isReceiver: this._isReceiver,
                    isSender: this._isSender,
                    isDiscarder: this._isDiscarder,
                    defaultEventPriority: this._defaultEventPriority
                };
            }, EventBuffer.prototype.onEvent = function(pev) {
                return EventBuffer.isEventLocal(pev) ? void (this._isLocalReceiver && !this._isDiscarder && this._unfilteredLocalEvents.push(pev)) : (this._isReceiver && !this._isDiscarder && (0 === pev[0] || 1 === pev[0] ? this._unfilteredJoinLeaves.push(pev) : this._unfilteredEvents.push(pev)), 
                void (this._isSender && (null == pev[1] && (pev[1] = this._defaultEventPriority), 
                this._amflow.sendEvent(pev))));
            }, EventBuffer.prototype.onPointEvent = function(e) {
                var pev;
                switch (e.type) {
                  case 0:
                    pev = this._pointEventResolver.pointDown(e);
                    break;

                  case 1:
                    pev = this._pointEventResolver.pointMove(e);
                    break;

                  case 2:
                    pev = this._pointEventResolver.pointUp(e);
                }
                pev && this.onEvent(pev);
            }, EventBuffer.prototype.addEventDirect = function(pev) {
                if (EventBuffer.isEventLocal(pev)) {
                    if (!this._isLocalReceiver || this._isDiscarder) return;
                    return void (this._localBuffer ? this._localBuffer.push(pev) : this._localBuffer = [ pev ]);
                }
                this._isReceiver && !this._isDiscarder && (0 === pev[0] || 1 === pev[0] ? this._joinLeaveBuffer ? this._joinLeaveBuffer.push(pev) : this._joinLeaveBuffer = [ pev ] : this._buffer ? this._buffer.push(pev) : this._buffer = [ pev ]), 
                this._isSender && (null == pev[1] && (pev[1] = this._defaultEventPriority), this._amflow.sendEvent(pev));
            }, EventBuffer.prototype.readEvents = function() {
                var ret = this._buffer;
                return this._buffer = null, ret;
            }, EventBuffer.prototype.readJoinLeaves = function() {
                var ret = this._joinLeaveBuffer;
                return this._joinLeaveBuffer = null, ret;
            }, EventBuffer.prototype.readLocalEvents = function() {
                var ret = this._localBuffer;
                return this._localBuffer = null, ret;
            }, EventBuffer.prototype.addFilter = function(filter, handleEmpty) {
                this._filters || (this._filters = []), this._filters.push({
                    func: filter,
                    handleEmpty: !!handleEmpty
                });
            }, EventBuffer.prototype.removeFilter = function(filter) {
                if (this._filters) {
                    if (!filter) return void (this._filters = null);
                    for (var i = this._filters.length - 1; i >= 0; --i) this._filters[i].func === filter && this._filters.splice(i, 1);
                }
            }, EventBuffer.prototype.processEvents = function() {
                var lpevs = this._unfilteredLocalEvents, pevs = this._unfilteredEvents, joins = this._unfilteredJoinLeaves;
                if (!this._filters) return lpevs.length > 0 && (this._unfilteredLocalEvents = [], 
                this._localBuffer = this._localBuffer ? this._localBuffer.concat(lpevs) : lpevs), 
                pevs.length > 0 && (this._unfilteredEvents = [], this._buffer = this._buffer ? this._buffer.concat(pevs) : pevs), 
                void (joins.length > 0 && (this._unfilteredJoinLeaves = [], this._joinLeaveBuffer = this._joinLeaveBuffer ? this._joinLeaveBuffer.concat(joins) : joins));
                if (0 === lpevs.length && 0 === pevs.length && 0 === joins.length) for (var i = 0; i < this._filters.length; ++i) if (this._filters[i].handleEmpty) {
                    var gpevs = this._filters[i].func([]);
                    if (gpevs) for (var j = 0; j < gpevs.length; ++j) {
                        var pev = gpevs[j];
                        EventBuffer.isEventLocal(pev) ? lpevs.push(pev) : 0 === pev[0] || 1 === pev[0] ? joins.push(pev) : pevs.push(pev);
                    }
                }
                if (lpevs.length > 0) {
                    this._unfilteredLocalEvents = [];
                    for (var i = 0; i < this._filters.length && (lpevs = this._filters[i].func(lpevs), 
                    lpevs); ++i) ;
                    lpevs && lpevs.length > 0 && (this._localBuffer = this._localBuffer ? this._localBuffer.concat(lpevs) : lpevs);
                }
                if (pevs.length > 0) {
                    this._unfilteredEvents = [];
                    for (var i = 0; i < this._filters.length && (pevs = this._filters[i].func(pevs), 
                    pevs); ++i) ;
                    pevs && pevs.length > 0 && (this._buffer = this._buffer ? this._buffer.concat(pevs) : pevs);
                }
                if (joins.length > 0) {
                    this._unfilteredJoinLeaves = [];
                    for (var i = 0; i < this._filters.length && joins && joins.length > 0 && (joins = this._filters[i].func(joins), 
                    joins); ++i) ;
                    joins && joins.length > 0 && (this._joinLeaveBuffer = this._joinLeaveBuffer ? this._joinLeaveBuffer.concat(joins) : joins);
                }
            }, EventBuffer;
        }();
        exports.EventBuffer = EventBuffer;
    }, {
        "./PointEventResolver": 13,
        "@akashic/akashic-engine": "@akashic/akashic-engine",
        "@akashic/akashic-pdi": 22
    } ],
    3: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), EventConverter = function() {
            function EventConverter(param) {
                this._game = param.game, this._playerTable = {};
            }
            return EventConverter.prototype.toGameEvent = function(pev) {
                var pointerId, entityId, target, point, startDelta, prevDelta, local, timestamp, eventCode = pev[0], prio = pev[1], playerId = pev[2], player = this._playerTable[playerId] || {
                    id: playerId
                };
                switch (eventCode) {
                  case 0:
                    player = {
                        id: playerId,
                        name: pev[3]
                    }, this._playerTable[playerId] = player;
                    var store = void 0;
                    if (pev[4]) {
                        var keys = [], values = [];
                        pev[4].map(function(data) {
                            keys.push(data.readKey), values.push(data.values);
                        }), store = new g.StorageValueStore(keys, values);
                    }
                    return new g.JoinEvent(player, store, prio);

                  case 1:
                    return delete this._playerTable[player.id], new g.LeaveEvent(player, prio);

                  case 2:
                    return timestamp = pev[3], new g.TimestampEvent(timestamp, player, prio);

                  case 32:
                    return local = pev[4], new g.MessageEvent(pev[3], player, local, prio);

                  case 33:
                    return local = pev[7], pointerId = pev[3], entityId = pev[6], target = null == entityId ? void 0 : entityId >= 0 ? this._game.db[entityId] : this._game._localDb[entityId], 
                    point = {
                        x: pev[4],
                        y: pev[5]
                    }, new g.PointDownEvent(pointerId, target, point, player, local, prio);

                  case 34:
                    return local = pev[11], pointerId = pev[3], entityId = pev[10], target = null == entityId ? void 0 : entityId >= 0 ? this._game.db[entityId] : this._game._localDb[entityId], 
                    point = {
                        x: pev[4],
                        y: pev[5]
                    }, startDelta = {
                        x: pev[6],
                        y: pev[7]
                    }, prevDelta = {
                        x: pev[8],
                        y: pev[9]
                    }, new g.PointMoveEvent(pointerId, target, point, prevDelta, startDelta, player, local, prio);

                  case 35:
                    return local = pev[11], pointerId = pev[3], entityId = pev[10], target = null == entityId ? void 0 : entityId >= 0 ? this._game.db[entityId] : this._game._localDb[entityId], 
                    point = {
                        x: pev[4],
                        y: pev[5]
                    }, startDelta = {
                        x: pev[6],
                        y: pev[7]
                    }, prevDelta = {
                        x: pev[8],
                        y: pev[9]
                    }, new g.PointUpEvent(pointerId, target, point, prevDelta, startDelta, player, local, prio);

                  case 64:
                    local = pev[5];
                    var operationCode = pev[3], operationData = pev[4], decodedData = this._game._decodeOperationPluginOperation(operationCode, operationData);
                    return new g.OperationEvent(operationCode, decodedData, player, local, prio);

                  default:
                    throw g.ExceptionFactory.createAssertionError("EventConverter#toGameEvent");
                }
            }, EventConverter.prototype.toPlaylogEvent = function(e, preservePlayer) {
                var targetId, playerId;
                switch (e.type) {
                  case g.EventType.Join:
                  case g.EventType.Leave:
                    throw g.ExceptionFactory.createAssertionError("EventConverter#toPlaylogEvent: Invalid type: " + g.EventType[e.type]);

                  case g.EventType.Timestamp:
                    var ts = e;
                    return playerId = preservePlayer ? ts.player.id : this._game.player.id, [ 2, ts.priority, playerId, ts.timestamp ];

                  case g.EventType.PointDown:
                    var pointDown = e;
                    return targetId = pointDown.target ? pointDown.target.id : null, playerId = preservePlayer ? pointDown.player.id : this._game.player.id, 
                    [ 33, pointDown.priority, playerId, pointDown.pointerId, pointDown.point.x, pointDown.point.y, targetId, !!pointDown.local ];

                  case g.EventType.PointMove:
                    var pointMove = e;
                    return targetId = pointMove.target ? pointMove.target.id : null, playerId = preservePlayer ? pointMove.player.id : this._game.player.id, 
                    [ 34, pointMove.priority, playerId, pointMove.pointerId, pointMove.point.x, pointMove.point.y, pointMove.startDelta.x, pointMove.startDelta.y, pointMove.prevDelta.x, pointMove.prevDelta.y, targetId, !!pointMove.local ];

                  case g.EventType.PointUp:
                    var pointUp = e;
                    return targetId = pointUp.target ? pointUp.target.id : null, playerId = preservePlayer ? pointUp.player.id : this._game.player.id, 
                    [ 35, pointUp.priority, playerId, pointUp.pointerId, pointUp.point.x, pointUp.point.y, pointUp.startDelta.x, pointUp.startDelta.y, pointUp.prevDelta.x, pointUp.prevDelta.y, targetId, !!pointUp.local ];

                  case g.EventType.Message:
                    var message = e;
                    return playerId = preservePlayer ? message.player.id : this._game.player.id, [ 32, message.priority, playerId, message.data, !!message.local ];

                  case g.EventType.Operation:
                    var op = e;
                    return playerId = preservePlayer ? op.player.id : this._game.player.id, [ 64, op.priority, playerId, op.code, op.data, !!op.local ];

                  default:
                    throw g.ExceptionFactory.createAssertionError("Unknown type: " + e.type);
                }
            }, EventConverter.prototype.makePlaylogOperationEvent = function(op) {
                var playerId = this._game.player.id, priority = null != op.priority ? op.priority : 0;
                return [ 64, priority, playerId, op._code, op.data, !!op.local ];
            }, EventConverter;
        }();
        exports.EventConverter = EventConverter;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    4: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, {} ],
    5: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var ExecutionMode;
        !function(ExecutionMode) {
            ExecutionMode[ExecutionMode.Active = 0] = "Active", ExecutionMode[ExecutionMode.Passive = 1] = "Passive";
        }(ExecutionMode || (ExecutionMode = {})), exports["default"] = ExecutionMode;
    }, {} ],
    6: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), Game = function(_super) {
            function Game(param) {
                var _this = _super.call(this, param.configuration, param.resourceFactory, param.assetBase, param.player.id, param.operationPluginViewInfo) || this;
                return _this.agePassedTrigger = new g.Trigger(), _this.skippingChangedTrigger = new g.Trigger(), 
                _this.abortTrigger = new g.Trigger(), _this.player = param.player, _this.raiseEventTrigger = new g.Trigger(), 
                _this.raiseTickTrigger = new g.Trigger(), _this.snapshotTrigger = new g.Trigger(), 
                _this.isSnapshotSaver = !!param.isSnapshotSaver, _this._getCurrentTimeFunc = null, 
                _this._eventFilterFuncs = null, _this._notifyPassedAgeTable = {}, _this._gameArgs = param.gameArgs, 
                _this._globalGameArgs = param.globalGameArgs, _this;
            }
            return __extends(Game, _super), Game.prototype.requestNotifyAgePassed = function(age) {
                this._notifyPassedAgeTable[age] = !0;
            }, Game.prototype.cancelNotifyAgePassed = function(age) {
                delete this._notifyPassedAgeTable[age];
            }, Game.prototype.fireAgePassedIfNeeded = function() {
                var age = this.age - 1;
                return this._notifyPassedAgeTable[age] ? (delete this._notifyPassedAgeTable[age], 
                this.agePassedTrigger.fire(age), !0) : !1;
            }, Game.prototype.setCurrentTimeFunc = function(fun) {
                this._getCurrentTimeFunc = fun;
            }, Game.prototype.setEventFilterFuncs = function(funcs) {
                this._eventFilterFuncs = funcs;
            }, Game.prototype.setStorageFunc = function(funcs) {
                this.storage._registerLoad(funcs.storageGetFunc), this.storage._registerWrite(funcs.storagePutFunc), 
                this.storage.requestValuesForJoinPlayer = funcs.requestValuesForJoinFunc;
            }, Game.prototype.raiseEvent = function(event) {
                this.raiseEventTrigger.fire(event);
            }, Game.prototype.raiseTick = function(events) {
                if (!this.scene() || this.scene().tickGenerationMode !== g.TickGenerationMode.Manual) throw g.ExceptionFactory.createAssertionError("Game#raiseTick(): tickGenerationMode for the current scene is not Manual.");
                this.raiseTickTrigger.fire(events);
            }, Game.prototype.addEventFilter = function(filter, handleEmpty) {
                this._eventFilterFuncs.addFilter(filter, handleEmpty);
            }, Game.prototype.removeEventFilter = function(filter) {
                this._eventFilterFuncs.removeFilter(filter);
            }, Game.prototype.shouldSaveSnapshot = function() {
                return this.isSnapshotSaver;
            }, Game.prototype.saveSnapshot = function(gameSnapshot, timestamp) {
                void 0 === timestamp && (timestamp = this._getCurrentTimeFunc()), this.shouldSaveSnapshot() && this.snapshotTrigger.fire({
                    frame: this.age,
                    timestamp: timestamp,
                    data: {
                        randGenSer: this.random[0].serialize(),
                        gameSnapshot: gameSnapshot
                    }
                });
            }, Game.prototype._destroy = function() {
                this.agePassedTrigger.destroy(), this.agePassedTrigger = null, this.skippingChangedTrigger.destroy(), 
                this.skippingChangedTrigger = null, this.abortTrigger.destroy(), this.abortTrigger = null, 
                this.player = null, this.raiseEventTrigger.destroy(), this.raiseEventTrigger = null, 
                this.raiseTickTrigger.destroy(), this.raiseTickTrigger = null, this.snapshotTrigger.destroy(), 
                this.snapshotTrigger = null, this.isSnapshotSaver = !1, this._getCurrentTimeFunc = null, 
                this._eventFilterFuncs = null, this._notifyPassedAgeTable = null, this._gameArgs = null, 
                this._globalGameArgs = null, _super.prototype._destroy.call(this);
            }, Game.prototype._restartWithSnapshot = function(snapshot) {
                var data = snapshot.data;
                if (this._eventFilterFuncs.removeFilter(), null != data.seed) {
                    var randGen = new g.XorshiftRandomGenerator(data.seed);
                    this._reset({
                        age: snapshot.frame,
                        randGen: randGen
                    }), this._loadAndStart({
                        args: this._gameArgs,
                        globalArgs: this._globalGameArgs
                    });
                } else {
                    var randGen = new g.XorshiftRandomGenerator(0, data.randGenSer);
                    this._reset({
                        age: snapshot.frame,
                        randGen: randGen
                    }), this._loadAndStart({
                        snapshot: data.gameSnapshot
                    });
                }
            }, Game.prototype._leaveGame = function() {}, Game.prototype._terminateGame = function() {
                this.abortTrigger.fire();
            }, Game;
        }(g.Game);
        exports.Game = Game;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    7: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var es6_promise_1 = require("es6-promise"), g = require("@akashic/akashic-engine"), ExecutionMode_1 = require("./ExecutionMode"), Game_1 = require("./Game"), EventBuffer_1 = require("./EventBuffer"), GameLoop_1 = require("./GameLoop"), PdiUtil_1 = require("./PdiUtil"), GameDriver = function() {
            function GameDriver(param) {
                this.errorTrigger = new g.Trigger(), param.errorHandler && this.errorTrigger.handle(param.errorHandlerOwner, param.errorHandler), 
                this.configurationLoadedTrigger = new g.Trigger(), this.gameCreatedTrigger = new g.Trigger(), 
                this._platform = param.platform, this._loadConfigurationFunc = PdiUtil_1.PdiUtil.makeLoadConfigurationFunc(param.platform), 
                this._player = param.player, this._rendererRequirement = null, this._playId = null, 
                this._game = null, this._gameLoop = null, this._eventBuffer = null, this._openedAmflow = !1, 
                this._playToken = null, this._permission = null, this._hidden = !1;
            }
            return GameDriver.prototype.initialize = function(param, callback) {
                this.doInitialize(param).then(function() {
                    callback();
                }, callback);
            }, GameDriver.prototype.changeState = function(param, callback) {
                var _this = this, pausing = this._gameLoop && this._gameLoop.running;
                pausing && this._gameLoop.stop(), this.initialize(param, function(err) {
                    return err ? void callback(err) : (pausing && _this._gameLoop.start(), void callback());
                });
            }, GameDriver.prototype.startGame = function() {
                return this._gameLoop ? void this._gameLoop.start() : void this.errorTrigger.fire(new Error("Not initialized"));
            }, GameDriver.prototype.stopGame = function() {
                this._gameLoop && this._gameLoop.stop();
            }, GameDriver.prototype.setNextAge = function(age) {
                this._gameLoop.setNextAge(age);
            }, GameDriver.prototype.getPermission = function() {
                return this._permission;
            }, GameDriver.prototype.getDriverConfiguration = function() {
                return {
                    playId: this._playId,
                    playToken: this._playToken,
                    executionMode: this._gameLoop ? this._gameLoop.getExecutionMode() : void 0,
                    eventBufferMode: this._eventBuffer ? this._eventBuffer.getMode() : void 0
                };
            }, GameDriver.prototype.getLoopConfiguration = function() {
                return this._gameLoop ? this._gameLoop.getLoopConfiguration() : null;
            }, GameDriver.prototype.getHidden = function() {
                return this._hidden;
            }, GameDriver.prototype.resetPrimarySurface = function(width, height, rendererCandidates) {
                rendererCandidates = rendererCandidates ? rendererCandidates : this._rendererRequirement ? this._rendererRequirement.rendererCandidates : null;
                var game = this._game, pf = this._platform, primarySurface = pf.getPrimarySurface();
                game.renderers = game.renderers.filter(function(renderer) {
                    return renderer !== primarySurface.renderer();
                }), pf.setRendererRequirement({
                    primarySurfaceWidth: width,
                    primarySurfaceHeight: height,
                    rendererCandidates: rendererCandidates
                }), this._rendererRequirement = {
                    primarySurfaceWidth: width,
                    primarySurfaceHeight: height,
                    rendererCandidates: rendererCandidates
                }, game.renderers.push(pf.getPrimarySurface().renderer()), game.width = width, game.height = height, 
                game.resized.fire({
                    width: width,
                    height: height
                }), game.modified = !0;
            }, GameDriver.prototype.doInitialize = function(param) {
                var _this = this, p = new es6_promise_1.Promise(function(resolve, reject) {
                    return _this._gameLoop && _this._gameLoop.running ? reject(new Error("Game is running. Must be stopped.")) : (_this._gameLoop && param.loopConfiguration && _this._gameLoop.setLoopConfiguration(param.loopConfiguration), 
                    null != param.hidden && (_this._hidden = param.hidden, _this._game && _this._game._setMuted(param.hidden)), 
                    void resolve());
                }).then(function() {
                    return _this._doSetDriverConfiguration(param.driverConfiguration);
                });
                return param.configurationUrl ? p.then(function() {
                    return _this._loadConfiguration(param.configurationUrl, param.assetBase, param.configurationBase);
                }).then(function(conf) {
                    return _this._createGame(conf, _this._player, param);
                }) : p;
            }, GameDriver.prototype.destroy = function() {
                var _this = this;
                return new es6_promise_1.Promise(function(resolve, reject) {
                    _this.stopGame(), _this._game && (_this._game._destroy(), _this._game = null), _this.errorTrigger.destroy(), 
                    _this.errorTrigger = null, _this.configurationLoadedTrigger.destroy(), _this.configurationLoadedTrigger = null, 
                    _this.gameCreatedTrigger.destroy(), _this.gameCreatedTrigger = null, _this._platform.setRendererRequirement(void 0), 
                    _this._platform = null, _this._loadConfigurationFunc = null, _this._player = null, 
                    _this._rendererRequirement = null, _this._playId = null, _this._gameLoop = null, 
                    _this._eventBuffer = null, _this._openedAmflow = !1, _this._playToken = null, _this._permission = null, 
                    _this._hidden = !1, resolve();
                });
            }, GameDriver.prototype._doSetDriverConfiguration = function(dconf) {
                var _this = this;
                if (null == dconf) return es6_promise_1.Promise.resolve();
                void 0 === dconf.playId && (dconf.playId = this._playId), void 0 === dconf.playToken && (dconf.playToken = this._playToken), 
                void 0 === dconf.eventBufferMode && (dconf.executionMode === ExecutionMode_1["default"].Active ? dconf.eventBufferMode = {
                    isReceiver: !0,
                    isSender: !1
                } : dconf.executionMode === ExecutionMode_1["default"].Passive && (dconf.eventBufferMode = {
                    isReceiver: !1,
                    isSender: !0
                }));
                var p = es6_promise_1.Promise.resolve();
                return this._playId !== dconf.playId && (p = p.then(function() {
                    return _this._doOpenAmflow(dconf.playId);
                })), this._playToken !== dconf.playToken && (p = p.then(function() {
                    return _this._doAuthenticate(dconf.playToken);
                })), p.then(function() {
                    return new es6_promise_1.Promise(function(resolve, reject) {
                        null != dconf.eventBufferMode && (null == dconf.eventBufferMode.defaultEventPriority && (dconf.eventBufferMode.defaultEventPriority = _this._permission.maxEventPriority), 
                        _this._eventBuffer && _this._eventBuffer.setMode(dconf.eventBufferMode)), null != dconf.executionMode && _this._gameLoop && _this._gameLoop.setExecutionMode(dconf.executionMode), 
                        resolve();
                    });
                });
            }, GameDriver.prototype._doCloseAmflow = function() {
                var _this = this;
                return new es6_promise_1.Promise(function(resolve, reject) {
                    return _this._openedAmflow ? void _this._platform.amflow.close(function(err) {
                        return _this._openedAmflow = !1, err ? reject(err) : void resolve();
                    }) : resolve();
                });
            }, GameDriver.prototype._doOpenAmflow = function(playId) {
                var _this = this;
                if (void 0 === playId) return es6_promise_1.Promise.resolve();
                var p = this._doCloseAmflow();
                return p.then(function() {
                    return new es6_promise_1.Promise(function(resolve, reject) {
                        return null === playId ? resolve() : void _this._platform.amflow.open(playId, function(err) {
                            return err ? reject(err) : (_this._openedAmflow = !0, _this._playId = playId, _this._game && _this._updateGamePlayId(_this._game), 
                            void resolve());
                        });
                    });
                });
            }, GameDriver.prototype._doAuthenticate = function(playToken) {
                var _this = this;
                return null == playToken ? es6_promise_1.Promise.resolve() : new es6_promise_1.Promise(function(resolve, reject) {
                    _this._platform.amflow.authenticate(playToken, function(err, permission) {
                        return err ? reject(err) : (_this._playToken = playToken, _this._permission = permission, 
                        _this._game && (_this._game.isSnapshotSaver = _this._permission.writeTick), void resolve());
                    });
                });
            }, GameDriver.prototype._loadConfiguration = function(configurationUrl, assetBase, configurationBase) {
                var _this = this;
                return new es6_promise_1.Promise(function(resolve, reject) {
                    _this._loadConfigurationFunc(configurationUrl, assetBase, configurationBase, function(err, conf) {
                        return err ? reject(err) : (_this.configurationLoadedTrigger.fire(conf), void resolve(conf));
                    });
                });
            }, GameDriver.prototype._putZerothStartPoint = function(data) {
                var _this = this;
                return new es6_promise_1.Promise(function(resolve, reject) {
                    var zerothStartPoint = {
                        frame: 0,
                        timestamp: 0,
                        data: data
                    };
                    _this._platform.amflow.putStartPoint(zerothStartPoint, function(err) {
                        return err ? reject(err) : void resolve();
                    });
                });
            }, GameDriver.prototype._getZerothStartPointData = function() {
                var _this = this;
                return new es6_promise_1.Promise(function(resolve, reject) {
                    _this._platform.amflow.getStartPoint({
                        frame: 0
                    }, function(err, startPoint) {
                        if (err) return reject(err);
                        var data = startPoint.data;
                        return "number" != typeof data.seed ? reject(new Error("GameDriver#_getRandomSeed: No seed found.")) : void resolve(data);
                    });
                });
            }, GameDriver.prototype._createGame = function(conf, player, param) {
                var p, _this = this, putSeed = param.driverConfiguration.executionMode === ExecutionMode_1["default"].Active && this._permission.writeTick;
                return p = putSeed ? this._putZerothStartPoint({
                    seed: Date.now(),
                    globalArgs: param.globalGameArgs,
                    fps: conf.fps,
                    startedAt: Date.now()
                }) : es6_promise_1.Promise.resolve(), p = p.then(function() {
                    return _this._getZerothStartPointData();
                }), p.then(function(zerothData) {
                    var pf = _this._platform, driverConf = param.driverConfiguration || {
                        eventBufferMode: {
                            isReceiver: !0,
                            isSender: !1
                        },
                        executionMode: ExecutionMode_1["default"].Active
                    }, seed = zerothData.seed, args = param.gameArgs, globalArgs = zerothData.globalArgs, startedAt = zerothData.startedAt, rendererRequirement = {
                        primarySurfaceWidth: conf.width,
                        primarySurfaceHeight: conf.height,
                        rendererCandidates: conf.renderers
                    };
                    pf.setRendererRequirement(rendererRequirement);
                    var game = new Game_1.Game({
                        configuration: conf,
                        player: player,
                        resourceFactory: pf.getResourceFactory(),
                        assetBase: param.assetBase,
                        isSnapshotSaver: _this._permission.writeTick,
                        operationPluginViewInfo: pf.getOperationPluginViewInfo ? pf.getOperationPluginViewInfo() : null,
                        gameArgs: args,
                        globalGameArgs: globalArgs
                    }), eventBuffer = new EventBuffer_1.EventBuffer({
                        game: game,
                        amflow: pf.amflow
                    });
                    eventBuffer.setMode(driverConf.eventBufferMode), pf.setPlatformEventHandler(eventBuffer), 
                    game.setEventFilterFuncs({
                        addFilter: eventBuffer.addFilter.bind(eventBuffer),
                        removeFilter: eventBuffer.removeFilter.bind(eventBuffer)
                    }), game.renderers.push(pf.getPrimarySurface().renderer());
                    var gameLoop = new GameLoop_1.GameLoop({
                        game: game,
                        amflow: pf.amflow,
                        platform: pf,
                        executionMode: driverConf.executionMode,
                        eventBuffer: eventBuffer,
                        configuration: param.loopConfiguration,
                        startedAt: startedAt,
                        profiler: param.profiler
                    });
                    game.setCurrentTimeFunc(gameLoop.getCurrentTime.bind(gameLoop)), game._reset({
                        age: 0,
                        randGen: new g.XorshiftRandomGenerator(seed)
                    }), _this._updateGamePlayId(game), _this._hidden && game._setMuted(!0), game.snapshotTrigger.handle(function(startPoint) {
                        _this._platform.amflow.putStartPoint(startPoint, function(err) {
                            err && _this.errorTrigger.fire(err);
                        });
                    }), _this._game = game, _this._eventBuffer = eventBuffer, _this._gameLoop = gameLoop, 
                    _this._rendererRequirement = rendererRequirement, _this.gameCreatedTrigger.fire(game), 
                    _this._game._loadAndStart({
                        args: param.gameArgs || void 0
                    });
                });
            }, GameDriver.prototype._updateGamePlayId = function(game) {
                var _this = this;
                game.playId = this._playId, game.external.send = function(data) {
                    _this._platform.sendToExternal(_this._playId, data);
                };
            }, GameDriver;
        }();
        exports.GameDriver = GameDriver;
    }, {
        "./EventBuffer": 2,
        "./ExecutionMode": 5,
        "./Game": 6,
        "./GameLoop": 8,
        "./PdiUtil": 12,
        "@akashic/akashic-engine": "@akashic/akashic-engine",
        "es6-promise": 23
    } ],
    8: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), LoopMode_1 = require("./LoopMode"), LoopRenderMode_1 = require("./LoopRenderMode"), ExecutionMode_1 = require("./ExecutionMode"), Clock_1 = require("./Clock"), ProfilerClock_1 = require("./ProfilerClock"), EventConverter_1 = require("./EventConverter"), TickController_1 = require("./TickController"), GameLoop = function() {
            function GameLoop(param) {
                this.errorTrigger = new g.Trigger(), this.running = !1, this._currentTime = 0, this._frameTime = 1e3 / param.game.fps, 
                param.errorHandler && this.errorTrigger.handle(param.errorHandlerOwner, param.errorHandler);
                var conf = param.configuration;
                this._startedAt = param.startedAt, this._targetTimeFunc = conf.targetTimeFunc || null, 
                this._targetTimeOffset = conf.targetTimeOffset || null, this._originDate = conf.originDate || null, 
                this._realTargetTimeOffset = null != this._originDate ? this._originDate - this._startedAt : this._targetTimeOffset || 0, 
                this._delayIgnoreThreshold = conf.delayIgnoreThreshold || GameLoop.DEFAULT_DELAY_IGNORE_THRESHOLD, 
                this._skipTicksAtOnce = conf.skipTicksAtOnce || GameLoop.DEFAULT_SKIP_TICKS_AT_ONCE, 
                this._skipThreshold = conf.skipThreshold || GameLoop.DEFAULT_SKIP_THRESHOLD, this._jumpTryThreshold = conf.jumpTryThreshold || GameLoop.DEFAULT_JUMP_TRY_THRESHOLD, 
                this._jumpIgnoreThreshold = conf.jumpIgnoreThreshold || GameLoop.DEFAULT_JUMP_IGNORE_THRESHOLD, 
                this._pollingTickThreshold = conf._pollingTickThreshold || GameLoop.DEFAULT_POLLING_TICK_THRESHOLD, 
                this._playbackRate = conf.playbackRate || 1;
                var loopRenderMode = null != conf.loopRenderMode ? conf.loopRenderMode : LoopRenderMode_1["default"].AfterRawFrame;
                this._loopRenderMode = null, this._loopMode = conf.loopMode, this._amflow = param.amflow, 
                this._game = param.game, this._eventBuffer = param.eventBuffer, this._executionMode = param.executionMode, 
                this._sceneTickMode = null, this._sceneLocalMode = null, this._targetAge = null != conf.targetAge ? conf.targetAge : null, 
                this._waitingStartPoint = !1, this._lastRequestedStartPointAge = -1, this._lastRequestedStartPointTime = -1, 
                this._waitingNextTick = !1, this._skipping = !1, this._lastPollingTickTime = 0, 
                param.profiler ? this._clock = new ProfilerClock_1.ProfilerClock({
                    fps: param.game.fps,
                    scaleFactor: this._playbackRate,
                    platform: param.platform,
                    maxFramePerOnce: 5,
                    profiler: param.profiler
                }) : this._clock = new Clock_1.Clock({
                    fps: param.game.fps,
                    scaleFactor: this._playbackRate,
                    platform: param.platform,
                    maxFramePerOnce: 5
                }), this._tickController = new TickController_1.TickController({
                    amflow: param.amflow,
                    clock: this._clock,
                    game: param.game,
                    eventBuffer: param.eventBuffer,
                    executionMode: param.executionMode,
                    errorHandler: this.errorTrigger.fire,
                    errorHandlerOwner: this.errorTrigger
                }), this._eventConverter = new EventConverter_1.EventConverter({
                    game: param.game
                }), this._tickBuffer = this._tickController.getBuffer(), this._onGotStartPoint_bound = this._onGotStartPoint.bind(this), 
                this._setLoopRenderMode(loopRenderMode), this._game.setStorageFunc(this._tickController.storageFunc()), 
                this._game.raiseEventTrigger.handle(this, this._onGameRaiseEvent), this._game.raiseTickTrigger.handle(this, this._onGameRaiseTick), 
                this._game._started.handle(this, this._onGameStarted), this._game._operationPluginOperated.handle(this, this._onGameOperationPluginOperated), 
                this._tickBuffer.gotNextTickTrigger.handle(this, this._onGotNextFrameTick), this._tickBuffer.start(), 
                this._updateGamePlaybackRate(), this._handleSceneChange();
            }
            return GameLoop.prototype.start = function() {
                this.running = !0, this._clock.start();
            }, GameLoop.prototype.stop = function() {
                this._clock.stop(), this.running = !1;
            }, GameLoop.prototype.setNextAge = function(age) {
                this._tickController.setNextAge(age);
            }, GameLoop.prototype.getExecutionMode = function() {
                return this._executionMode;
            }, GameLoop.prototype.setExecutionMode = function(execMode) {
                this._executionMode = execMode, this._tickController.setExecutionMode(execMode);
            }, GameLoop.prototype.getLoopConfiguration = function() {
                return {
                    loopMode: this._loopMode,
                    delayIgnoreThreshold: this._delayIgnoreThreshold,
                    skipTicksAtOnce: this._skipTicksAtOnce,
                    skipThreshold: this._skipThreshold,
                    jumpTryThreshold: this._jumpTryThreshold,
                    jumpIgnoreThreshold: this._jumpIgnoreThreshold,
                    playbackRate: this._playbackRate,
                    loopRenderMode: this._loopRenderMode,
                    targetTimeFunc: this._targetTimeFunc,
                    targetTimeOffset: this._targetTimeOffset,
                    originDate: this._originDate,
                    targetAge: this._targetAge
                };
            }, GameLoop.prototype.setLoopConfiguration = function(conf) {
                null != conf.loopMode && (this._loopMode = conf.loopMode), null != conf.delayIgnoreThreshold && (this._delayIgnoreThreshold = conf.delayIgnoreThreshold), 
                null != conf.skipTicksAtOnce && (this._skipTicksAtOnce = conf.skipTicksAtOnce), 
                null != conf.skipThreshold && (this._skipThreshold = conf.skipThreshold), null != conf.jumpTryThreshold && (this._jumpTryThreshold = conf.jumpTryThreshold), 
                null != conf.jumpIgnoreThreshold && (this._jumpIgnoreThreshold = conf.jumpIgnoreThreshold), 
                null != conf.playbackRate && (this._playbackRate = conf.playbackRate, this._clock.changeScaleFactor(this._playbackRate), 
                this._updateGamePlaybackRate()), null != conf.loopRenderMode && this._setLoopRenderMode(conf.loopRenderMode), 
                null != conf.targetTimeFunc && (this._targetTimeFunc = conf.targetTimeFunc), null != conf.targetTimeOffset && (this._targetTimeOffset = conf.targetTimeOffset), 
                null != conf.originDate && (this._originDate = conf.originDate), this._realTargetTimeOffset = null != this._originDate ? this._originDate - this._startedAt : this._targetTimeOffset || 0, 
                null != conf.targetAge && (this._targetAge !== conf.targetAge && (this._waitingNextTick = !1), 
                this._targetAge = conf.targetAge);
            }, GameLoop.prototype.addTickList = function(tickList) {
                this._tickBuffer.addTickList(tickList);
            }, GameLoop.prototype.getCurrentTime = function() {
                return this._currentTime;
            }, GameLoop.prototype._startSkipping = function() {
                this._skipping = !0, this._updateGamePlaybackRate(), this._game.skippingChangedTrigger.fire(!0);
            }, GameLoop.prototype._stopSkipping = function() {
                this._skipping = !1, this._updateGamePlaybackRate(), this._game.skippingChangedTrigger.fire(!1);
            }, GameLoop.prototype._updateGamePlaybackRate = function() {
                var realPlaybackRate = this._skipping ? this._playbackRate * this._skipTicksAtOnce : this._playbackRate;
                this._game._setAudioPlaybackRate(realPlaybackRate);
            }, GameLoop.prototype._handleSceneChange = function() {
                var scene = this._game.scene(), localMode = scene ? scene.local : g.LocalTickMode.FullLocal, tickMode = scene ? scene.tickGenerationMode : g.TickGenerationMode.ByClock;
                if (this._sceneLocalMode !== localMode || this._sceneTickMode !== tickMode) switch (this._sceneLocalMode = localMode, 
                this._sceneTickMode = tickMode, this._clock.frameTrigger.remove(this, this._onFrame), 
                this._clock.frameTrigger.remove(this, this._onLocalFrame), localMode) {
                  case g.LocalTickMode.FullLocal:
                    this._tickController.stopTick(), this._clock.frameTrigger.handle(this, this._onLocalFrame);
                    break;

                  case g.LocalTickMode.NonLocal:
                  case g.LocalTickMode.InterpolateLocal:
                    tickMode === g.TickGenerationMode.ByClock ? this._tickController.startTick() : this._tickController.startTickOnce(), 
                    this._clock.frameTrigger.handle(this, this._onFrame);
                    break;

                  default:
                    return void this.errorTrigger.fire(new Error("Unknown LocalTickMode: " + localMode));
                }
            }, GameLoop.prototype._onLocalFrame = function() {
                this._doLocalTick();
            }, GameLoop.prototype._doLocalTick = function() {
                var game = this._game, pevs = this._eventBuffer.readLocalEvents();
                if (this._currentTime += this._frameTime, pevs) for (var i = 0, len = pevs.length; len > i; ++i) game.events.push(this._eventConverter.toGameEvent(pevs[i]));
                var sceneChanged = game.tick(!1);
                sceneChanged && this._handleSceneChange();
            }, GameLoop.prototype._onFrame = function(frameArg) {
                this._loopMode === LoopMode_1["default"].Replay && this._targetTimeFunc ? this._onFrameForTimedReplay(frameArg) : this._onFrameNormal(frameArg);
            }, GameLoop.prototype._onFrameForTimedReplay = function(frameArg) {
                var sceneChanged = !1, game = this._game, targetTime = this._targetTimeFunc() + this._realTargetTimeOffset, timeGap = targetTime - this._currentTime, frameGap = timeGap / this._frameTime;
                if ((frameGap > this._jumpTryThreshold || 0 > frameGap) && !this._waitingStartPoint && this._lastRequestedStartPointTime < this._currentTime && (this._waitingStartPoint = !0, 
                this._lastRequestedStartPointTime = targetTime, this._amflow.getStartPoint({
                    timestamp: targetTime
                }, this._onGotStartPoint_bound)), this._skipping ? 1 >= frameGap && this._stopSkipping() : frameGap > this._skipThreshold && this._startSkipping(), 
                !(0 >= frameGap)) for (var i = 0; i < this._skipTicksAtOnce; ++i) {
                    if (!this._tickBuffer.hasNextTick()) {
                        this._waitingNextTick || (this._tickBuffer.requestTicks(), this._startWaitingNextTick());
                        break;
                    }
                    var nextFrameTime = this._currentTime + this._frameTime, nextTickTime = this._tickBuffer.readNextTickTime();
                    if (null == nextTickTime && (nextTickTime = nextFrameTime), nextFrameTime > targetTime) {
                        if (!(targetTime >= nextTickTime)) break;
                        nextFrameTime = targetTime;
                    } else if (nextTickTime > nextFrameTime) {
                        this._sceneLocalMode === g.LocalTickMode.InterpolateLocal && this._doLocalTick();
                        continue;
                    }
                    this._currentTime = nextFrameTime;
                    var tick = this._tickBuffer.consume(), consumedAge = -1, pevs = this._eventBuffer.readLocalEvents();
                    if (pevs) for (var j = 0, len = pevs.length; len > j; ++j) game.events.push(this._eventConverter.toGameEvent(pevs[j]));
                    if ("number" == typeof tick) consumedAge = tick, sceneChanged = game.tick(!0); else {
                        consumedAge = tick[0];
                        var pevs_1 = tick[1];
                        if (pevs_1) for (var j = 0, len = pevs_1.length; len > j; ++j) game.events.push(this._eventConverter.toGameEvent(pevs_1[j]));
                        sceneChanged = game.tick(!0);
                    }
                    if (game._notifyPassedAgeTable[consumedAge] && game.fireAgePassedIfNeeded()) {
                        frameArg.interrupt = !0;
                        break;
                    }
                    if (sceneChanged) {
                        this._handleSceneChange();
                        break;
                    }
                }
            }, GameLoop.prototype._onFrameNormal = function(frameArg) {
                var sceneChanged = !1, game = this._game;
                if (this._waitingNextTick) return void (this._sceneLocalMode === g.LocalTickMode.InterpolateLocal && this._doLocalTick());
                var targetAge, ageGap;
                if (this._loopMode === LoopMode_1["default"].Realtime ? (targetAge = this._tickBuffer.knownLatestAge + 1, 
                ageGap = targetAge - this._tickBuffer.currentAge) : null === this._targetAge ? (targetAge = null, 
                ageGap = 1) : this._targetAge === this._tickBuffer.currentAge ? (targetAge = this._targetAge = null, 
                ageGap = 1) : (targetAge = this._targetAge, ageGap = targetAge - this._tickBuffer.currentAge), 
                (ageGap > this._jumpTryThreshold || 0 > ageGap) && !this._waitingStartPoint && this._lastRequestedStartPointAge < this._tickBuffer.currentAge && (this._waitingStartPoint = !0, 
                this._lastRequestedStartPointAge = targetAge, this._amflow.getStartPoint({
                    frame: targetAge
                }, this._onGotStartPoint_bound)), this._skipping) {
                    var skipStopGap = this._loopMode === LoopMode_1["default"].Realtime ? 0 : 1;
                    skipStopGap >= ageGap && this._stopSkipping();
                } else ageGap > this._skipThreshold && this._startSkipping();
                if (0 >= ageGap) return 0 === ageGap && (0 === this._tickBuffer.currentAge && this._tickBuffer.requestTicks(), 
                this._startWaitingNextTick()), void (this._sceneLocalMode === g.LocalTickMode.InterpolateLocal && this._doLocalTick());
                for (var loopCount = !this._skipping && ageGap <= this._delayIgnoreThreshold ? 1 : Math.min(ageGap, this._skipTicksAtOnce), i = 0; loopCount > i; ++i) {
                    var nextFrameTime = this._currentTime + this._frameTime, nextTickTime = this._tickBuffer.readNextTickTime();
                    if (null != nextTickTime && nextTickTime > nextFrameTime) {
                        if (this._loopMode !== LoopMode_1["default"].Realtime) {
                            if (this._sceneLocalMode === g.LocalTickMode.InterpolateLocal) {
                                this._doLocalTick();
                                continue;
                            }
                            break;
                        }
                        nextFrameTime = Math.ceil(nextTickTime / this._frameTime) * this._frameTime;
                    }
                    this._currentTime = nextFrameTime;
                    var tick = this._tickBuffer.consume(), consumedAge = -1;
                    if (null == tick) {
                        this._tickBuffer.requestTicks(), this._startWaitingNextTick();
                        break;
                    }
                    var pevs = this._eventBuffer.readLocalEvents();
                    if (pevs) for (var i_1 = 0, len = pevs.length; len > i_1; ++i_1) game.events.push(this._eventConverter.toGameEvent(pevs[i_1]));
                    if ("number" == typeof tick) consumedAge = tick, sceneChanged = game.tick(!0); else {
                        consumedAge = tick[0];
                        var pevs_2 = tick[1];
                        if (pevs_2) for (var j = 0, len = pevs_2.length; len > j; ++j) game.events.push(this._eventConverter.toGameEvent(pevs_2[j]));
                        sceneChanged = game.tick(!0);
                    }
                    if (game._notifyPassedAgeTable[consumedAge] && game.fireAgePassedIfNeeded()) {
                        frameArg.interrupt = !0;
                        break;
                    }
                    if (sceneChanged) {
                        this._handleSceneChange();
                        break;
                    }
                }
            }, GameLoop.prototype._onGotNextFrameTick = function() {
                this._waitingNextTick && this._loopMode !== LoopMode_1["default"].FrameByFrame && this._stopWaitingNextTick();
            }, GameLoop.prototype._onGotStartPoint = function(err, startPoint) {
                if (this._waitingStartPoint = !1, err) return void this.errorTrigger.fire(err);
                if (this._targetTimeFunc && this._loopMode !== LoopMode_1["default"].Realtime) {
                    var targetTime = this._targetTimeFunc() + this._realTargetTimeOffset;
                    if (targetTime < startPoint.timestamp) return;
                    var currentTime = this._currentTime;
                    if (targetTime >= currentTime && startPoint.timestamp < currentTime + this._jumpIgnoreThreshold * this._frameTime) return;
                } else {
                    var targetAge = this._loopMode === LoopMode_1["default"].Realtime ? this._tickBuffer.knownLatestAge + 1 : this._targetAge;
                    if (null === targetAge || targetAge < startPoint.frame) return;
                    var currentAge = this._tickBuffer.currentAge;
                    if (targetAge >= currentAge && startPoint.frame < currentAge + this._jumpIgnoreThreshold) return;
                }
                this._clock.frameTrigger.remove(this._eventBuffer, this._eventBuffer.processEvents), 
                this._tickBuffer.setCurrentAge(startPoint.frame), this._currentTime = startPoint.timestamp || startPoint.data.timestamp || 0, 
                this._waitingNextTick = !1, this._lastRequestedStartPointAge = -1, this._lastRequestedStartPointTime = -1, 
                this._game._restartWithSnapshot(startPoint), this._handleSceneChange();
            }, GameLoop.prototype._onGameStarted = function() {
                this._clock.frameTrigger.handleInsert(0, this._eventBuffer, this._eventBuffer.processEvents);
            }, GameLoop.prototype._setLoopRenderMode = function(mode) {
                if (mode !== this._loopRenderMode) switch (this._loopRenderMode = mode, mode) {
                  case LoopRenderMode_1["default"].AfterRawFrame:
                    this._clock.rawFrameTrigger.handle(this, this._renderOnRawFrame);
                    break;

                  case LoopRenderMode_1["default"].None:
                    this._clock.rawFrameTrigger.remove(this, this._renderOnRawFrame);
                    break;

                  default:
                    this.errorTrigger.fire(new Error("GameLoop#_setLoopRenderMode: unknown mode: " + mode));
                }
            }, GameLoop.prototype._renderOnRawFrame = function() {
                var game = this._game;
                game.modified && game.scenes.length > 0 && game.render();
            }, GameLoop.prototype._onGameRaiseEvent = function(e) {
                var pev = this._eventConverter.toPlaylogEvent(e);
                this._eventBuffer.onEvent(pev);
            }, GameLoop.prototype._onGameRaiseTick = function(es) {
                if (this._executionMode === ExecutionMode_1["default"].Active) {
                    if (es) for (var i = 0; i < es.length; ++i) this._eventBuffer.addEventDirect(this._eventConverter.toPlaylogEvent(es[i]));
                    this._tickController.forceGenerateTick();
                }
            }, GameLoop.prototype._onGameOperationPluginOperated = function(op) {
                var pev = this._eventConverter.makePlaylogOperationEvent(op);
                this._eventBuffer.onEvent(pev);
            }, GameLoop.prototype._onPollingTick = function() {
                var time = +new Date();
                time - this._lastPollingTickTime > this._pollingTickThreshold && (this._lastPollingTickTime = time, 
                this._tickBuffer.requestTicks());
            }, GameLoop.prototype._startWaitingNextTick = function() {
                this._waitingNextTick = !0, this._clock.rawFrameTrigger.handle(this, this._onPollingTick), 
                this._lastPollingTickTime = +new Date();
            }, GameLoop.prototype._stopWaitingNextTick = function() {
                this._waitingNextTick = !1, this._clock.rawFrameTrigger.remove(this, this._onPollingTick);
            }, GameLoop.DEFAULT_DELAY_IGNORE_THRESHOLD = 6, GameLoop.DEFAULT_SKIP_TICKS_AT_ONCE = 100, 
            GameLoop.DEFAULT_SKIP_THRESHOLD = 3e4, GameLoop.DEFAULT_JUMP_TRY_THRESHOLD = 9e4, 
            GameLoop.DEFAULT_JUMP_IGNORE_THRESHOLD = 15e3, GameLoop.DEFAULT_POLLING_TICK_THRESHOLD = 1e4, 
            GameLoop.DEFAULT_DELAY_IGNORE_THERSHOLD = GameLoop.DEFAULT_DELAY_IGNORE_THRESHOLD, 
            GameLoop;
        }();
        exports.GameLoop = GameLoop;
    }, {
        "./Clock": 1,
        "./EventConverter": 3,
        "./ExecutionMode": 5,
        "./LoopMode": 10,
        "./LoopRenderMode": 11,
        "./ProfilerClock": 14,
        "./TickController": 17,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    9: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), JoinLeaveRequest = function() {
            function JoinLeaveRequest(pev, joinResolver, amflow, keys) {
                this.joinResolver = joinResolver, this.pev = pev, 0 === pev[0] && keys ? (this.resolved = !1, 
                amflow.getStorageData(keys, this._onGotStorageData.bind(this))) : this.resolved = !0;
            }
            return JoinLeaveRequest.prototype._onGotStorageData = function(err, sds) {
                return this.resolved = !0, err ? void this.joinResolver.errorTrigger.fire(err) : void (this.pev[4] = sds);
            }, JoinLeaveRequest;
        }();
        exports.JoinLeaveRequest = JoinLeaveRequest;
        var JoinResolver = function() {
            function JoinResolver(param) {
                this.errorTrigger = new g.Trigger(), param.errorHandler && this.errorTrigger.handle(param.errorHandlerOwner, param.errorHandler), 
                this._amflow = param.amflow, this._keysForJoin = null, this._requested = [];
            }
            return JoinResolver.prototype.request = function(pev) {
                this._requested.push(new JoinLeaveRequest(pev, this, this._amflow, this._keysForJoin));
            }, JoinResolver.prototype.readResolved = function() {
                var len = this._requested.length;
                if (0 === len || !this._requested[0].resolved) return null;
                for (var ret = [], i = 0; len > i; ++i) {
                    var req = this._requested[i];
                    if (!req.resolved) break;
                    ret.push(req.pev);
                }
                return this._requested.splice(0, i), ret;
            }, JoinResolver.prototype.setRequestValuesForJoin = function(keys) {
                this._keysForJoin = keys;
            }, JoinResolver;
        }();
        exports.JoinResolver = JoinResolver;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    10: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var LoopMode;
        !function(LoopMode) {
            LoopMode[LoopMode.Realtime = 0] = "Realtime", LoopMode[LoopMode.Replay = 1] = "Replay", 
            LoopMode[LoopMode.FrameByFrame = 2] = "FrameByFrame";
        }(LoopMode || (LoopMode = {})), exports["default"] = LoopMode;
    }, {} ],
    11: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var LoopRenderMode;
        !function(LoopRenderMode) {
            LoopRenderMode[LoopRenderMode.AfterRawFrame = 0] = "AfterRawFrame", LoopRenderMode[LoopRenderMode.None = 1] = "None";
        }(LoopRenderMode || (LoopRenderMode = {})), exports["default"] = LoopRenderMode;
    }, {} ],
    12: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var PdiUtil, es6_promise_1 = require("es6-promise"), g = require("@akashic/akashic-engine");
        !function(PdiUtil) {
            function makeLoadConfigurationFunc(pf) {
                function loadResolvedConfiguration(url, assetBase, configurationBase, callback) {
                    pf.loadGameConfiguration(url, function(err, conf) {
                        if (err) return void callback(err, null);
                        try {
                            conf = PdiUtil._resolveConfigurationBasePath(conf, null != assetBase ? assetBase : g.PathUtil.resolveDirname(url));
                        } catch (e) {
                            return void callback(e, null);
                        }
                        if (!conf.definitions) return void callback(null, conf);
                        var defs = conf.definitions.map(function(def) {
                            if ("string" == typeof def) {
                                var resolvedUrl = null != configurationBase ? g.PathUtil.resolvePath(configurationBase, def) : def;
                                return promisifiedLoad(resolvedUrl, void 0, configurationBase);
                            }
                            var resolvedUrl = null != configurationBase ? g.PathUtil.resolvePath(configurationBase, def.url) : def.url;
                            return promisifiedLoad(resolvedUrl, def.basePath, configurationBase);
                        });
                        es6_promise_1.Promise.all(defs).then(function(confs) {
                            return callback(null, confs.reduce(PdiUtil._mergeGameConfiguration));
                        })["catch"](function(e) {
                            return callback(e, null);
                        });
                    });
                }
                function promisifiedLoad(url, assetBase, configurationBase) {
                    return new es6_promise_1.Promise(function(resolve, reject) {
                        loadResolvedConfiguration(url, assetBase, configurationBase, function(err, conf) {
                            err ? reject(err) : resolve(conf);
                        });
                    });
                }
                return loadResolvedConfiguration;
            }
            function _resolveConfigurationBasePath(configuration, assetBase) {
                function resolvePath(base, path) {
                    var ret = g.PathUtil.resolvePath(base, path);
                    if (0 !== ret.indexOf(base)) throw g.ExceptionFactory.createAssertionError("PdiUtil._resolveConfigurationBasePath: invalid path: " + path);
                    return ret;
                }
                var assets = configuration.assets;
                if (assets instanceof Object) for (var p in assets) assets.hasOwnProperty(p) && "path" in assets[p] && (assets[p].virtualPath = assets[p].virtualPath || assets[p].path, 
                assets[p].path = resolvePath(assetBase, assets[p].path));
                return configuration.globalScripts && (configuration.globalScripts.forEach(function(path) {
                    if (assets.hasOwnProperty(path)) throw g.ExceptionFactory.createAssertionError("PdiUtil._resolveConfigurationBasePath: asset ID already exists: " + path);
                    assets[path] = {
                        type: /\.json$/i.test(path) ? "text" : "script",
                        virtualPath: path,
                        path: resolvePath(assetBase, path),
                        global: !0
                    };
                }), delete configuration.globalScripts), configuration;
            }
            function _mergeObject(target, source) {
                for (var ks = Object.keys(source), i = 0, len = ks.length; len > i; ++i) {
                    var k = ks[i], sourceVal = source[k], sourceValType = typeof sourceVal, targetValType = typeof target[k];
                    if (sourceValType === targetValType) switch (typeof sourceVal) {
                      case "string":
                      case "number":
                      case "boolean":
                        target[k] = sourceVal;
                        break;

                      case "object":
                        null == sourceVal ? target[k] = sourceVal : Array.isArray(sourceVal) ? target[k] = target[k].concat(sourceVal) : PdiUtil._mergeObject(target[k], sourceVal);
                        break;

                      default:
                        throw new Error("PdiUtil._mergeObject(): unknown type");
                    } else target[k] = sourceVal;
                }
                return target;
            }
            function _mergeGameConfiguration(target, source) {
                return PdiUtil._mergeObject(target, source);
            }
            PdiUtil.makeLoadConfigurationFunc = makeLoadConfigurationFunc, PdiUtil._resolveConfigurationBasePath = _resolveConfigurationBasePath, 
            PdiUtil._mergeObject = _mergeObject, PdiUtil._mergeGameConfiguration = _mergeGameConfiguration;
        }(PdiUtil = exports.PdiUtil || (exports.PdiUtil = {}));
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine",
        "es6-promise": 23
    } ],
    13: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var PointEventResolver = function() {
            function PointEventResolver(param) {
                this._game = param.game, this._pointEventMap = {};
            }
            return PointEventResolver.prototype.pointDown = function(e) {
                var player = this._game.player, source = this._game.findPointSource(e.offset), point = source.point ? source.point : e.offset, targetId = source.target ? source.target.id : null;
                this._pointEventMap[e.identifier] = {
                    targetId: targetId,
                    local: source.local,
                    point: point,
                    start: {
                        x: e.offset.x,
                        y: e.offset.y
                    },
                    prev: {
                        x: e.offset.x,
                        y: e.offset.y
                    }
                };
                var ret = [ 33, 2, player.id, e.identifier, point.x, point.y, targetId ];
                return source.local && ret.push(source.local), ret;
            }, PointEventResolver.prototype.pointMove = function(e) {
                var player = this._game.player, holder = this._pointEventMap[e.identifier];
                if (!holder) return null;
                var prev = {
                    x: 0,
                    y: 0
                }, start = {
                    x: 0,
                    y: 0
                };
                this._pointMoveAndUp(holder, e.offset, prev, start);
                var ret = [ 34, 2, player.id, e.identifier, holder.point.x, holder.point.y, start.x, start.y, prev.x, prev.y, holder.targetId ];
                return holder.local && ret.push(holder.local), ret;
            }, PointEventResolver.prototype.pointUp = function(e) {
                var player = this._game.player, holder = this._pointEventMap[e.identifier];
                if (!holder) return null;
                var prev = {
                    x: 0,
                    y: 0
                }, start = {
                    x: 0,
                    y: 0
                };
                this._pointMoveAndUp(holder, e.offset, prev, start), delete this._pointEventMap[e.identifier];
                var ret = [ 35, 2, player.id, e.identifier, holder.point.x, holder.point.y, start.x, start.y, prev.x, prev.y, holder.targetId ];
                return holder.local && ret.push(holder.local), ret;
            }, PointEventResolver.prototype._pointMoveAndUp = function(holder, offset, prevDelta, startDelta) {
                startDelta.x = offset.x - holder.start.x, startDelta.y = offset.y - holder.start.y, 
                prevDelta.x = offset.x - holder.prev.x, prevDelta.y = offset.y - holder.prev.y, 
                holder.prev.x = offset.x, holder.prev.y = offset.y;
            }, PointEventResolver;
        }();
        exports.PointEventResolver = PointEventResolver;
    }, {} ],
    14: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var Clock_1 = require("./Clock"), ProfilerClock = function(_super) {
            function ProfilerClock(param) {
                var _this = _super.call(this, param) || this;
                return _this._profiler = param.profiler, _this;
            }
            return __extends(ProfilerClock, _super), ProfilerClock.prototype._onLooperCall = function(deltaTime) {
                if (0 >= deltaTime) return this._waitTime - this._totalDeltaTime;
                deltaTime > this._deltaTimeBrokenThreshold && (deltaTime = this._waitTime);
                var totalDeltaTime = this._totalDeltaTime;
                if (totalDeltaTime += deltaTime, totalDeltaTime <= this._skipFrameWaitTime) return this._totalDeltaTime = totalDeltaTime, 
                this._waitTime - totalDeltaTime;
                this._profiler.timeEnd(1), this._profiler.time(1);
                var frameCount = totalDeltaTime < this._waitTimeDoubled ? 1 : totalDeltaTime > this._waitTimeMax ? this._realMaxFramePerOnce : totalDeltaTime / this._waitTime | 0, fc = frameCount, arg = {
                    interrupt: !1
                };
                for (this._profiler.setValue(0, fc - 1); fc > 0 && this.running && !arg.interrupt; ) --fc, 
                this._profiler.time(2), this.frameTrigger.fire(arg), this._profiler.timeEnd(2);
                return totalDeltaTime -= (frameCount - fc) * this._waitTime, this._profiler.time(3), 
                this.rawFrameTrigger.fire(), this._profiler.timeEnd(3), this._totalDeltaTime = totalDeltaTime, 
                this._profiler.flush(), this._waitTime - totalDeltaTime;
            }, ProfilerClock;
        }(Clock_1.Clock);
        exports.ProfilerClock = ProfilerClock;
    }, {
        "./Clock": 1
    } ],
    15: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), ExecutionMode_1 = require("./ExecutionMode"), StorageResolver = function() {
            function StorageResolver(param) {
                this.errorTrigger = new g.Trigger(), param.errorHandler && this.errorTrigger.handle(param.errorHandlerOwner, param.errorHandler), 
                this.getStorageFunc = this._getStorage.bind(this), this.putStorageFunc = this._putStorage.bind(this), 
                this.requestValuesForJoinFunc = this._requestValuesForJoin.bind(this), this._game = param.game, 
                this._amflow = param.amflow, this._tickGenerator = param.tickGenerator, this._tickBuffer = param.tickBuffer, 
                this._executionMode = null, this.setExecutionMode(param.executionMode), this._unresolvedLoaders = {}, 
                this._unresolvedStorages = {}, this._onStoragePut_bound = this._onStoragePut.bind(this);
            }
            return StorageResolver.prototype.setExecutionMode = function(executionMode) {
                if (this._executionMode !== executionMode) {
                    this._executionMode = executionMode;
                    var tickBuf = this._tickBuffer, tickGen = this._tickGenerator;
                    executionMode === ExecutionMode_1["default"].Active ? (tickBuf.gotStorageTrigger.remove(this, this._onGotStorageOnTick), 
                    tickGen.gotStorageTrigger.handle(this, this._onGotStorageOnTick)) : (tickGen.gotStorageTrigger.remove(this, this._onGotStorageOnTick), 
                    tickBuf.gotStorageTrigger.handle(this, this._onGotStorageOnTick));
                }
            }, StorageResolver.prototype._onGotStorageOnTick = function(storageOnTick) {
                var resolvingAge = storageOnTick.age, storageData = storageOnTick.storageData, loader = this._unresolvedLoaders[resolvingAge];
                if (!loader) return void (this._unresolvedStorages[resolvingAge] = storageData);
                delete this._unresolvedLoaders[resolvingAge];
                var serialization = resolvingAge, values = storageData.map(function(d) {
                    return d.values;
                });
                loader._onLoaded(values, serialization);
            }, StorageResolver.prototype._getStorage = function(keys, loader, ser) {
                var resolvingAge;
                null != ser ? (resolvingAge = ser, this._tickBuffer.requestTicks(resolvingAge, 1)) : this._executionMode === ExecutionMode_1["default"].Active ? resolvingAge = this._tickGenerator.requestStorageTick(keys) : (resolvingAge = this._game.age, 
                this._tickBuffer.requestTicks(resolvingAge, 1));
                var sd = this._unresolvedStorages[resolvingAge];
                if (!sd) return void (this._unresolvedLoaders[resolvingAge] = loader);
                delete this._unresolvedStorages[resolvingAge];
                var serialization = resolvingAge, values = sd.map(function(d) {
                    return d.values;
                });
                loader._onLoaded(values, serialization);
            }, StorageResolver.prototype._putStorage = function(key, value, option) {
                this._executionMode === ExecutionMode_1["default"].Active && this._amflow.putStorageData(key, value, option, this._onStoragePut_bound);
            }, StorageResolver.prototype._requestValuesForJoin = function(keys) {
                this._tickGenerator.setRequestValuesForJoin(keys);
            }, StorageResolver.prototype._onStoragePut = function(err) {
                err && this.errorTrigger.fire(err);
            }, StorageResolver;
        }();
        exports.StorageResolver = StorageResolver;
    }, {
        "./ExecutionMode": 5,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    16: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), ExecutionMode_1 = require("./ExecutionMode"), TickBuffer = function() {
            function TickBuffer(param) {
                this.currentAge = 0, this.knownLatestAge = -1, this.gotNextTickTrigger = new g.Trigger(), 
                this.gotStorageTrigger = new g.Trigger(), this._amflow = param.amflow, this._prefetchThreshold = param.prefetchThreshold || TickBuffer.DEFAULT_PREFETCH_THRESHOLD, 
                this._sizeRequestOnce = param.sizeRequestOnce || TickBuffer.DEFAULT_SIZE_REQUEST_ONCE, 
                this._executionMode = param.executionMode, this._receiving = !1, this._tickRanges = [], 
                this._nearestAbsentAge = this.currentAge, this._nextTickTimeCache = null, this._addTick_bound = this.addTick.bind(this), 
                this._onTicks_bound = this._onTicks.bind(this);
            }
            return TickBuffer.prototype.start = function() {
                this._receiving = !0, this._updateAmflowReceiveState();
            }, TickBuffer.prototype.stop = function() {
                this._receiving = !1, this._updateAmflowReceiveState();
            }, TickBuffer.prototype.setExecutionMode = function(execMode) {
                this._executionMode !== execMode && (this._dropUntil(this.knownLatestAge + 1), this._nextTickTimeCache = null, 
                this._nearestAbsentAge = this.currentAge, this._executionMode = execMode, this._updateAmflowReceiveState());
            }, TickBuffer.prototype.setCurrentAge = function(age) {
                this._dropUntil(age), this._nextTickTimeCache = null, this.currentAge = age, this._nearestAbsentAge = this._findNearestAbscentAge(age);
            }, TickBuffer.prototype.hasNextTick = function() {
                return this.currentAge !== this._nearestAbsentAge;
            }, TickBuffer.prototype.consume = function() {
                if (this.currentAge === this._nearestAbsentAge) return null;
                var age = this.currentAge, range = this._tickRanges[0];
                return age === range.start ? (this._nextTickTimeCache = null, ++this.currentAge, 
                ++range.start, age + this._prefetchThreshold === this._nearestAbsentAge && this.requestTicks(this._nearestAbsentAge, this._sizeRequestOnce), 
                range.start === range.end && this._tickRanges.shift(), range.ticks.length > 0 && range.ticks[0][0] === age ? range.ticks.shift() : age) : (this._dropUntil(this.currentAge), 
                this.consume());
            }, TickBuffer.prototype.readNextTickTime = function() {
                if (null != this._nextTickTimeCache) return this._nextTickTimeCache;
                if (this.currentAge === this._nearestAbsentAge) return null;
                var age = this.currentAge, range = this._tickRanges[0];
                if (age === range.start) {
                    if (0 === range.ticks.length) return null;
                    var tick = range.ticks[0];
                    if (tick[0] !== age) return null;
                    var pevs = tick[1];
                    if (!pevs) return null;
                    for (var i = 0; i < pevs.length; ++i) if (2 === pevs[i][0]) return this._nextTickTimeCache = pevs[i][3], 
                    this._nextTickTimeCache;
                    return null;
                }
                return this._dropUntil(this.currentAge), this.readNextTickTime();
            }, TickBuffer.prototype.requestTicks = function(from, len) {
                void 0 === from && (from = this.currentAge), void 0 === len && (len = this._sizeRequestOnce), 
                this._executionMode === ExecutionMode_1["default"].Passive && this._amflow.getTickList(from, from + len, this._onTicks_bound);
            }, TickBuffer.prototype.addTick = function(tick) {
                var age = tick[0], gotNext = this.currentAge === age && this._nearestAbsentAge === age;
                this.knownLatestAge < age && (this.knownLatestAge = age), tick[2] && this.gotStorageTrigger.fire({
                    age: tick[0],
                    storageData: tick[2]
                });
                for (var i = this._tickRanges.length - 1; i >= 0; --i) {
                    var range = this._tickRanges[i];
                    if (age >= range.start) break;
                }
                var nextRange = this._tickRanges[i + 1];
                if (0 > i) this._tickRanges.unshift(this._createTickRangeFromTick(tick)); else {
                    var range = this._tickRanges[i];
                    age === range.end ? (++range.end, tick[1] && range.ticks.push(tick)) : age > range.end && this._tickRanges.splice(i + 1, 0, this._createTickRangeFromTick(tick));
                }
                this._nearestAbsentAge === age && (++this._nearestAbsentAge, nextRange && this._nearestAbsentAge === nextRange.start && (this._nearestAbsentAge = this._findNearestAbscentAge(this._nearestAbsentAge))), 
                gotNext && this.gotNextTickTrigger.fire();
            }, TickBuffer.prototype.addTickList = function(tickList) {
                var start = tickList[0], end = tickList[1] + 1, ticks = tickList[2], origStart = start, origEnd = end;
                this.knownLatestAge < end - 1 && (this.knownLatestAge = end - 1);
                var i = 0, len = this._tickRanges.length;
                for (i = 0; len > i; ++i) {
                    var range_1 = this._tickRanges[i];
                    if (start < range_1.start) break;
                }
                var insertPoint = i;
                if (i > 0) {
                    --i;
                    var leftEndAge = this._tickRanges[i].end;
                    leftEndAge > start && (start = leftEndAge);
                }
                for (;len > i; ++i) {
                    var range_2 = this._tickRanges[i];
                    if (end <= range_2.end) break;
                }
                if (len > i) {
                    var rightStartAge = this._tickRanges[i].start;
                    end > rightStartAge && (end = rightStartAge);
                }
                if (start >= end) return {
                    start: start,
                    end: start,
                    ticks: []
                };
                ticks || (ticks = []), (origStart !== start || origEnd !== end) && (ticks = ticks.filter(function(tick) {
                    var age = tick[0];
                    return age >= start && end > age;
                }));
                for (var j = 0; j < ticks.length; ++j) {
                    var tick = ticks[j];
                    tick[2] && this.gotStorageTrigger.fire({
                        age: tick[0],
                        storageData: tick[2]
                    });
                }
                var range = {
                    start: start,
                    end: end,
                    ticks: ticks
                }, delLen = Math.max(0, i - insertPoint);
                return this._tickRanges.splice(insertPoint, delLen, range), start <= this._nearestAbsentAge && this._nearestAbsentAge < end && (this._nearestAbsentAge = this._findNearestAbscentAge(this._nearestAbsentAge)), 
                range;
            }, TickBuffer.prototype._updateAmflowReceiveState = function() {
                this._receiving && this._executionMode === ExecutionMode_1["default"].Passive ? this._amflow.onTick(this._addTick_bound) : this._amflow.offTick(this._addTick_bound);
            }, TickBuffer.prototype._onTicks = function(err, ticks) {
                if (err) throw new Error();
                if (ticks) {
                    var mayGotNext = this.currentAge === this._nearestAbsentAge, inserted = this.addTickList(ticks);
                    mayGotNext && inserted.start <= this.currentAge && this.currentAge < inserted.end && this.gotNextTickTrigger.fire();
                }
            }, TickBuffer.prototype._findNearestAbscentAge = function(age) {
                for (var i = 0, len = this._tickRanges.length; len > i && !(age <= this._tickRanges[i].end); ++i) ;
                for (;len > i; ++i) {
                    var range = this._tickRanges[i];
                    if (age < range.start) break;
                    age = range.end;
                }
                return age;
            }, TickBuffer.prototype._dropUntil = function(age) {
                var i;
                for (i = 0; i < this._tickRanges.length && !(age < this._tickRanges[i].end); ++i) ;
                if (this._tickRanges = this._tickRanges.slice(i), 0 !== this._tickRanges.length) {
                    var range = this._tickRanges[0];
                    if (!(age < range.start)) {
                        for (range.start = age, i = 0; i < range.ticks.length && !(age <= range.ticks[i][0]); ++i) ;
                        range.ticks = range.ticks.slice(i);
                    }
                }
            }, TickBuffer.prototype._createTickRangeFromTick = function(tick) {
                var age = tick[0], range = {
                    start: age,
                    end: age + 1,
                    ticks: []
                };
                return tick[1] && range.ticks.push(tick), range;
            }, TickBuffer.DEFAULT_PREFETCH_THRESHOLD = 1800, TickBuffer.DEFAULT_SIZE_REQUEST_ONCE = 9e3, 
            TickBuffer;
        }();
        exports.TickBuffer = TickBuffer;
    }, {
        "./ExecutionMode": 5,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    17: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), ExecutionMode_1 = require("./ExecutionMode"), TickBuffer_1 = require("./TickBuffer"), TickGenerator_1 = require("./TickGenerator"), sr = require("./StorageResolver"), TickController = function() {
            function TickController(param) {
                this.errorTrigger = new g.Trigger(), param.errorHandler && this.errorTrigger.handle(param.errorHandlerOwner, param.errorHandler), 
                this._amflow = param.amflow, this._clock = param.clock, this._started = !1, this._executionMode = param.executionMode, 
                this._generator = new TickGenerator_1.TickGenerator({
                    amflow: param.amflow,
                    eventBuffer: param.eventBuffer,
                    errorHandler: this.errorTrigger.fire,
                    errorHandlerOwner: this.errorTrigger
                }), this._buffer = new TickBuffer_1.TickBuffer({
                    amflow: param.amflow,
                    executionMode: param.executionMode
                }), this._storageResolver = new sr.StorageResolver({
                    game: param.game,
                    amflow: param.amflow,
                    tickGenerator: this._generator,
                    tickBuffer: this._buffer,
                    executionMode: param.executionMode,
                    errorHandler: this.errorTrigger.fire,
                    errorHandlerOwner: this.errorTrigger
                }), this._generator.tickTrigger.handle(this, this._onTickGenerated), this._clock.frameTrigger.handle(this._generator, this._generator.next);
            }
            return TickController.prototype.startTick = function() {
                this._started = !0, this._updateGeneratorState();
            }, TickController.prototype.stopTick = function() {
                this._started = !1, this._updateGeneratorState();
            }, TickController.prototype.startTickOnce = function() {
                this._started = !0, this._generator.tickTrigger.handle(this, this._stopTriggerOnTick), 
                this._updateGeneratorState();
            }, TickController.prototype.setNextAge = function(age) {
                this._generator.setNextAge(age);
            }, TickController.prototype.forceGenerateTick = function() {
                this._generator.forceNext();
            }, TickController.prototype.getBuffer = function() {
                return this._buffer;
            }, TickController.prototype.storageFunc = function() {
                return {
                    storageGetFunc: this._storageResolver.getStorageFunc,
                    storagePutFunc: this._storageResolver.putStorageFunc,
                    requestValuesForJoinFunc: this._storageResolver.requestValuesForJoinFunc
                };
            }, TickController.prototype.setExecutionMode = function(execMode) {
                this._executionMode !== execMode && (this._executionMode = execMode, this._updateGeneratorState(), 
                this._buffer.setExecutionMode(execMode), this._storageResolver.setExecutionMode(execMode));
            }, TickController.prototype._stopTriggerOnTick = function() {
                return this.stopTick(), !0;
            }, TickController.prototype._updateGeneratorState = function() {
                var toGenerate = this._started && this._executionMode === ExecutionMode_1["default"].Active;
                this._generator.startStopGenerate(toGenerate);
            }, TickController.prototype._onTickGenerated = function(tick) {
                this._amflow.sendTick(tick), this._buffer.addTick(tick);
            }, TickController;
        }();
        exports.TickController = TickController;
    }, {
        "./ExecutionMode": 5,
        "./StorageResolver": 15,
        "./TickBuffer": 16,
        "./TickGenerator": 18,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    18: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), JoinResolver_1 = require("./JoinResolver"), TickGenerator = function() {
            function TickGenerator(param) {
                this.tickTrigger = new g.Trigger(), this.gotStorageTrigger = new g.Trigger(), this.errorTrigger = new g.Trigger(), 
                param.errorHandler && this.errorTrigger.handle(param.errorHandlerOwner, param.errorHandler), 
                this._amflow = param.amflow, this._eventBuffer = param.eventBuffer, this._joinResolver = new JoinResolver_1.JoinResolver({
                    amflow: param.amflow,
                    errorHandler: this.errorTrigger.fire,
                    errorHandlerOwner: this.errorTrigger
                }), this._nextAge = 0, this._storageDataForNext = null, this._generatingTick = !1, 
                this._waitingStorage = !1, this._onGotStorageData_bound = this._onGotStorageData.bind(this);
            }
            return TickGenerator.prototype.next = function() {
                if (this._generatingTick && !this._waitingStorage) {
                    var joinLeaves = this._eventBuffer.readJoinLeaves();
                    if (joinLeaves) for (var i = 0; i < joinLeaves.length; ++i) this._joinResolver.request(joinLeaves[i]);
                    var evs = this._eventBuffer.readEvents(), resolvedJoinLeaves = this._joinResolver.readResolved();
                    resolvedJoinLeaves && (evs ? evs.push.apply(evs, resolvedJoinLeaves) : evs = resolvedJoinLeaves);
                    var sds = this._storageDataForNext;
                    this._storageDataForNext = null, this.tickTrigger.fire([ this._nextAge++, evs, sds ]);
                }
            }, TickGenerator.prototype.forceNext = function() {
                if (this._waitingStorage) return void this.errorTrigger.fire(new Error("TickGenerator#forceNext(): cannot generate tick while waiting storage."));
                var origValue = this._generatingTick;
                this._generatingTick = !0, this.next(), this._generatingTick = origValue;
            }, TickGenerator.prototype.startStopGenerate = function(toGenerate) {
                this._generatingTick = toGenerate;
            }, TickGenerator.prototype.startTick = function() {
                this._generatingTick = !0;
            }, TickGenerator.prototype.stopTick = function() {
                this._generatingTick = !1;
            }, TickGenerator.prototype.setNextAge = function(age) {
                return this._waitingStorage ? void this.errorTrigger.fire(new Error("TickGenerator#setNextAge(): cannot change the next age while waiting storage.")) : void (this._nextAge = age);
            }, TickGenerator.prototype.requestStorageTick = function(keys) {
                if (this._waitingStorage) {
                    var err = g.ExceptionFactory.createAssertionError("TickGenerator#requestStorageTick(): Unsupported: multiple storage request");
                    return this.errorTrigger.fire(err), -1;
                }
                return this._waitingStorage = !0, this._amflow.getStorageData(keys, this._onGotStorageData_bound), 
                this._nextAge;
            }, TickGenerator.prototype.setRequestValuesForJoin = function(keys) {
                this._joinResolver.setRequestValuesForJoin(keys);
            }, TickGenerator.prototype._onGotStorageData = function(err, sds) {
                return this._waitingStorage = !1, err ? void this.errorTrigger.fire(err) : (this._storageDataForNext = sds, 
                void this.gotStorageTrigger.fire({
                    age: this._nextAge,
                    storageData: sds
                }));
            }, TickGenerator;
        }();
        exports.TickGenerator = TickGenerator;
    }, {
        "./JoinResolver": 9,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    19: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var MemoryAmflowClient = function() {
            function MemoryAmflowClient(param) {
                this._playId = param.playId, this._putStorageDataSyncFunc = param.putStorageDataSyncFunc || function() {
                    throw new Error("Implementation not given");
                }, this._getStorageDataSyncFunc = param.getStorageDataSyncFunc || function() {
                    throw new Error("Implementation not given");
                }, this._tickHandlers = [], this._eventHandlers = [], this._events = [], this._tickList = null, 
                param.startPoints ? (this._tickList = param.tickList, this._startPoints = param.startPoints) : this._startPoints = [];
            }
            return MemoryAmflowClient.prototype.dump = function() {
                return {
                    tickList: this._tickList,
                    startPoints: this._startPoints
                };
            }, MemoryAmflowClient.prototype.open = function(playId, callback) {
                var _this = this;
                setTimeout(function() {
                    return playId !== _this._playId ? void callback(new Error("MemoryAmflowClient#open: unknown playId")) : void callback();
                }, 0);
            }, MemoryAmflowClient.prototype.close = function(callback) {
                setTimeout(function() {
                    callback();
                }, 0);
            }, MemoryAmflowClient.prototype.authenticate = function(token, callback) {
                setTimeout(function() {
                    switch (token) {
                      case MemoryAmflowClient.TOKEN_ACTIVE:
                        callback(null, {
                            writeTick: !0,
                            readTick: !0,
                            subscribeTick: !1,
                            sendEvent: !1,
                            subscribeEvent: !0,
                            maxEventPriority: 2
                        });
                        break;

                      case MemoryAmflowClient.TOKEN_PASSIVE:
                        callback(null, {
                            writeTick: !1,
                            readTick: !0,
                            subscribeTick: !0,
                            sendEvent: !0,
                            subscribeEvent: !1,
                            maxEventPriority: 2
                        });
                        break;

                      default:
                        callback(null, {
                            writeTick: !0,
                            readTick: !0,
                            subscribeTick: !0,
                            sendEvent: !0,
                            subscribeEvent: !0,
                            maxEventPriority: 2
                        });
                    }
                }, 0);
            }, MemoryAmflowClient.prototype.sendTick = function(tick) {
                if (this._tickList) {
                    if (this._tickList[0] <= tick[0] && tick[0] <= this._tickList[1]) throw new Error("illegal age tick");
                    this._tickList[1] = tick[0];
                } else this._tickList = [ tick[0], tick[0], [] ];
                (tick[1] || tick[2]) && this._tickList[2].push(tick), this._tickHandlers.forEach(function(h) {
                    return h(tick);
                });
            }, MemoryAmflowClient.prototype.onTick = function(handler) {
                this._tickHandlers.push(handler);
            }, MemoryAmflowClient.prototype.offTick = function(handler) {
                this._tickHandlers = this._tickHandlers.filter(function(h) {
                    return h !== handler;
                });
            }, MemoryAmflowClient.prototype.sendEvent = function(pev) {
                return 0 === this._eventHandlers.length ? void this._events.push(pev) : void this._eventHandlers.forEach(function(h) {
                    return h(pev);
                });
            }, MemoryAmflowClient.prototype.onEvent = function(handler) {
                var _this = this;
                this._eventHandlers.push(handler), this._events.length > 0 && (this._events.forEach(function(pev) {
                    _this._eventHandlers.forEach(function(h) {
                        return h(pev);
                    });
                }), this._events = []);
            }, MemoryAmflowClient.prototype.offEvent = function(handler) {
                this._eventHandlers = this._eventHandlers.filter(function(h) {
                    return h !== handler;
                });
            }, MemoryAmflowClient.prototype.getTickList = function(from, to, callback) {
                if (!this._tickList) return void setTimeout(function() {
                    return callback(null, null);
                }, 0);
                from = Math.max(from, this._tickList[0]), to = Math.min(to, this._tickList[1]);
                var ticks = this._tickList[2].filter(function(tick) {
                    var age = tick[0];
                    return age >= from && to >= age;
                }), tickList = [ from, to, ticks ];
                setTimeout(function() {
                    return callback(null, tickList);
                }, 0);
            }, MemoryAmflowClient.prototype.putStartPoint = function(startPoint, callback) {
                var _this = this;
                setTimeout(function() {
                    _this._startPoints.push(startPoint), callback(null);
                }, 0);
            }, MemoryAmflowClient.prototype.getStartPoint = function(opts, callback) {
                var _this = this;
                setTimeout(function() {
                    if (!_this._startPoints || 0 === _this._startPoints.length) return void callback(new Error("no startpoint"));
                    var index = 0;
                    if (null != opts.frame) for (var nearestFrame = _this._startPoints[0].frame, i = 1; i < _this._startPoints.length; ++i) {
                        var frame = _this._startPoints[i].frame;
                        frame <= opts.frame && frame > nearestFrame && (nearestFrame = frame, index = i);
                    } else for (var nearestTimestamp = _this._startPoints[0].timestamp, i = 1; i < _this._startPoints.length; ++i) {
                        var timestamp = _this._startPoints[i].timestamp;
                        timestamp <= opts.timestamp && timestamp > nearestTimestamp && (nearestTimestamp = timestamp, 
                        index = i);
                    }
                    callback(null, _this._startPoints[index]);
                }, 0);
            }, MemoryAmflowClient.prototype.putStorageData = function(key, value, options, callback) {
                var _this = this;
                setTimeout(function() {
                    try {
                        _this._putStorageDataSyncFunc(key, value, options), callback(null);
                    } catch (e) {
                        callback(e);
                    }
                }, 0);
            }, MemoryAmflowClient.prototype.getStorageData = function(keys, callback) {
                var _this = this;
                setTimeout(function() {
                    try {
                        var data = _this._getStorageDataSyncFunc(keys);
                        callback(null, data);
                    } catch (e) {
                        callback(e);
                    }
                }, 0);
            }, MemoryAmflowClient.prototype.dropAfter = function(age) {
                if (this._tickList) {
                    var from = this._tickList[0], to = this._tickList[1];
                    from >= age ? (this._tickList = null, this._startPoints = []) : to >= age && (this._tickList[1] = age - 1, 
                    this._tickList[2] = this._tickList[2].filter(function(tick) {
                        var ta = tick[0];
                        return ta >= from && age - 1 >= ta;
                    }), this._startPoints = this._startPoints.filter(function(sp) {
                        return sp.frame < age;
                    }));
                }
            }, MemoryAmflowClient.TOKEN_ACTIVE = "mamfc-token:active", MemoryAmflowClient.TOKEN_PASSIVE = "mamfc-token:passive", 
            MemoryAmflowClient;
        }();
        exports.MemoryAmflowClient = MemoryAmflowClient;
    }, {} ],
    20: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var ReplayAmflowProxy = function() {
            function ReplayAmflowProxy(param) {
                this._amflow = param.amflow, this._tickList = param.tickList, this._startPoints = param.startPoints;
            }
            return ReplayAmflowProxy.prototype.dropAfter = function(age) {
                if (this._tickList) {
                    var givenFrom = this._tickList[0], givenTo = this._tickList[1], givenTicksWithEvents = this._tickList[2];
                    givenFrom >= age ? (this._tickList = null, this._startPoints = []) : givenTo >= age && (this._tickList[1] = age - 1, 
                    this._tickList[2] = this._sliceTicks(givenTicksWithEvents, givenTo, age - 1), this._startPoints = this._startPoints.filter(function(sp) {
                        return sp.frame < age;
                    }));
                }
            }, ReplayAmflowProxy.prototype.open = function(playId, callback) {
                this._amflow.open(playId, callback);
            }, ReplayAmflowProxy.prototype.close = function(callback) {
                this._amflow.close(callback);
            }, ReplayAmflowProxy.prototype.authenticate = function(token, callback) {
                this._amflow.authenticate(token, callback);
            }, ReplayAmflowProxy.prototype.sendTick = function(tick) {
                this._amflow.sendTick(tick);
            }, ReplayAmflowProxy.prototype.onTick = function(handler) {
                this._amflow.onTick(handler);
            }, ReplayAmflowProxy.prototype.offTick = function(handler) {
                this._amflow.offTick(handler);
            }, ReplayAmflowProxy.prototype.sendEvent = function(event) {
                this._amflow.sendEvent(event);
            }, ReplayAmflowProxy.prototype.onEvent = function(handler) {
                this._amflow.onEvent(handler);
            }, ReplayAmflowProxy.prototype.offEvent = function(handler) {
                this._amflow.offEvent(handler);
            }, ReplayAmflowProxy.prototype.getTickList = function(from, to, callback) {
                var _this = this;
                if (!this._tickList) return void this._amflow.getTickList(from, to, callback);
                var givenFrom = this._tickList[0], givenTo = this._tickList[1], givenTicksWithEvents = this._tickList[2], fromInGiven = from >= givenFrom && givenTo >= from, toInGiven = to >= givenFrom && givenTo >= to;
                fromInGiven && toInGiven ? setTimeout(function() {
                    callback(null, [ from, to, _this._sliceTicks(givenTicksWithEvents, from, to) ]);
                }, 0) : this._amflow.getTickList(from, to, function(err, tickList) {
                    if (err) return void callback(err);
                    if (tickList) if (fromInGiven || toInGiven) if (fromInGiven) {
                        var ticksWithEvents = _this._sliceTicks(givenTicksWithEvents, from, to).concat(tickList[2] || []);
                        callback(null, [ from, tickList[1], ticksWithEvents ]);
                    } else {
                        var ticksWithEvents = (tickList[2] || []).concat(_this._sliceTicks(givenTicksWithEvents, from, to));
                        callback(null, [ tickList[0], to, ticksWithEvents ]);
                    } else if (givenFrom > to || from > givenTo) callback(null, tickList); else {
                        var ticksWithEvents = tickList[2];
                        if (ticksWithEvents) {
                            var beforeGiven = _this._sliceTicks(ticksWithEvents, from, givenFrom - 1), afterGiven = _this._sliceTicks(ticksWithEvents, givenTo + 1, to);
                            ticksWithEvents = beforeGiven.concat(givenTicksWithEvents, afterGiven);
                        } else ticksWithEvents = givenTicksWithEvents;
                        callback(null, [ from, to, ticksWithEvents ]);
                    } else fromInGiven || toInGiven ? fromInGiven ? callback(null, [ from, givenTo, _this._sliceTicks(givenTicksWithEvents, from, to) ]) : callback(null, [ givenFrom, to, _this._sliceTicks(givenTicksWithEvents, from, to) ]) : givenFrom > to || from > givenTo ? callback(null, tickList) : callback(null, [ givenFrom, givenTo, _this._sliceTicks(givenTicksWithEvents, from, to) ]);
                });
            }, ReplayAmflowProxy.prototype.putStartPoint = function(startPoint, callback) {
                this._amflow.putStartPoint(startPoint, callback);
            }, ReplayAmflowProxy.prototype.getStartPoint = function(opts, callback) {
                var _this = this, index = 0;
                if (this._startPoints.length > 0) if (null != opts.frame) for (var nearestFrame = this._startPoints[0].frame, i = 1; i < this._startPoints.length; ++i) {
                    var frame = this._startPoints[i].frame;
                    frame <= opts.frame && frame > nearestFrame && (nearestFrame = frame, index = i);
                } else for (var nearestTimestamp = this._startPoints[0].timestamp, i = 1; i < this._startPoints.length; ++i) {
                    var timestamp = this._startPoints[i].timestamp;
                    timestamp <= opts.timestamp && timestamp > nearestTimestamp && (nearestTimestamp = timestamp, 
                    index = i);
                }
                var givenTo = this._tickList ? this._tickList[1] : -1;
                opts.frame > givenTo ? this._amflow.getStartPoint(opts, function(err, startPoint) {
                    return err ? void callback(err) : void (givenTo < startPoint.frame ? callback(null, startPoint) : callback(null, _this._startPoints[index]));
                }) : setTimeout(function() {
                    callback(null, _this._startPoints[index]);
                }, 0);
            }, ReplayAmflowProxy.prototype.putStorageData = function(key, value, options, callback) {
                this._amflow.putStorageData(key, value, options, callback);
            }, ReplayAmflowProxy.prototype.getStorageData = function(keys, callback) {
                this._amflow.getStorageData(keys, callback);
            }, ReplayAmflowProxy.prototype._sliceTicks = function(ticks, from, to) {
                return ticks.filter(function(t) {
                    var age = t[0];
                    return age >= from && to >= age;
                });
            }, ReplayAmflowProxy;
        }();
        exports.ReplayAmflowProxy = ReplayAmflowProxy;
    }, {} ],
    21: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), SimpleProfiler = function() {
            function SimpleProfiler(param) {
                this._interval = null != param.interval ? param.interval : SimpleProfiler.DEFAULT_INTERVAL, 
                null != param.limit ? this._limit = param.limit >= SimpleProfiler.DEFAULT_LIMIT ? param.limit : SimpleProfiler.DEFAULT_LIMIT : this._limit = SimpleProfiler.DEFAULT_LIMIT, 
                this._calculateProfilerValueTrigger = new g.Trigger(), param.getValueHandler && this._calculateProfilerValueTrigger.handle(param.getValueHandlerOwner, param.getValueHandler), 
                this._reset();
            }
            return SimpleProfiler.prototype.time = function(type) {
                this._beforeTimes[type] = this._getCurrentTime();
            }, SimpleProfiler.prototype.timeEnd = function(type) {
                var now = this._getCurrentTime(), value = null != this._beforeTimes[type] ? now - this._beforeTimes[type] : 0;
                this._values[type].push({
                    time: now,
                    value: value
                });
            }, SimpleProfiler.prototype.flush = function() {
                var now = this._getCurrentTime();
                if (0 === this._beforeFlushTime && (this._beforeFlushTime = now), this._beforeFlushTime + this._interval < now && (this._calculateProfilerValueTrigger.fire(this.getProfilerValue(this._interval)), 
                this._beforeFlushTime = now), this._values[1].length > this._limit) for (var i in this._values) this._values.hasOwnProperty(i) && (this._values[i] = this._values[i].slice(-SimpleProfiler.BACKUP_MARGIN));
            }, SimpleProfiler.prototype.setValue = function(type, value) {
                this._values[type].push({
                    time: this._getCurrentTime(),
                    value: value
                });
            }, SimpleProfiler.prototype.getProfilerValue = function(time) {
                var rawFrameInterval = this._calculateProfilerValue(1, time);
                return {
                    skippedFrameCount: this._calculateProfilerValue(0, time),
                    rawFrameInterval: rawFrameInterval,
                    framePerSecond: {
                        ave: 1e3 / rawFrameInterval.ave,
                        max: 1e3 / rawFrameInterval.min,
                        min: 1e3 / rawFrameInterval.max
                    },
                    frameTime: this._calculateProfilerValue(2, time),
                    renderingTime: this._calculateProfilerValue(3, time)
                };
            }, SimpleProfiler.prototype._reset = function() {
                this._startTime = this._getCurrentTime(), this._beforeFlushTime = 0, this._beforeTimes = [], 
                this._beforeTimes[1] = 0, this._beforeTimes[2] = 0, this._beforeTimes[3] = 0, this._beforeTimes[0] = 0, 
                this._values = [], this._values[1] = [], this._values[2] = [], this._values[3] = [], 
                this._values[0] = [];
            }, SimpleProfiler.prototype._calculateProfilerValue = function(type, time) {
                for (var limit = this._getCurrentTime() - time, sum = 0, num = 0, max = 0, min = Number.MAX_VALUE, i = this._values[type].length - 1; i >= 0 && !(num > 0 && this._values[type][i].time < limit); --i) {
                    var value = this._values[type][i].value;
                    value > max && (max = value), min > value && (min = value), sum += value, ++num;
                }
                return {
                    ave: sum / num,
                    max: max,
                    min: min
                };
            }, SimpleProfiler.prototype._getCurrentTime = function() {
                return +new Date();
            }, SimpleProfiler.DEFAULT_INTERVAL = 1e3, SimpleProfiler.DEFAULT_LIMIT = 1e3, SimpleProfiler.BACKUP_MARGIN = 100, 
            SimpleProfiler;
        }();
        exports.SimpleProfiler = SimpleProfiler;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    22: [ function(require, module, exports) {
        "use strict";
    }, {} ],
    23: [ function(require, module, exports) {
        (function(process, global) {
            /*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   3.3.1
 */
            !function(global, factory) {
                "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : global.ES6Promise = factory();
            }(this, function() {
                "use strict";
                function objectOrFunction(x) {
                    return "function" == typeof x || "object" == typeof x && null !== x;
                }
                function isFunction(x) {
                    return "function" == typeof x;
                }
                function setScheduler(scheduleFn) {
                    customSchedulerFn = scheduleFn;
                }
                function setAsap(asapFn) {
                    asap = asapFn;
                }
                function useNextTick() {
                    return function() {
                        return process.nextTick(flush);
                    };
                }
                function useVertxTimer() {
                    return function() {
                        vertxNext(flush);
                    };
                }
                function useMutationObserver() {
                    var iterations = 0, observer = new BrowserMutationObserver(flush), node = document.createTextNode("");
                    return observer.observe(node, {
                        characterData: !0
                    }), function() {
                        node.data = iterations = ++iterations % 2;
                    };
                }
                function useMessageChannel() {
                    var channel = new MessageChannel();
                    return channel.port1.onmessage = flush, function() {
                        return channel.port2.postMessage(0);
                    };
                }
                function useSetTimeout() {
                    var globalSetTimeout = setTimeout;
                    return function() {
                        return globalSetTimeout(flush, 1);
                    };
                }
                function flush() {
                    for (var i = 0; len > i; i += 2) {
                        var callback = queue[i], arg = queue[i + 1];
                        callback(arg), queue[i] = void 0, queue[i + 1] = void 0;
                    }
                    len = 0;
                }
                function attemptVertx() {
                    try {
                        var r = require, vertx = r("vertx");
                        return vertxNext = vertx.runOnLoop || vertx.runOnContext, useVertxTimer();
                    } catch (e) {
                        return useSetTimeout();
                    }
                }
                function then(onFulfillment, onRejection) {
                    var _arguments = arguments, parent = this, child = new this.constructor(noop);
                    void 0 === child[PROMISE_ID] && makePromise(child);
                    var _state = parent._state;
                    return _state ? !function() {
                        var callback = _arguments[_state - 1];
                        asap(function() {
                            return invokeCallback(_state, child, callback, parent._result);
                        });
                    }() : subscribe(parent, child, onFulfillment, onRejection), child;
                }
                function resolve(object) {
                    var Constructor = this;
                    if (object && "object" == typeof object && object.constructor === Constructor) return object;
                    var promise = new Constructor(noop);
                    return _resolve(promise, object), promise;
                }
                function noop() {}
                function selfFulfillment() {
                    return new TypeError("You cannot resolve a promise with itself");
                }
                function cannotReturnOwn() {
                    return new TypeError("A promises callback cannot return that same promise.");
                }
                function getThen(promise) {
                    try {
                        return promise.then;
                    } catch (error) {
                        return GET_THEN_ERROR.error = error, GET_THEN_ERROR;
                    }
                }
                function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                    try {
                        then.call(value, fulfillmentHandler, rejectionHandler);
                    } catch (e) {
                        return e;
                    }
                }
                function handleForeignThenable(promise, thenable, then) {
                    asap(function(promise) {
                        var sealed = !1, error = tryThen(then, thenable, function(value) {
                            sealed || (sealed = !0, thenable !== value ? _resolve(promise, value) : fulfill(promise, value));
                        }, function(reason) {
                            sealed || (sealed = !0, _reject(promise, reason));
                        }, "Settle: " + (promise._label || " unknown promise"));
                        !sealed && error && (sealed = !0, _reject(promise, error));
                    }, promise);
                }
                function handleOwnThenable(promise, thenable) {
                    thenable._state === FULFILLED ? fulfill(promise, thenable._result) : thenable._state === REJECTED ? _reject(promise, thenable._result) : subscribe(thenable, void 0, function(value) {
                        return _resolve(promise, value);
                    }, function(reason) {
                        return _reject(promise, reason);
                    });
                }
                function handleMaybeThenable(promise, maybeThenable, then$$) {
                    maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve ? handleOwnThenable(promise, maybeThenable) : then$$ === GET_THEN_ERROR ? _reject(promise, GET_THEN_ERROR.error) : void 0 === then$$ ? fulfill(promise, maybeThenable) : isFunction(then$$) ? handleForeignThenable(promise, maybeThenable, then$$) : fulfill(promise, maybeThenable);
                }
                function _resolve(promise, value) {
                    promise === value ? _reject(promise, selfFulfillment()) : objectOrFunction(value) ? handleMaybeThenable(promise, value, getThen(value)) : fulfill(promise, value);
                }
                function publishRejection(promise) {
                    promise._onerror && promise._onerror(promise._result), publish(promise);
                }
                function fulfill(promise, value) {
                    promise._state === PENDING && (promise._result = value, promise._state = FULFILLED, 
                    0 !== promise._subscribers.length && asap(publish, promise));
                }
                function _reject(promise, reason) {
                    promise._state === PENDING && (promise._state = REJECTED, promise._result = reason, 
                    asap(publishRejection, promise));
                }
                function subscribe(parent, child, onFulfillment, onRejection) {
                    var _subscribers = parent._subscribers, length = _subscribers.length;
                    parent._onerror = null, _subscribers[length] = child, _subscribers[length + FULFILLED] = onFulfillment, 
                    _subscribers[length + REJECTED] = onRejection, 0 === length && parent._state && asap(publish, parent);
                }
                function publish(promise) {
                    var subscribers = promise._subscribers, settled = promise._state;
                    if (0 !== subscribers.length) {
                        for (var child = void 0, callback = void 0, detail = promise._result, i = 0; i < subscribers.length; i += 3) child = subscribers[i], 
                        callback = subscribers[i + settled], child ? invokeCallback(settled, child, callback, detail) : callback(detail);
                        promise._subscribers.length = 0;
                    }
                }
                function ErrorObject() {
                    this.error = null;
                }
                function tryCatch(callback, detail) {
                    try {
                        return callback(detail);
                    } catch (e) {
                        return TRY_CATCH_ERROR.error = e, TRY_CATCH_ERROR;
                    }
                }
                function invokeCallback(settled, promise, callback, detail) {
                    var hasCallback = isFunction(callback), value = void 0, error = void 0, succeeded = void 0, failed = void 0;
                    if (hasCallback) {
                        if (value = tryCatch(callback, detail), value === TRY_CATCH_ERROR ? (failed = !0, 
                        error = value.error, value = null) : succeeded = !0, promise === value) return void _reject(promise, cannotReturnOwn());
                    } else value = detail, succeeded = !0;
                    promise._state !== PENDING || (hasCallback && succeeded ? _resolve(promise, value) : failed ? _reject(promise, error) : settled === FULFILLED ? fulfill(promise, value) : settled === REJECTED && _reject(promise, value));
                }
                function initializePromise(promise, resolver) {
                    try {
                        resolver(function(value) {
                            _resolve(promise, value);
                        }, function(reason) {
                            _reject(promise, reason);
                        });
                    } catch (e) {
                        _reject(promise, e);
                    }
                }
                function nextId() {
                    return id++;
                }
                function makePromise(promise) {
                    promise[PROMISE_ID] = id++, promise._state = void 0, promise._result = void 0, promise._subscribers = [];
                }
                function Enumerator(Constructor, input) {
                    this._instanceConstructor = Constructor, this.promise = new Constructor(noop), this.promise[PROMISE_ID] || makePromise(this.promise), 
                    isArray(input) ? (this._input = input, this.length = input.length, this._remaining = input.length, 
                    this._result = new Array(this.length), 0 === this.length ? fulfill(this.promise, this._result) : (this.length = this.length || 0, 
                    this._enumerate(), 0 === this._remaining && fulfill(this.promise, this._result))) : _reject(this.promise, validationError());
                }
                function validationError() {
                    return new Error("Array Methods must be provided an Array");
                }
                function all(entries) {
                    return new Enumerator(this, entries).promise;
                }
                function race(entries) {
                    var Constructor = this;
                    return new Constructor(isArray(entries) ? function(resolve, reject) {
                        for (var length = entries.length, i = 0; length > i; i++) Constructor.resolve(entries[i]).then(resolve, reject);
                    } : function(_, reject) {
                        return reject(new TypeError("You must pass an array to race."));
                    });
                }
                function reject(reason) {
                    var Constructor = this, promise = new Constructor(noop);
                    return _reject(promise, reason), promise;
                }
                function needsResolver() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                }
                function needsNew() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                }
                function Promise(resolver) {
                    this[PROMISE_ID] = nextId(), this._result = this._state = void 0, this._subscribers = [], 
                    noop !== resolver && ("function" != typeof resolver && needsResolver(), this instanceof Promise ? initializePromise(this, resolver) : needsNew());
                }
                function polyfill() {
                    var local = void 0;
                    if ("undefined" != typeof global) local = global; else if ("undefined" != typeof self) local = self; else try {
                        local = Function("return this")();
                    } catch (e) {
                        throw new Error("polyfill failed because global object is unavailable in this environment");
                    }
                    var P = local.Promise;
                    if (P) {
                        var promiseToString = null;
                        try {
                            promiseToString = Object.prototype.toString.call(P.resolve());
                        } catch (e) {}
                        if ("[object Promise]" === promiseToString && !P.cast) return;
                    }
                    local.Promise = Promise;
                }
                var _isArray = void 0;
                _isArray = Array.isArray ? Array.isArray : function(x) {
                    return "[object Array]" === Object.prototype.toString.call(x);
                };
                var isArray = _isArray, len = 0, vertxNext = void 0, customSchedulerFn = void 0, asap = function(callback, arg) {
                    queue[len] = callback, queue[len + 1] = arg, len += 2, 2 === len && (customSchedulerFn ? customSchedulerFn(flush) : scheduleFlush());
                }, browserWindow = "undefined" != typeof window ? window : void 0, browserGlobal = browserWindow || {}, BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver, isNode = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process), isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, queue = new Array(1e3), scheduleFlush = void 0;
                scheduleFlush = isNode ? useNextTick() : BrowserMutationObserver ? useMutationObserver() : isWorker ? useMessageChannel() : void 0 === browserWindow && "function" == typeof require ? attemptVertx() : useSetTimeout();
                var PROMISE_ID = Math.random().toString(36).substring(16), PENDING = void 0, FULFILLED = 1, REJECTED = 2, GET_THEN_ERROR = new ErrorObject(), TRY_CATCH_ERROR = new ErrorObject(), id = 0;
                return Enumerator.prototype._enumerate = function() {
                    for (var length = this.length, _input = this._input, i = 0; this._state === PENDING && length > i; i++) this._eachEntry(_input[i], i);
                }, Enumerator.prototype._eachEntry = function(entry, i) {
                    var c = this._instanceConstructor, resolve$$ = c.resolve;
                    if (resolve$$ === resolve) {
                        var _then = getThen(entry);
                        if (_then === then && entry._state !== PENDING) this._settledAt(entry._state, i, entry._result); else if ("function" != typeof _then) this._remaining--, 
                        this._result[i] = entry; else if (c === Promise) {
                            var promise = new c(noop);
                            handleMaybeThenable(promise, entry, _then), this._willSettleAt(promise, i);
                        } else this._willSettleAt(new c(function(resolve$$) {
                            return resolve$$(entry);
                        }), i);
                    } else this._willSettleAt(resolve$$(entry), i);
                }, Enumerator.prototype._settledAt = function(state, i, value) {
                    var promise = this.promise;
                    promise._state === PENDING && (this._remaining--, state === REJECTED ? _reject(promise, value) : this._result[i] = value), 
                    0 === this._remaining && fulfill(promise, this._result);
                }, Enumerator.prototype._willSettleAt = function(promise, i) {
                    var enumerator = this;
                    subscribe(promise, void 0, function(value) {
                        return enumerator._settledAt(FULFILLED, i, value);
                    }, function(reason) {
                        return enumerator._settledAt(REJECTED, i, reason);
                    });
                }, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, 
                Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, 
                Promise.prototype = {
                    constructor: Promise,
                    then: then,
                    "catch": function(onRejection) {
                        return this.then(null, onRejection);
                    }
                }, polyfill(), Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
            });
        }).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        _process: 24
    } ],
    24: [ function(require, module, exports) {
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
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
            clearTimeout(marker);
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
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
                currentQueue = null, draining = !1, runClearTimeout(timeout);
            }
        }
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
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
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
        process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.prependListener = noop, process.prependOnceListener = noop, 
        process.listeners = function(name) {
            return [];
        }, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, {} ],
    "@akashic/game-driver": [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var EventIndex = require("./EventIndex");
        exports.EventIndex = EventIndex;
        var LoopMode_1 = require("./LoopMode");
        exports.LoopMode = LoopMode_1["default"];
        var LoopRenderMode_1 = require("./LoopRenderMode");
        exports.LoopRenderMode = LoopRenderMode_1["default"];
        var ExecutionMode_1 = require("./ExecutionMode");
        exports.ExecutionMode = ExecutionMode_1["default"];
        var GameDriver_1 = require("./GameDriver");
        exports.GameDriver = GameDriver_1.GameDriver;
        var Game_1 = require("./Game");
        exports.Game = Game_1.Game;
        var ReplayAmflowProxy_1 = require("./auxiliary/ReplayAmflowProxy");
        exports.ReplayAmflowProxy = ReplayAmflowProxy_1.ReplayAmflowProxy;
        var MemoryAmflowClient_1 = require("./auxiliary/MemoryAmflowClient");
        exports.MemoryAmflowClient = MemoryAmflowClient_1.MemoryAmflowClient;
        var SimpleProfiler_1 = require("./auxiliary/SimpleProfiler");
        exports.SimpleProfiler = SimpleProfiler_1.SimpleProfiler;
    }, {
        "./EventIndex": 4,
        "./ExecutionMode": 5,
        "./Game": 6,
        "./GameDriver": 7,
        "./LoopMode": 10,
        "./LoopRenderMode": 11,
        "./auxiliary/MemoryAmflowClient": 19,
        "./auxiliary/ReplayAmflowProxy": 20,
        "./auxiliary/SimpleProfiler": 21
    } ]
}, {}, []);