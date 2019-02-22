require = function e(t, n, r) {
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
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s;
}({
    1: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var AudioManager = function() {
            function AudioManager() {
                this.audioAssets = [], this._masterVolume = 1;
            }
            return AudioManager.prototype.registerAudioAsset = function(asset) {
                -1 === this.audioAssets.indexOf(asset) && this.audioAssets.push(asset);
            }, AudioManager.prototype.removeAudioAsset = function(asset) {
                var index = this.audioAssets.indexOf(asset);
                -1 === index && this.audioAssets.splice(index, 1);
            }, AudioManager.prototype.setMasterVolume = function(volume) {
                this._masterVolume = volume;
                for (var i = 0; i < this.audioAssets.length; i++) this.audioAssets[i]._lastPlayedPlayer && this.audioAssets[i]._lastPlayedPlayer.notifyMasterVolumeChanged();
            }, AudioManager.prototype.getMasterVolume = function() {
                return this._masterVolume;
            }, AudioManager;
        }();
        exports.AudioManager = AudioManager;
    }, {} ],
    2: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), InputHandlerLayer_1 = require("./InputHandlerLayer"), ContainerController = function() {
            function ContainerController(resourceFactory) {
                this.container = null, this.surface = null, this.inputHandlerLayer = null, this.rootView = null, 
                this.useResizeForScaling = !1, this.pointEventTrigger = new g.Trigger(), this._rendererReq = null, 
                this._disablePreventDefault = !1, this.resourceFactory = resourceFactory;
            }
            return ContainerController.prototype.initialize = function(param) {
                this._rendererReq = param.rendererRequirement, this._disablePreventDefault = !!param.disablePreventDefault, 
                this._loadView();
            }, ContainerController.prototype.setRootView = function(rootView) {
                rootView !== this.rootView && (this.rootView && (this.unloadView(), this._loadView()), 
                this.rootView = rootView, this._appendToRootView(rootView));
            }, ContainerController.prototype.resetView = function(rendererReq) {
                this.unloadView(), this._rendererReq = rendererReq, this._loadView(), this._appendToRootView(this.rootView);
            }, ContainerController.prototype.getRenderer = function() {
                if (!this.surface) throw new Error("this container has no surface");
                return this.surface.renderer();
            }, ContainerController.prototype.changeScale = function(xScale, yScale) {
                this.useResizeForScaling ? this.surface.changePhysicalScale(xScale, yScale) : this.surface.changeVisualScale(xScale, yScale), 
                this.inputHandlerLayer._inputHandler.setScale(xScale, yScale);
            }, ContainerController.prototype.unloadView = function() {
                if (this.inputHandlerLayer.disablePointerEvent(), this.rootView) for (;this.rootView.firstChild; ) this.rootView.removeChild(this.rootView.firstChild);
            }, ContainerController.prototype._loadView = function() {
                var _a = this._rendererReq, width = _a.primarySurfaceWidth, height = _a.primarySurfaceHeight, disablePreventDefault = this._disablePreventDefault;
                this.container = document.createDocumentFragment(), this.inputHandlerLayer ? (this.inputHandlerLayer.setViewSize({
                    width: width,
                    height: height
                }), this.inputHandlerLayer.pointEventTrigger.removeAll(), this.inputHandlerLayer.view.removeChild(this.surface.canvas), 
                this.surface.destroy()) : this.inputHandlerLayer = new InputHandlerLayer_1.InputHandlerLayer({
                    width: width,
                    height: height,
                    disablePreventDefault: disablePreventDefault
                }), this.surface = this.resourceFactory.createPrimarySurface(width, height), this.inputHandlerLayer.view.appendChild(this.surface.getHTMLElement()), 
                this.container.appendChild(this.inputHandlerLayer.view);
            }, ContainerController.prototype._appendToRootView = function(rootView) {
                rootView.appendChild(this.container), this.inputHandlerLayer.enablePointerEvent(), 
                this.inputHandlerLayer.pointEventTrigger.add(this.pointEventTrigger.fire, this.pointEventTrigger);
            }, ContainerController;
        }();
        exports.ContainerController = ContainerController;
    }, {
        "./InputHandlerLayer": 3,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    3: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), TouchHandler_1 = require("./handler/TouchHandler"), InputHandlerLayer = function() {
            function InputHandlerLayer(param) {
                this.view = this._createInputView(param.width, param.height), this._inputHandler = void 0, 
                this.pointEventTrigger = new g.Trigger(), this._disablePreventDefault = !!param.disablePreventDefault;
            }
            return InputHandlerLayer.prototype.enablePointerEvent = function() {
                var _this = this;
                this._inputHandler = new TouchHandler_1.TouchHandler(this.view, this._disablePreventDefault), 
                this._inputHandler.pointTrigger.add(function(e) {
                    _this.pointEventTrigger.fire(e);
                }), this._inputHandler.start();
            }, InputHandlerLayer.prototype.disablePointerEvent = function() {
                this._inputHandler && this._inputHandler.stop();
            }, InputHandlerLayer.prototype.setOffset = function(offset) {
                var inputViewStyle = "position:relative; left:" + offset.x + "px; top:" + offset.y + "px";
                this._inputHandler.inputView.setAttribute("style", inputViewStyle);
            }, InputHandlerLayer.prototype.setViewSize = function(size) {
                var view = this.view;
                view.style.width = size.width + "px", view.style.height = size.height + "px";
            }, InputHandlerLayer.prototype._createInputView = function(width, height) {
                var view = document.createElement("div");
                return view.setAttribute("tabindex", "1"), view.className = "input-handler", view.setAttribute("style", "display:inline-block; outline:none;"), 
                view.style.width = width + "px", view.style.height = height + "px", view;
            }, InputHandlerLayer;
        }();
        exports.InputHandlerLayer = InputHandlerLayer;
    }, {
        "./handler/TouchHandler": 32,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    4: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RafLooper_1 = require("./RafLooper"), ResourceFactory_1 = require("./ResourceFactory"), ContainerController_1 = require("./ContainerController"), AudioPluginManager_1 = require("./plugin/AudioPluginManager"), AudioManager_1 = require("./AudioManager"), AudioPluginRegistry_1 = require("./plugin/AudioPluginRegistry"), XHRTextAsset_1 = require("./asset/XHRTextAsset"), Platform = function() {
            function Platform(param) {
                this.containerView = param.containerView, this.audioPluginManager = new AudioPluginManager_1.AudioPluginManager(), 
                param.audioPlugins && this.audioPluginManager.tryInstallPlugin(param.audioPlugins), 
                this.audioPluginManager.tryInstallPlugin(AudioPluginRegistry_1.AudioPluginRegistry.getRegisteredAudioPlugins()), 
                this._audioManager = new AudioManager_1.AudioManager(), this.amflow = param.amflow, 
                this._platformEventHandler = null, this._resourceFactory = param.resourceFactory || new ResourceFactory_1.ResourceFactory({
                    audioPluginManager: this.audioPluginManager,
                    platform: this,
                    audioManager: this._audioManager
                }), this.containerController = new ContainerController_1.ContainerController(this._resourceFactory), 
                this._rendererReq = null, this._disablePreventDefault = !!param.disablePreventDefault;
            }
            return Platform.prototype.setPlatformEventHandler = function(handler) {
                this.containerController && (this.containerController.pointEventTrigger.removeAll({
                    owner: this._platformEventHandler
                }), this.containerController.pointEventTrigger.add(handler.onPointEvent, handler)), 
                this._platformEventHandler = handler;
            }, Platform.prototype.loadGameConfiguration = function(url, callback) {
                var a = new XHRTextAsset_1.XHRTextAsset("(game.json)", url);
                a._load({
                    _onAssetLoad: function(asset) {
                        callback(null, JSON.parse(a.data));
                    },
                    _onAssetError: function(asset, error) {
                        callback(error, null);
                    }
                });
            }, Platform.prototype.getResourceFactory = function() {
                return this._resourceFactory;
            }, Platform.prototype.setRendererRequirement = function(requirement) {
                if (!requirement) return void (this.containerController && this.containerController.unloadView());
                if (this._rendererReq = requirement, this._resourceFactory._rendererCandidates = this._rendererReq.rendererCandidates, 
                this.containerController && !this.containerController.inputHandlerLayer) this.containerController.initialize({
                    rendererRequirement: requirement,
                    disablePreventDefault: this._disablePreventDefault
                }), this.containerController.setRootView(this.containerView), this._platformEventHandler && this.containerController.pointEventTrigger.add(this._platformEventHandler.onPointEvent, this._platformEventHandler); else {
                    var surface = this.getPrimarySurface();
                    surface && !surface.destroyed() && surface.destroy(), this.containerController.resetView(requirement);
                }
            }, Platform.prototype.getPrimarySurface = function() {
                return this.containerController.surface;
            }, Platform.prototype.getOperationPluginViewInfo = function() {
                var _this = this;
                return {
                    type: "pdi-browser",
                    view: this.containerController.inputHandlerLayer.view,
                    getScale: function() {
                        return _this.containerController.inputHandlerLayer._inputHandler.getScale();
                    }
                };
            }, Platform.prototype.createLooper = function(fun) {
                return new RafLooper_1.RafLooper(fun);
            }, Platform.prototype.sendToExternal = function(playId, data) {}, Platform.prototype.registerAudioPlugins = function(plugins) {
                return this.audioPluginManager.tryInstallPlugin(plugins);
            }, Platform.prototype.setScale = function(xScale, yScale) {
                this.containerController.changeScale(xScale, yScale);
            }, Platform.prototype.notifyViewMoved = function() {}, Platform.prototype.setMasterVolume = function(volume) {
                this._audioManager && this._audioManager.setMasterVolume(volume);
            }, Platform.prototype.getMasterVolume = function() {
                return this._audioManager ? this._audioManager.getMasterVolume() : void 0;
            }, Platform;
        }();
        exports.Platform = Platform;
    }, {
        "./AudioManager": 1,
        "./ContainerController": 2,
        "./RafLooper": 5,
        "./ResourceFactory": 6,
        "./asset/XHRTextAsset": 11,
        "./plugin/AudioPluginManager": 33,
        "./plugin/AudioPluginRegistry": 34
    } ],
    5: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RafLooper = function() {
            function RafLooper(fun) {
                this._fun = fun, this._timerId = void 0, this._prev = 0;
            }
            return RafLooper.prototype.start = function() {
                var _this = this, onAnimationFrame = function(deltaTime) {
                    null != _this._timerId && (_this._timerId = requestAnimationFrame(onAnimationFrame), 
                    _this._fun(deltaTime - _this._prev), _this._prev = deltaTime);
                }, onFirstFrame = function(deltaTime) {
                    _this._timerId = requestAnimationFrame(onAnimationFrame), _this._fun(0), _this._prev = deltaTime;
                };
                this._timerId = requestAnimationFrame(onFirstFrame);
            }, RafLooper.prototype.stop = function() {
                cancelAnimationFrame(this._timerId), this._timerId = void 0, this._prev = 0;
            }, RafLooper;
        }();
        exports.RafLooper = RafLooper;
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
        var g = require("@akashic/akashic-engine"), HTMLImageAsset_1 = require("./asset/HTMLImageAsset"), HTMLVideoAsset_1 = require("./asset/HTMLVideoAsset"), XHRTextAsset_1 = require("./asset/XHRTextAsset"), XHRScriptAsset_1 = require("./asset/XHRScriptAsset"), GlyphFactory_1 = require("./canvas/GlyphFactory"), SurfaceFactory_1 = require("./canvas/shims/SurfaceFactory"), ResourceFactory = function(_super) {
            function ResourceFactory(param) {
                var _this = _super.call(this) || this;
                return _this._audioPluginManager = param.audioPluginManager, _this._audioManager = param.audioManager, 
                _this._platform = param.platform, _this._surfaceFactory = new SurfaceFactory_1.SurfaceFactory(), 
                _this;
            }
            return __extends(ResourceFactory, _super), ResourceFactory.prototype.createAudioAsset = function(id, assetPath, duration, system, loop, hint) {
                var activePlugin = this._audioPluginManager.getActivePlugin(), audioAsset = activePlugin.createAsset(id, assetPath, duration, system, loop, hint);
                return audioAsset.onDestroyed && (this._audioManager.registerAudioAsset(audioAsset), 
                audioAsset.onDestroyed.add(this._onAudioAssetDestroyed, this)), audioAsset;
            }, ResourceFactory.prototype.createAudioPlayer = function(system) {
                var activePlugin = this._audioPluginManager.getActivePlugin();
                return activePlugin.createPlayer(system, this._audioManager);
            }, ResourceFactory.prototype.createImageAsset = function(id, assetPath, width, height) {
                return new HTMLImageAsset_1.HTMLImageAsset(id, assetPath, width, height);
            }, ResourceFactory.prototype.createVideoAsset = function(id, assetPath, width, height, system, loop, useRealSize) {
                return new HTMLVideoAsset_1.HTMLVideoAsset(id, assetPath, width, height, system, loop, useRealSize);
            }, ResourceFactory.prototype.createTextAsset = function(id, assetPath) {
                return new XHRTextAsset_1.XHRTextAsset(id, assetPath);
            }, ResourceFactory.prototype.createScriptAsset = function(id, assetPath) {
                return new XHRScriptAsset_1.XHRScriptAsset(id, assetPath);
            }, ResourceFactory.prototype.createPrimarySurface = function(width, height) {
                return this._surfaceFactory.createPrimarySurface(width, height, this._rendererCandidates);
            }, ResourceFactory.prototype.createSurface = function(width, height) {
                return this._surfaceFactory.createBackSurface(width, height, this._rendererCandidates);
            }, ResourceFactory.prototype.createGlyphFactory = function(fontFamily, fontSize, baseline, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
                return new GlyphFactory_1.GlyphFactory(fontFamily, fontSize, baseline, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight);
            }, ResourceFactory.prototype._onAudioAssetDestroyed = function(asset) {
                this._audioManager.removeAudioAsset(asset);
            }, ResourceFactory;
        }(g.ResourceFactory);
        exports.ResourceFactory = ResourceFactory;
    }, {
        "./asset/HTMLImageAsset": 7,
        "./asset/HTMLVideoAsset": 8,
        "./asset/XHRScriptAsset": 10,
        "./asset/XHRTextAsset": 11,
        "./canvas/GlyphFactory": 13,
        "./canvas/shims/SurfaceFactory": 17,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    7: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), ImageAssetSurface = function(_super) {
            function ImageAssetSurface(width, height, drawable) {
                return _super.call(this, width, height, drawable) || this;
            }
            return __extends(ImageAssetSurface, _super), ImageAssetSurface.prototype.renderer = function() {
                throw g.ExceptionFactory.createAssertionError("ImageAssetSurface cannot be rendered.");
            }, ImageAssetSurface.prototype.isPlaying = function() {
                return !1;
            }, ImageAssetSurface;
        }(g.Surface);
        exports.ImageAssetSurface = ImageAssetSurface;
        var HTMLImageAsset = function(_super) {
            function HTMLImageAsset(id, path, width, height) {
                var _this = _super.call(this, id, path, width, height) || this;
                return _this.data = void 0, _this._surface = void 0, _this;
            }
            return __extends(HTMLImageAsset, _super), HTMLImageAsset.prototype.destroy = function() {
                this._surface && !this._surface.destroyed() && this._surface.destroy(), this.data = void 0, 
                this._surface = void 0, _super.prototype.destroy.call(this);
            }, HTMLImageAsset.prototype._load = function(loader) {
                var _this = this, image = new Image();
                image.onerror = function() {
                    loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("HTMLImageAsset unknown loading error"));
                }, image.onload = function() {
                    _this.data = image, loader._onAssetLoad(_this);
                }, image.src = this.path;
            }, HTMLImageAsset.prototype.asSurface = function() {
                if (!this.data) throw g.ExceptionFactory.createAssertionError("ImageAssetImpl#asSurface: not yet loaded.");
                return this._surface ? this._surface : (this._surface = new ImageAssetSurface(this.width, this.height, this.data), 
                this._surface);
            }, HTMLImageAsset;
        }(g.ImageAsset);
        exports.HTMLImageAsset = HTMLImageAsset;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    8: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), HTMLVideoPlayer_1 = require("./HTMLVideoPlayer"), VideoAssetSurface = function(_super) {
            function VideoAssetSurface(width, height, drawable) {
                return _super.call(this, width, height, drawable, !0) || this;
            }
            return __extends(VideoAssetSurface, _super), VideoAssetSurface.prototype.renderer = function() {
                throw g.ExceptionFactory.createAssertionError("VideoAssetSurface cannot be rendered.");
            }, VideoAssetSurface.prototype.isPlaying = function() {
                return !1;
            }, VideoAssetSurface;
        }(g.Surface), HTMLVideoAsset = function(_super) {
            function HTMLVideoAsset(id, assetPath, width, height, system, loop, useRealSize) {
                var _this = _super.call(this, id, assetPath, width, height, system, loop, useRealSize) || this;
                return _this._player = new HTMLVideoPlayer_1.HTMLVideoPlayer(), _this._surface = new VideoAssetSurface(width, height, null), 
                _this;
            }
            return __extends(HTMLVideoAsset, _super), HTMLVideoAsset.prototype.inUse = function() {
                return !1;
            }, HTMLVideoAsset.prototype._load = function(loader) {
                var _this = this;
                setTimeout(function() {
                    loader._onAssetLoad(_this);
                }, 0);
            }, HTMLVideoAsset.prototype.getPlayer = function() {
                return this._player;
            }, HTMLVideoAsset.prototype.asSurface = function() {
                return this._surface;
            }, HTMLVideoAsset;
        }(g.VideoAsset);
        exports.HTMLVideoAsset = HTMLVideoAsset;
    }, {
        "./HTMLVideoPlayer": 9,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    9: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), HTMLVideoPlayer = function(_super) {
            function HTMLVideoPlayer(loop) {
                var _this = _super.call(this, loop) || this;
                return _this.isDummy = !0, _this;
            }
            return __extends(HTMLVideoPlayer, _super), HTMLVideoPlayer.prototype.play = function(videoAsset) {}, 
            HTMLVideoPlayer.prototype.stop = function() {}, HTMLVideoPlayer.prototype.changeVolume = function(volume) {}, 
            HTMLVideoPlayer;
        }(g.VideoPlayer);
        exports.HTMLVideoPlayer = HTMLVideoPlayer;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    10: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), XHRLoader_1 = require("../utils/XHRLoader"), XHRScriptAsset = function(_super) {
            function XHRScriptAsset(id, path) {
                var _this = _super.call(this, id, path) || this;
                return _this.script = void 0, _this;
            }
            return __extends(XHRScriptAsset, _super), XHRScriptAsset.prototype._load = function(handler) {
                var _this = this, loader = new XHRLoader_1.XHRLoader();
                loader.get(this.path, function(error, responseText) {
                    return error ? void handler._onAssetError(_this, error) : (_this.script = responseText + "\n", 
                    void handler._onAssetLoad(_this));
                });
            }, XHRScriptAsset.prototype.execute = function(execEnv) {
                var func = this._wrap();
                return func(execEnv), execEnv.module.exports;
            }, XHRScriptAsset.prototype._wrap = function() {
                var func = new Function("g", XHRScriptAsset.PRE_SCRIPT + this.script + XHRScriptAsset.POST_SCRIPT);
                return func;
            }, XHRScriptAsset.PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {", 
            XHRScriptAsset.POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);", 
            XHRScriptAsset;
        }(g.ScriptAsset);
        exports.XHRScriptAsset = XHRScriptAsset;
    }, {
        "../utils/XHRLoader": 48,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    11: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), XHRLoader_1 = require("../utils/XHRLoader"), XHRTextAsset = function(_super) {
            function XHRTextAsset(id, path) {
                var _this = _super.call(this, id, path) || this;
                return _this.data = void 0, _this;
            }
            return __extends(XHRTextAsset, _super), XHRTextAsset.prototype._load = function(handler) {
                var _this = this, loader = new XHRLoader_1.XHRLoader();
                loader.get(this.path, function(error, responseText) {
                    return error ? void handler._onAssetError(_this, error) : (_this.data = responseText, 
                    void handler._onAssetLoad(_this));
                });
            }, XHRTextAsset;
        }(g.TextAsset);
        exports.XHRTextAsset = XHRTextAsset;
    }, {
        "../utils/XHRLoader": 48,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    12: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), CanvasSurface = function(_super) {
            function CanvasSurface(width, height) {
                var _this = this, canvas = document.createElement("canvas");
                return _this = _super.call(this, width, height, canvas) || this, canvas.width = width, 
                canvas.height = height, _this.canvas = canvas, _this._renderer = void 0, _this;
            }
            return __extends(CanvasSurface, _super), CanvasSurface.prototype.destroy = function() {
                this.canvas.width = 1, this.canvas.height = 1, this.canvas = null, this._renderer = null, 
                _super.prototype.destroy.call(this);
            }, CanvasSurface.prototype.getHTMLElement = function() {
                return this.canvas;
            }, CanvasSurface.prototype.changeVisualScale = function(xScale, yScale) {
                var canvasStyle = this.canvas.style;
                "transform" in canvasStyle ? (canvasStyle.transformOrigin = "0 0", canvasStyle.transform = "scale(" + xScale + "," + yScale + ")") : "webkitTransform" in canvasStyle ? (canvasStyle.webkitTransformOrigin = "0 0", 
                canvasStyle.webkitTransform = "scale(" + xScale + "," + yScale + ")") : (canvasStyle.width = Math.floor(xScale * this.width) + "px", 
                canvasStyle.height = Math.floor(yScale * this.width) + "px");
            }, CanvasSurface;
        }(g.Surface);
        exports.CanvasSurface = CanvasSurface;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    13: [ function(require, module, exports) {
        "use strict";
        function createGlyphRenderedSurface(code, fontSize, cssFontFamily, baselineHeight, marginW, marginH, needImageData, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
            var scale = fontSize < GlyphFactory._environmentMinimumFontSize ? fontSize / GlyphFactory._environmentMinimumFontSize : 1, surfaceWidth = Math.ceil((fontSize + 2 * marginW) * scale), surfaceHeight = Math.ceil((fontSize + 2 * marginH) * scale), surface = new Context2DSurface_1.Context2DSurface(surfaceWidth, surfaceHeight), canvas = surface.canvas, context = canvas.getContext("2d"), str = 4294901760 & code ? String.fromCharCode((4294901760 & code) >>> 16, 65535 & code) : String.fromCharCode(code), fontWeightValue = fontWeight === g.FontWeight.Bold ? "bold " : "";
            context.save(), context.font = fontWeightValue + fontSize + "px " + cssFontFamily, 
            context.textAlign = "left", context.textBaseline = "alphabetic", context.lineJoin = "bevel", 
            1 !== scale && context.scale(scale, scale), strokeWidth > 0 && (context.lineWidth = strokeWidth, 
            context.strokeStyle = strokeColor, context.strokeText(str, marginW, marginH + baselineHeight)), 
            strokeOnly || (context.fillStyle = fontColor, context.fillText(str, marginW, marginH + baselineHeight));
            var advanceWidth = context.measureText(str).width;
            context.restore();
            var result = {
                surface: surface,
                advanceWidth: advanceWidth,
                imageData: needImageData ? context.getImageData(0, 0, canvas.width, canvas.height) : void 0
            };
            return result;
        }
        function calcGlyphArea(imageData) {
            for (var sx = imageData.width, sy = imageData.height, ex = 0, ey = 0, currentPos = 0, y = 0, height = imageData.height; height > y; y = y + 1 | 0) for (var x = 0, width = imageData.width; width > x; x = x + 1 | 0) {
                var a = imageData.data[currentPos + 3];
                0 !== a && (sx > x && (sx = x), x > ex && (ex = x), sy > y && (sy = y), y > ey && (ey = y)), 
                currentPos += 4;
            }
            var glyphArea = void 0;
            return glyphArea = sx === imageData.width ? {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            } : {
                x: sx,
                y: sy,
                width: ex - sx + 1,
                height: ey - sy + 1
            };
        }
        function isGlyphAreaEmpty(glyphArea) {
            return 0 === glyphArea.width || 0 === glyphArea.height;
        }
        function fontFamily2FontFamilyName(fontFamily) {
            switch (fontFamily) {
              case g.FontFamily.Monospace:
                return "monospace";

              case g.FontFamily.Serif:
                return "serif";

              default:
                return "sans-serif";
            }
        }
        function quoteIfNotGeneric(name) {
            return -1 !== genericFontFamilyNames.indexOf(name) ? name : '"' + name + '"';
        }
        function fontFamily2CSSFontFamily(fontFamily) {
            return "number" == typeof fontFamily ? fontFamily2FontFamilyName(fontFamily) : "string" == typeof fontFamily ? quoteIfNotGeneric(fontFamily) : fontFamily.map(function(font) {
                return "string" == typeof font ? quoteIfNotGeneric(font) : fontFamily2FontFamilyName(font);
            }).join(",");
        }
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
        var g = require("@akashic/akashic-engine"), Context2DSurface_1 = require("./context2d/Context2DSurface"), genericFontFamilyNames = [ "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui" ], GlyphFactory = function(_super) {
            function GlyphFactory(fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
                var _this = _super.call(this, fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) || this;
                _this._glyphAreas = {}, _this._cssFontFamily = fontFamily2CSSFontFamily(fontFamily);
                var fallbackFontFamilyName = fontFamily2FontFamilyName(g.FontFamily.SansSerif);
                return -1 === _this._cssFontFamily.indexOf(fallbackFontFamilyName) && (_this._cssFontFamily += "," + fallbackFontFamilyName), 
                _this._marginW = Math.ceil(.3 * _this.fontSize + _this.strokeWidth / 2), _this._marginH = Math.ceil(.3 * _this.fontSize + _this.strokeWidth / 2), 
                void 0 === GlyphFactory._environmentMinimumFontSize && (GlyphFactory._environmentMinimumFontSize = _this.measureMinimumFontSize()), 
                _this;
            }
            return __extends(GlyphFactory, _super), GlyphFactory.prototype.create = function(code) {
                var result, glyphArea = this._glyphAreas[code];
                return glyphArea || (result = createGlyphRenderedSurface(code, this.fontSize, this._cssFontFamily, this.baselineHeight, this._marginW, this._marginH, !0, this.fontColor, this.strokeWidth, this.strokeColor, this.strokeOnly, this.fontWeight), 
                glyphArea = calcGlyphArea(result.imageData), glyphArea.advanceWidth = result.advanceWidth, 
                this._glyphAreas[code] = glyphArea), isGlyphAreaEmpty(glyphArea) ? (result && result.surface.destroy(), 
                new g.Glyph(code, 0, 0, 0, 0, 0, 0, glyphArea.advanceWidth, void 0, !0)) : (result || (result = createGlyphRenderedSurface(code, this.fontSize, this._cssFontFamily, this.baselineHeight, this._marginW, this._marginH, !1, this.fontColor, this.strokeWidth, this.strokeColor, this.strokeOnly, this.fontWeight)), 
                new g.Glyph(code, glyphArea.x, glyphArea.y, glyphArea.width, glyphArea.height, glyphArea.x - this._marginW, glyphArea.y - this._marginH, glyphArea.advanceWidth, result.surface, !0));
            }, GlyphFactory.prototype.measureMinimumFontSize = function() {
                var fontSize = 1, str = "M", canvas = document.createElement("canvas"), context = canvas.getContext("2d");
                context.textAlign = "left", context.textBaseline = "alphabetic", context.lineJoin = "bevel";
                var preWidth;
                context.font = fontSize + "px sans-serif";
                var width = context.measureText(str).width;
                do preWidth = width, fontSize += 1, context.font = fontSize + "px sans-serif", width = context.measureText(str).width; while (preWidth === width || fontSize > 50);
                return fontSize;
            }, GlyphFactory;
        }(g.GlyphFactory);
        exports.GlyphFactory = GlyphFactory;
    }, {
        "./context2d/Context2DSurface": 16,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    14: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RenderingHelper;
        !function(RenderingHelper) {
            function toPowerOfTwo(x) {
                if (0 !== (x & x - 1)) {
                    for (var y = 1; x > y; ) y *= 2;
                    return y;
                }
                return x;
            }
            function clamp(x) {
                return Math.min(Math.max(x, 0), 1);
            }
            function usedWebGL(rendererCandidates) {
                var used = !1;
                return rendererCandidates && 0 < rendererCandidates.length && (used = "webgl" === rendererCandidates[0]), 
                used;
            }
            RenderingHelper.toPowerOfTwo = toPowerOfTwo, RenderingHelper.clamp = clamp, RenderingHelper.usedWebGL = usedWebGL;
        }(RenderingHelper = exports.RenderingHelper || (exports.RenderingHelper = {}));
    }, {} ],
    15: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), Context2DRenderer = function(_super) {
            function Context2DRenderer(surface) {
                var _this = _super.call(this) || this;
                return _this.surface = surface, _this.context = surface.context(), _this;
            }
            return __extends(Context2DRenderer, _super), Context2DRenderer.prototype.clear = function() {
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            }, Context2DRenderer.prototype.drawImage = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY) {
                this.context.drawImage(surface._drawable, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, width, height);
            }, Context2DRenderer.prototype.drawSprites = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, count) {
                for (var i = 0; count > i; ++i) this.drawImage(surface, offsetX[i], offsetY[i], width[i], height[i], canvasOffsetX[i], canvasOffsetY[i]);
            }, Context2DRenderer.prototype.drawSystemText = function(text, x, y, maxWidth, fontSize, textAlign, textBaseline, textColor, fontFamily, strokeWidth, strokeColor, strokeOnly) {
                var fontFamilyValue, textAlignValue, textBaselineValue, context = this.context;
                switch (context.save(), fontFamily) {
                  case g.FontFamily.Monospace:
                    fontFamilyValue = "monospace";
                    break;

                  case g.FontFamily.Serif:
                    fontFamilyValue = "serif";
                    break;

                  default:
                    fontFamilyValue = "sans-serif";
                }
                switch (context.font = fontSize + "px " + fontFamilyValue, textAlign) {
                  case g.TextAlign.Right:
                    textAlignValue = "right";
                    break;

                  case g.TextAlign.Center:
                    textAlignValue = "center";
                    break;

                  default:
                    textAlignValue = "left";
                }
                switch (context.textAlign = textAlignValue, textBaseline) {
                  case g.TextBaseline.Top:
                    textBaselineValue = "top";
                    break;

                  case g.TextBaseline.Middle:
                    textBaselineValue = "middle";
                    break;

                  case g.TextBaseline.Bottom:
                    textBaselineValue = "bottom";
                    break;

                  default:
                    textBaselineValue = "alphabetic";
                }
                context.textBaseline = textBaselineValue, context.lineJoin = "bevel", strokeWidth > 0 && (context.lineWidth = strokeWidth, 
                context.strokeStyle = strokeColor, "undefined" == typeof maxWidth ? context.strokeText(text, x, y) : context.strokeText(text, x, y, maxWidth)), 
                strokeOnly || (context.fillStyle = textColor, "undefined" == typeof maxWidth ? context.fillText(text, x, y) : context.fillText(text, x, y, maxWidth)), 
                context.restore();
            }, Context2DRenderer.prototype.translate = function(x, y) {
                this.context.translate(x, y);
            }, Context2DRenderer.prototype.transform = function(matrix) {
                this.context.transform.apply(this.context, matrix);
            }, Context2DRenderer.prototype.opacity = function(opacity) {
                this.context.globalAlpha *= opacity;
            }, Context2DRenderer.prototype.save = function() {
                this.context.save();
            }, Context2DRenderer.prototype.restore = function() {
                this.context.restore();
            }, Context2DRenderer.prototype.fillRect = function(x, y, width, height, cssColor) {
                var _fillStyle = this.context.fillStyle;
                this.context.fillStyle = cssColor, this.context.fillRect(x, y, width, height), this.context.fillStyle = _fillStyle;
            }, Context2DRenderer.prototype.setCompositeOperation = function(operation) {
                var operationText;
                switch (operation) {
                  case g.CompositeOperation.SourceAtop:
                    operationText = "source-atop";
                    break;

                  case g.CompositeOperation.Lighter:
                    operationText = "lighter";
                    break;

                  case g.CompositeOperation.Copy:
                    operationText = "copy";
                    break;

                  case g.CompositeOperation.ExperimentalSourceIn:
                    operationText = "source-in";
                    break;

                  case g.CompositeOperation.ExperimentalSourceOut:
                    operationText = "source-out";
                    break;

                  case g.CompositeOperation.ExperimentalDestinationAtop:
                    operationText = "destination-atop";
                    break;

                  case g.CompositeOperation.ExperimentalDestinationIn:
                    operationText = "destination-in";
                    break;

                  case g.CompositeOperation.DestinationOut:
                    operationText = "destination-out";
                    break;

                  case g.CompositeOperation.DestinationOver:
                    operationText = "destination-over";
                    break;

                  case g.CompositeOperation.Xor:
                    operationText = "xor";
                    break;

                  default:
                    operationText = "source-over";
                }
                this.context.globalCompositeOperation = operationText;
            }, Context2DRenderer.prototype.setOpacity = function(opacity) {
                this.context.globalAlpha = opacity;
            }, Context2DRenderer.prototype.setTransform = function(matrix) {
                this.context.setTransform.apply(this.context, matrix);
            }, Context2DRenderer.prototype.setShaderProgram = function(shaderProgram) {
                throw g.ExceptionFactory.createAssertionError("Context2DRenderer#setShaderProgram() is not implemented");
            }, Context2DRenderer.prototype.isSupportedShaderProgram = function() {
                return !1;
            }, Context2DRenderer.prototype._getImageData = function(sx, sy, sw, sh) {
                return this.context.getImageData(sx, sy, sw, sh);
            }, Context2DRenderer.prototype._putImageData = function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
                void 0 === dirtyX && (dirtyX = 0), void 0 === dirtyY && (dirtyY = 0), void 0 === dirtyWidth && (dirtyWidth = imageData.width), 
                void 0 === dirtyHeight && (dirtyHeight = imageData.height), this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
            }, Context2DRenderer;
        }(g.Renderer);
        exports.Context2DRenderer = Context2DRenderer;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    16: [ function(require, module, exports) {
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
        var Context2DRenderer_1 = require("./Context2DRenderer"), CanvasSurface_1 = require("../CanvasSurface"), Context2DSurface = function(_super) {
            function Context2DSurface() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            return __extends(Context2DSurface, _super), Context2DSurface.prototype.context = function() {
                return this._context || (this._context = this.canvas.getContext("2d")), this._context;
            }, Context2DSurface.prototype.renderer = function() {
                return this._renderer || (this._renderer = new Context2DRenderer_1.Context2DRenderer(this)), 
                this._renderer;
            }, Context2DSurface.prototype.changePhysicalScale = function(xScale, yScale) {
                this.canvas.width = this.width * xScale, this.canvas.height = this.height * yScale, 
                this._context.scale(xScale, yScale);
            }, Context2DSurface.prototype.isPlaying = function() {
                return !1;
            }, Context2DSurface;
        }(CanvasSurface_1.CanvasSurface);
        exports.Context2DSurface = Context2DSurface;
    }, {
        "../CanvasSurface": 12,
        "./Context2DRenderer": 15
    } ],
    17: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RenderingHelper_1 = require("../RenderingHelper"), Context2DSurface_1 = require("../context2d/Context2DSurface"), WebGLSharedObject_1 = require("../webgl/WebGLSharedObject"), SurfaceFactory = function() {
            function SurfaceFactory() {}
            return SurfaceFactory.prototype.createPrimarySurface = function(width, height, rendererCandidates) {
                return RenderingHelper_1.RenderingHelper.usedWebGL(rendererCandidates) ? (this._shared || (this._shared = new WebGLSharedObject_1.WebGLSharedObject(width, height)), 
                this._shared.getPrimarySurface()) : new Context2DSurface_1.Context2DSurface(width, height);
            }, SurfaceFactory.prototype.createBackSurface = function(width, height, rendererCandidates) {
                return RenderingHelper_1.RenderingHelper.usedWebGL(rendererCandidates) ? this._shared.createBackSurface(width, height) : new Context2DSurface_1.Context2DSurface(width, height);
            }, SurfaceFactory;
        }();
        exports.SurfaceFactory = SurfaceFactory;
    }, {
        "../RenderingHelper": 14,
        "../context2d/Context2DSurface": 16,
        "../webgl/WebGLSharedObject": 27
    } ],
    18: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var AffineTransformer = function() {
            function AffineTransformer(rhs) {
                rhs ? this.matrix = new Float32Array(rhs.matrix) : this.matrix = new Float32Array([ 1, 0, 0, 1, 0, 0 ]);
            }
            return AffineTransformer.prototype.scale = function(x, y) {
                var m = this.matrix;
                return m[0] *= x, m[1] *= x, m[2] *= y, m[3] *= y, this;
            }, AffineTransformer.prototype.translate = function(x, y) {
                var m = this.matrix;
                return m[4] += m[0] * x + m[2] * y, m[5] += m[1] * x + m[3] * y, this;
            }, AffineTransformer.prototype.transform = function(matrix) {
                var m = this.matrix, a = matrix[0] * m[0] + matrix[1] * m[2], b = matrix[0] * m[1] + matrix[1] * m[3], c = matrix[2] * m[0] + matrix[3] * m[2], d = matrix[2] * m[1] + matrix[3] * m[3], e = matrix[4] * m[0] + matrix[5] * m[2] + m[4], f = matrix[4] * m[1] + matrix[5] * m[3] + m[5];
                return m[0] = a, m[1] = b, m[2] = c, m[3] = d, m[4] = e, m[5] = f, this;
            }, AffineTransformer.prototype.setTransform = function(matrix) {
                var m = this.matrix;
                m[0] = matrix[0], m[1] = matrix[1], m[2] = matrix[2], m[3] = matrix[3], m[4] = matrix[4], 
                m[5] = matrix[5];
            }, AffineTransformer.prototype.copyFrom = function(rhs) {
                return this.matrix.set(rhs.matrix), this;
            }, AffineTransformer;
        }();
        exports.AffineTransformer = AffineTransformer;
    }, {} ],
    19: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), AffineTransformer_1 = require("./AffineTransformer"), RenderingState = function() {
            function RenderingState(rhs) {
                rhs ? (this.globalAlpha = rhs.globalAlpha, this.globalCompositeOperation = rhs.globalCompositeOperation, 
                this.transformer = new AffineTransformer_1.AffineTransformer(rhs.transformer), this.shaderProgram = rhs.shaderProgram) : (this.globalAlpha = 1, 
                this.globalCompositeOperation = g.CompositeOperation.SourceOver, this.transformer = new AffineTransformer_1.AffineTransformer(), 
                this.shaderProgram = null);
            }
            return RenderingState.prototype.copyFrom = function(rhs) {
                return this.globalAlpha = rhs.globalAlpha, this.globalCompositeOperation = rhs.globalCompositeOperation, 
                this.transformer.copyFrom(rhs.transformer), this.shaderProgram = rhs.shaderProgram, 
                this;
            }, RenderingState;
        }();
        exports.RenderingState = RenderingState;
    }, {
        "./AffineTransformer": 18,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    20: [ function(require, module, exports) {
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
        var WebGLBackSurfaceRenderer_1 = require("./WebGLBackSurfaceRenderer"), WebGLPrimarySurface_1 = require("./WebGLPrimarySurface"), WebGLBackSurface = function(_super) {
            function WebGLBackSurface() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            return __extends(WebGLBackSurface, _super), WebGLBackSurface.prototype.renderer = function() {
                return this._renderer || (this._renderer = new WebGLBackSurfaceRenderer_1.WebGLBackSurfaceRenderer(this, this._shared)), 
                this._renderer;
            }, WebGLBackSurface.prototype.destroy = function() {
                this._renderer && this._renderer.destroy(), this._renderer = void 0, this._drawable = void 0, 
                _super.prototype.destroy.call(this);
            }, WebGLBackSurface;
        }(WebGLPrimarySurface_1.WebGLPrimarySurface);
        exports.WebGLBackSurface = WebGLBackSurface;
    }, {
        "./WebGLBackSurfaceRenderer": 21,
        "./WebGLPrimarySurface": 23
    } ],
    21: [ function(require, module, exports) {
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
        var WebGLRenderer_1 = require("./WebGLRenderer"), RenderingState_1 = require("./RenderingState"), WebGLBackSurfaceRenderer = function(_super) {
            function WebGLBackSurfaceRenderer(surface, shared) {
                var _this = _super.call(this, shared, shared.createRenderTarget(surface.width, surface.height)) || this;
                return surface._drawable = {
                    texture: _this._renderTarget.texture,
                    textureOffsetX: 0,
                    textureOffsetY: 0,
                    textureWidth: surface.width,
                    textureHeight: surface.height
                }, _this;
            }
            return __extends(WebGLBackSurfaceRenderer, _super), WebGLBackSurfaceRenderer.prototype.begin = function() {
                _super.prototype.begin.call(this), this.save();
                var rs = new RenderingState_1.RenderingState(this.currentState()), matrix = rs.transformer.matrix;
                matrix[1] *= -1, matrix[3] *= -1, matrix[5] = -matrix[5] + this._renderTarget.height, 
                this.currentState().copyFrom(rs), this._shared.pushRenderTarget(this._renderTarget);
            }, WebGLBackSurfaceRenderer.prototype.end = function() {
                this.restore(), this._shared.popRenderTarget(), _super.prototype.end.call(this);
            }, WebGLBackSurfaceRenderer;
        }(WebGLRenderer_1.WebGLRenderer);
        exports.WebGLBackSurfaceRenderer = WebGLBackSurfaceRenderer;
    }, {
        "./RenderingState": 19,
        "./WebGLRenderer": 25
    } ],
    22: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var WebGLColor, RenderingHelper_1 = require("../RenderingHelper");
        !function(WebGLColor) {
            function get(color) {
                var rgba = "string" == typeof color ? WebGLColor._toColor(color) : [ color[0], color[1], color[2], color[3] ];
                return rgba[3] = RenderingHelper_1.RenderingHelper.clamp(rgba[3]), rgba[0] = RenderingHelper_1.RenderingHelper.clamp(rgba[0]) * rgba[3], 
                rgba[1] = RenderingHelper_1.RenderingHelper.clamp(rgba[1]) * rgba[3], rgba[2] = RenderingHelper_1.RenderingHelper.clamp(rgba[2]) * rgba[3], 
                rgba;
            }
            function _hsl2rgb(hsl) {
                var h = hsl[0] % 360, s = hsl[1], l = hsl[2] > 50 ? 100 - hsl[2] : hsl[2], a = hsl[3], max = l + l * s, min = l - l * s;
                return 60 > h ? [ max, h / 60 * (max - min) + min, min, a ] : 120 > h ? [ (120 - h) / 60 * (max - min) + min, max, min, a ] : 180 > h ? [ min, max, (h - 120) / 60 * (max - min) + min, a ] : 240 > h ? [ min, (240 - h) / 60 * (max - min) + min, max, a ] : 300 > h ? [ (h - 240) / 60 * (max - min) + min, min, max, a ] : [ max, min, (360 - h) / 60 * (max - min) + min, a ];
            }
            function _toColor(cssColor) {
                var ncc = cssColor.toUpperCase().replace(/\s+/g, ""), rgba = WebGLColor.colorMap[ncc];
                if (rgba) return rgba;
                if (ncc.match(/^#([\dA-F])([\dA-F])([\dA-F])$/)) return [ parseInt(RegExp.$1, 16) / 15, parseInt(RegExp.$2, 16) / 15, parseInt(RegExp.$3, 16) / 15, 1 ];
                if (ncc.match(/^#([\dA-F]{2})([\dA-F]{2})([\dA-F]{2})$/)) return [ parseInt(RegExp.$1, 16) / 255, parseInt(RegExp.$2, 16) / 255, parseInt(RegExp.$3, 16) / 255, 1 ];
                if (ncc.match(/^RGB\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/)) return [ parseInt(RegExp.$1, 10) / 255, parseInt(RegExp.$2, 10) / 255, parseInt(RegExp.$3, 10) / 255, 1 ];
                if (ncc.match(/^RGBA\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d(\.\d*)?)\)$/)) return [ parseInt(RegExp.$1, 10) / 255, parseInt(RegExp.$2, 10) / 255, parseInt(RegExp.$3, 10) / 255, parseFloat(RegExp.$4) ];
                if (ncc.match(/^HSL\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/)) return WebGLColor._hsl2rgb([ parseInt(RegExp.$1, 10), RenderingHelper_1.RenderingHelper.clamp(parseInt(RegExp.$2, 10) / 100), RenderingHelper_1.RenderingHelper.clamp(parseInt(RegExp.$3, 10) / 100), 1 ]);
                if (ncc.match(/^HSLA\((\d{1,3}),(\d{1,3})%,(\d{1,3})%,(\d(\.\d*)?)\)$/)) return WebGLColor._hsl2rgb([ parseInt(RegExp.$1, 10), RenderingHelper_1.RenderingHelper.clamp(parseInt(RegExp.$2, 10) / 100), RenderingHelper_1.RenderingHelper.clamp(parseInt(RegExp.$3, 10) / 100), parseFloat(RegExp.$4) ]);
                throw Error("illigal cssColor format: " + ncc);
            }
            WebGLColor.colorMap = {
                ALICEBLUE: [ 240 / 255, 248 / 255, 1, 1 ],
                ANTIQUEWHITE: [ 250 / 255, 235 / 255, 215 / 255, 1 ],
                AQUA: [ 0, 1, 1, 1 ],
                AQUAMARINE: [ 127 / 255, 1, 212 / 255, 1 ],
                AZURE: [ 240 / 255, 1, 1, 1 ],
                BEIGE: [ 245 / 255, 245 / 255, 220 / 255, 1 ],
                BISQUE: [ 1, 228 / 255, 196 / 255, 1 ],
                BLACK: [ 0, 0, 0, 1 ],
                BLANCHEDALMOND: [ 1, 235 / 255, 205 / 255, 1 ],
                BLUE: [ 0, 0, 1, 1 ],
                BLUEVIOLET: [ 138 / 255, 43 / 255, 226 / 255, 1 ],
                BROWN: [ 165 / 255, 42 / 255, 42 / 255, 1 ],
                BURLYWOOD: [ 222 / 255, 184 / 255, 135 / 255, 1 ],
                CADETBLUE: [ 95 / 255, 158 / 255, 160 / 255, 1 ],
                CHARTREUSE: [ 127 / 255, 1, 0, 1 ],
                CHOCOLATE: [ 210 / 255, 105 / 255, 30 / 255, 1 ],
                CORAL: [ 1, 127 / 255, 80 / 255, 1 ],
                CORNFLOWERBLUE: [ 100 / 255, 149 / 255, 237 / 255, 1 ],
                CORNSILK: [ 1, 248 / 255, 220 / 255, 1 ],
                CRIMSON: [ 220 / 255, 20 / 255, 60 / 255, 1 ],
                CYAN: [ 0, 1, 1, 1 ],
                DARKBLUE: [ 0, 0, 139 / 255, 1 ],
                DARKCYAN: [ 0, 139 / 255, 139 / 255, 1 ],
                DARKGOLDENROD: [ 184 / 255, 134 / 255, 11 / 255, 1 ],
                DARKGRAY: [ 169 / 255, 169 / 255, 169 / 255, 1 ],
                DARKGREEN: [ 0, 100 / 255, 0, 1 ],
                DARKGREY: [ 169 / 255, 169 / 255, 169 / 255, 1 ],
                DARKKHAKI: [ 189 / 255, 183 / 255, 107 / 255, 1 ],
                DARKMAGENTA: [ 139 / 255, 0, 139 / 255, 1 ],
                DARKOLIVEGREEN: [ 85 / 255, 107 / 255, 47 / 255, 1 ],
                DARKORANGE: [ 1, 140 / 255, 0, 1 ],
                DARKORCHID: [ .6, 50 / 255, .8, 1 ],
                DARKRED: [ 139 / 255, 0, 0, 1 ],
                DARKSALMON: [ 233 / 255, 150 / 255, 122 / 255, 1 ],
                DARKSEAGREEN: [ 143 / 255, 188 / 255, 143 / 255, 1 ],
                DARKSLATEBLUE: [ 72 / 255, 61 / 255, 139 / 255, 1 ],
                DARKSLATEGRAY: [ 47 / 255, 79 / 255, 79 / 255, 1 ],
                DARKSLATEGREY: [ 47 / 255, 79 / 255, 79 / 255, 1 ],
                DARKTURQUOISE: [ 0, 206 / 255, 209 / 255, 1 ],
                DARKVIOLET: [ 148 / 255, 0, 211 / 255, 1 ],
                DEEPPINK: [ 1, 20 / 255, 147 / 255, 1 ],
                DEEPSKYBLUE: [ 0, 191 / 255, 1, 1 ],
                DIMGRAY: [ 105 / 255, 105 / 255, 105 / 255, 1 ],
                DIMGREY: [ 105 / 255, 105 / 255, 105 / 255, 1 ],
                DODGERBLUE: [ 30 / 255, 144 / 255, 1, 1 ],
                FIREBRICK: [ 178 / 255, 34 / 255, 34 / 255, 1 ],
                FLORALWHITE: [ 1, 250 / 255, 240 / 255, 1 ],
                FORESTGREEN: [ 34 / 255, 139 / 255, 34 / 255, 1 ],
                FUCHSIA: [ 1, 0, 1, 1 ],
                GAINSBORO: [ 220 / 255, 220 / 255, 220 / 255, 1 ],
                GHOSTWHITE: [ 248 / 255, 248 / 255, 1, 1 ],
                GOLD: [ 1, 215 / 255, 0, 1 ],
                GOLDENROD: [ 218 / 255, 165 / 255, 32 / 255, 1 ],
                GRAY: [ 128 / 255, 128 / 255, 128 / 255, 1 ],
                GREEN: [ 0, 128 / 255, 0, 1 ],
                GREENYELLOW: [ 173 / 255, 1, 47 / 255, 1 ],
                GREY: [ 128 / 255, 128 / 255, 128 / 255, 1 ],
                HONEYDEW: [ 240 / 255, 1, 240 / 255, 1 ],
                HOTPINK: [ 1, 105 / 255, 180 / 255, 1 ],
                INDIANRED: [ 205 / 255, 92 / 255, 92 / 255, 1 ],
                INDIGO: [ 75 / 255, 0, 130 / 255, 1 ],
                IVORY: [ 1, 1, 240 / 255, 1 ],
                KHAKI: [ 240 / 255, 230 / 255, 140 / 255, 1 ],
                LAVENDER: [ 230 / 255, 230 / 255, 250 / 255, 1 ],
                LAVENDERBLUSH: [ 1, 240 / 255, 245 / 255, 1 ],
                LAWNGREEN: [ 124 / 255, 252 / 255, 0, 1 ],
                LEMONCHIFFON: [ 1, 250 / 255, 205 / 255, 1 ],
                LIGHTBLUE: [ 173 / 255, 216 / 255, 230 / 255, 1 ],
                LIGHTCORAL: [ 240 / 255, 128 / 255, 128 / 255, 1 ],
                LIGHTCYAN: [ 224 / 255, 1, 1, 1 ],
                LIGHTGOLDENRODYELLOW: [ 250 / 255, 250 / 255, 210 / 255, 1 ],
                LIGHTGRAY: [ 211 / 255, 211 / 255, 211 / 255, 1 ],
                LIGHTGREEN: [ 144 / 255, 238 / 255, 144 / 255, 1 ],
                LIGHTGREY: [ 211 / 255, 211 / 255, 211 / 255, 1 ],
                LIGHTPINK: [ 1, 182 / 255, 193 / 255, 1 ],
                LIGHTSALMON: [ 1, 160 / 255, 122 / 255, 1 ],
                LIGHTSEAGREEN: [ 32 / 255, 178 / 255, 170 / 255, 1 ],
                LIGHTSKYBLUE: [ 135 / 255, 206 / 255, 250 / 255, 1 ],
                LIGHTSLATEGRAY: [ 119 / 255, 136 / 255, .6, 1 ],
                LIGHTSLATEGREY: [ 119 / 255, 136 / 255, .6, 1 ],
                LIGHTSTEELBLUE: [ 176 / 255, 196 / 255, 222 / 255, 1 ],
                LIGHTYELLOW: [ 1, 1, 224 / 255, 1 ],
                LIME: [ 0, 1, 0, 1 ],
                LIMEGREEN: [ 50 / 255, 205 / 255, 50 / 255, 1 ],
                LINEN: [ 250 / 255, 240 / 255, 230 / 255, 1 ],
                MAGENTA: [ 1, 0, 1, 1 ],
                MAROON: [ 128 / 255, 0, 0, 1 ],
                MEDIUMAQUAMARINE: [ .4, 205 / 255, 170 / 255, 1 ],
                MEDIUMBLUE: [ 0, 0, 205 / 255, 1 ],
                MEDIUMORCHID: [ 186 / 255, 85 / 255, 211 / 255, 1 ],
                MEDIUMPURPLE: [ 147 / 255, 112 / 255, 219 / 255, 1 ],
                MEDIUMSEAGREEN: [ 60 / 255, 179 / 255, 113 / 255, 1 ],
                MEDIUMSLATEBLUE: [ 123 / 255, 104 / 255, 238 / 255, 1 ],
                MEDIUMSPRINGGREEN: [ 0, 250 / 255, 154 / 255, 1 ],
                MEDIUMTURQUOISE: [ 72 / 255, 209 / 255, .8, 1 ],
                MEDIUMVIOLETRED: [ 199 / 255, 21 / 255, 133 / 255, 1 ],
                MIDNIGHTBLUE: [ 25 / 255, 25 / 255, 112 / 255, 1 ],
                MINTCREAM: [ 245 / 255, 1, 250 / 255, 1 ],
                MISTYROSE: [ 1, 228 / 255, 225 / 255, 1 ],
                MOCCASIN: [ 1, 228 / 255, 181 / 255, 1 ],
                NAVAJOWHITE: [ 1, 222 / 255, 173 / 255, 1 ],
                NAVY: [ 0, 0, 128 / 255, 1 ],
                OLDLACE: [ 253 / 255, 245 / 255, 230 / 255, 1 ],
                OLIVE: [ 128 / 255, 128 / 255, 0, 1 ],
                OLIVEDRAB: [ 107 / 255, 142 / 255, 35 / 255, 1 ],
                ORANGE: [ 1, 165 / 255, 0, 1 ],
                ORANGERED: [ 1, 69 / 255, 0, 1 ],
                ORCHID: [ 218 / 255, 112 / 255, 214 / 255, 1 ],
                PALEGOLDENROD: [ 238 / 255, 232 / 255, 170 / 255, 1 ],
                PALEGREEN: [ 152 / 255, 251 / 255, 152 / 255, 1 ],
                PALETURQUOISE: [ 175 / 255, 238 / 255, 238 / 255, 1 ],
                PALEVIOLETRED: [ 219 / 255, 112 / 255, 147 / 255, 1 ],
                PAPAYAWHIP: [ 1, 239 / 255, 213 / 255, 1 ],
                PEACHPUFF: [ 1, 218 / 255, 185 / 255, 1 ],
                PERU: [ 205 / 255, 133 / 255, 63 / 255, 1 ],
                PINK: [ 1, 192 / 255, 203 / 255, 1 ],
                PLUM: [ 221 / 255, 160 / 255, 221 / 255, 1 ],
                POWDERBLUE: [ 176 / 255, 224 / 255, 230 / 255, 1 ],
                PURPLE: [ 128 / 255, 0, 128 / 255, 1 ],
                RED: [ 1, 0, 0, 1 ],
                ROSYBROWN: [ 188 / 255, 143 / 255, 143 / 255, 1 ],
                ROYALBLUE: [ 65 / 255, 105 / 255, 225 / 255, 1 ],
                SADDLEBROWN: [ 139 / 255, 69 / 255, 19 / 255, 1 ],
                SALMON: [ 250 / 255, 128 / 255, 114 / 255, 1 ],
                SANDYBROWN: [ 244 / 255, 164 / 255, 96 / 255, 1 ],
                SEAGREEN: [ 46 / 255, 139 / 255, 87 / 255, 1 ],
                SEASHELL: [ 1, 245 / 255, 238 / 255, 1 ],
                SIENNA: [ 160 / 255, 82 / 255, 45 / 255, 1 ],
                SILVER: [ 192 / 255, 192 / 255, 192 / 255, 1 ],
                SKYBLUE: [ 135 / 255, 206 / 255, 235 / 255, 1 ],
                SLATEBLUE: [ 106 / 255, 90 / 255, 205 / 255, 1 ],
                SLATEGRAY: [ 112 / 255, 128 / 255, 144 / 255, 1 ],
                SLATEGREY: [ 112 / 255, 128 / 255, 144 / 255, 1 ],
                SNOW: [ 1, 250 / 255, 250 / 255, 1 ],
                SPRINGGREEN: [ 0, 1, 127 / 255, 1 ],
                STEELBLUE: [ 70 / 255, 130 / 255, 180 / 255, 1 ],
                TAN: [ 210 / 255, 180 / 255, 140 / 255, 1 ],
                TEAL: [ 0, 128 / 255, 128 / 255, 1 ],
                THISTLE: [ 216 / 255, 191 / 255, 216 / 255, 1 ],
                TOMATO: [ 1, 99 / 255, 71 / 255, 1 ],
                TURQUOISE: [ 64 / 255, 224 / 255, 208 / 255, 1 ],
                VIOLET: [ 238 / 255, 130 / 255, 238 / 255, 1 ],
                WHEAT: [ 245 / 255, 222 / 255, 179 / 255, 1 ],
                WHITE: [ 1, 1, 1, 1 ],
                WHITESMOKE: [ 245 / 255, 245 / 255, 245 / 255, 1 ],
                YELLOW: [ 1, 1, 0, 1 ],
                YELLOWGREEN: [ 154 / 255, 205 / 255, 50 / 255, 1 ]
            }, WebGLColor.get = get, WebGLColor._hsl2rgb = _hsl2rgb, WebGLColor._toColor = _toColor;
        }(WebGLColor = exports.WebGLColor || (exports.WebGLColor = {}));
    }, {
        "../RenderingHelper": 14
    } ],
    23: [ function(require, module, exports) {
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
        var CanvasSurface_1 = require("../CanvasSurface"), WebGLPrimarySurfaceRenderer_1 = require("./WebGLPrimarySurfaceRenderer"), WebGLPrimarySurface = function(_super) {
            function WebGLPrimarySurface(shared, width, height) {
                var _this = _super.call(this, width, height) || this;
                return _this.canvas.style.position = "absolute", _this._shared = shared, _this;
            }
            return __extends(WebGLPrimarySurface, _super), WebGLPrimarySurface.prototype.renderer = function() {
                return this._renderer || (this._renderer = new WebGLPrimarySurfaceRenderer_1.WebGLPrimarySurfaceRenderer(this._shared, this._shared.getPrimaryRenderTarget(this.width, this.height))), 
                this._renderer;
            }, WebGLPrimarySurface.prototype.changePhysicalScale = function(xScale, yScale) {
                var width = Math.ceil(this.width * xScale), height = Math.ceil(this.height * yScale);
                this.canvas.width = width, this.canvas.height = height, this.renderer().changeViewportSize(width, height);
            }, WebGLPrimarySurface.prototype.isPlaying = function() {
                return !1;
            }, WebGLPrimarySurface;
        }(CanvasSurface_1.CanvasSurface);
        exports.WebGLPrimarySurface = WebGLPrimarySurface;
    }, {
        "../CanvasSurface": 12,
        "./WebGLPrimarySurfaceRenderer": 24
    } ],
    24: [ function(require, module, exports) {
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
        var WebGLRenderer_1 = require("./WebGLRenderer"), WebGLPrimarySurfaceRenderer = function(_super) {
            function WebGLPrimarySurfaceRenderer(shared, renderTarget) {
                var _this = _super.call(this, shared, renderTarget) || this;
                return _this._shared.pushRenderTarget(_this._renderTarget), _this;
            }
            return __extends(WebGLPrimarySurfaceRenderer, _super), WebGLPrimarySurfaceRenderer.prototype.begin = function() {
                _super.prototype.begin.call(this), this._shared.begin();
            }, WebGLPrimarySurfaceRenderer;
        }(WebGLRenderer_1.WebGLRenderer);
        exports.WebGLPrimarySurfaceRenderer = WebGLPrimarySurfaceRenderer;
    }, {
        "./WebGLRenderer": 25
    } ],
    25: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), WebGLColor_1 = require("./WebGLColor"), RenderingState_1 = require("./RenderingState"), WebGLRenderer = function(_super) {
            function WebGLRenderer(shared, renderTarget) {
                var _this = _super.call(this) || this;
                return _this._stateStack = [], _this._stateStackPointer = 0, _this._capacity = 0, 
                _this._reallocation(WebGLRenderer.DEFAULT_CAPACITY), _this._whiteColor = [ 1, 1, 1, 1 ], 
                _this._shared = shared, _this._renderTarget = renderTarget, _this;
            }
            return __extends(WebGLRenderer, _super), WebGLRenderer.prototype.clear = function() {
                this._shared.clear();
            }, WebGLRenderer.prototype.end = function() {
                this._shared.end();
            }, WebGLRenderer.prototype.save = function() {
                this._pushState();
            }, WebGLRenderer.prototype.restore = function() {
                this._popState();
            }, WebGLRenderer.prototype.translate = function(x, y) {
                this.currentState().transformer.translate(x, y);
            }, WebGLRenderer.prototype.transform = function(matrix) {
                this.currentState().transformer.transform(matrix);
            }, WebGLRenderer.prototype.opacity = function(opacity) {
                this.currentState().globalAlpha *= opacity;
            }, WebGLRenderer.prototype.setCompositeOperation = function(operation) {
                this.currentState().globalCompositeOperation = operation;
            }, WebGLRenderer.prototype.currentState = function() {
                return this._stateStack[this._stateStackPointer];
            }, WebGLRenderer.prototype.fillRect = function(x, y, width, height, cssColor) {
                this._shared.draw(this.currentState(), this._shared.getFillRectSurfaceTexture(), 0, 0, width, height, x, y, WebGLColor_1.WebGLColor.get(cssColor));
            }, WebGLRenderer.prototype.drawSprites = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, count) {
                for (var i = 0; count > i; ++i) this.drawImage(surface, offsetX[i], offsetY[i], width[i], height[i], canvasOffsetX[i], canvasOffsetY[i]);
            }, WebGLRenderer.prototype.drawImage = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY) {
                if (!surface._drawable) throw g.ExceptionFactory.createAssertionError("WebGLRenderer#drawImage: no drawable surface.");
                if (surface._drawable.texture instanceof WebGLTexture || this._shared.makeTextureForSurface(surface), 
                !surface._drawable.texture) throw g.ExceptionFactory.createAssertionError("WebGLRenderer#drawImage: could not create a texture.");
                this._shared.draw(this.currentState(), surface._drawable, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, this._whiteColor);
            }, WebGLRenderer.prototype.drawSystemText = function(text, x, y, maxWidth, fontSize, textAlign, textBaseline, textColor, fontFamily, strokeWidth, strokeColor, strokeOnly) {}, 
            WebGLRenderer.prototype.setTransform = function(matrix) {
                this.currentState().transformer.setTransform(matrix);
            }, WebGLRenderer.prototype.setOpacity = function(opacity) {
                this.currentState().globalAlpha = opacity;
            }, WebGLRenderer.prototype.setShaderProgram = function(shaderProgram) {
                this.currentState().shaderProgram = this._shared.initializeShaderProgram(shaderProgram);
            }, WebGLRenderer.prototype.isSupportedShaderProgram = function() {
                return !0;
            }, WebGLRenderer.prototype.changeViewportSize = function(width, height) {
                var old = this._renderTarget;
                this._renderTarget = {
                    width: old.width,
                    height: old.height,
                    viewportWidth: width,
                    viewportHeight: height,
                    texture: old.texture,
                    framebuffer: old.framebuffer
                };
            }, WebGLRenderer.prototype.destroy = function() {
                this._shared.requestDeleteRenderTarget(this._renderTarget), this._shared = void 0, 
                this._renderTarget = void 0, this._whiteColor = void 0;
            }, WebGLRenderer.prototype._getImageData = function() {
                throw g.ExceptionFactory.createAssertionError("WebGLRenderer#_getImageData() is not implemented");
            }, WebGLRenderer.prototype._putImageData = function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
                throw g.ExceptionFactory.createAssertionError("WebGLRenderer#_putImageData() is not implemented");
            }, WebGLRenderer.prototype._pushState = function() {
                var old = this.currentState();
                ++this._stateStackPointer, this._isOverCapacity() && this._reallocation(this._stateStackPointer + 1), 
                this.currentState().copyFrom(old);
            }, WebGLRenderer.prototype._popState = function() {
                if (!(this._stateStackPointer > 0)) throw g.ExceptionFactory.createAssertionError("WebGLRenderer#restore: state stack under-flow.");
                this.currentState().shaderProgram = null, --this._stateStackPointer;
            }, WebGLRenderer.prototype._isOverCapacity = function() {
                return this._capacity <= this._stateStackPointer;
            }, WebGLRenderer.prototype._reallocation = function(newCapacity) {
                var oldCapacity = this._capacity;
                if (newCapacity > oldCapacity) {
                    2 * oldCapacity > newCapacity ? this._capacity *= 2 : this._capacity = newCapacity;
                    for (var i = oldCapacity; i < this._capacity; ++i) this._stateStack.push(new RenderingState_1.RenderingState());
                }
            }, WebGLRenderer.DEFAULT_CAPACITY = 16, WebGLRenderer;
        }(g.Renderer);
        exports.WebGLRenderer = WebGLRenderer;
    }, {
        "./RenderingState": 19,
        "./WebGLColor": 22,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    26: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), WebGLShaderProgram = function() {
            function WebGLShaderProgram(context, fSrc, uniforms) {
                var vSrc = WebGLShaderProgram._DEFAULT_VERTEX_SHADER, fSrc = fSrc || WebGLShaderProgram._DEFAULT_FRAGMENT_SHADER, program = WebGLShaderProgram._makeShaderProgram(context, vSrc, fSrc);
                this.program = program, this._context = context, this._aVertex = context.getAttribLocation(this.program, "aVertex"), 
                this._uColor = context.getUniformLocation(this.program, "uColor"), this._uAlpha = context.getUniformLocation(this.program, "uAlpha"), 
                this._uSampler = context.getUniformLocation(this.program, "uSampler"), this._uniforms = uniforms, 
                this._uniformCaches = [], this._uniformSetterTable = {
                    "float": this._uniform1f.bind(this),
                    "int": this._uniform1i.bind(this),
                    float_v: this._uniform1fv.bind(this),
                    int_v: this._uniform1iv.bind(this),
                    vec2: this._uniform2fv.bind(this),
                    vec3: this._uniform3fv.bind(this),
                    vec4: this._uniform4fv.bind(this),
                    ivec2: this._uniform2iv.bind(this),
                    ivec3: this._uniform3iv.bind(this),
                    ivec4: this._uniform4iv.bind(this),
                    mat2: this._uniformMatrix2fv.bind(this),
                    mat3: this._uniformMatrix3fv.bind(this),
                    mat4: this._uniformMatrix4fv.bind(this)
                };
            }
            return WebGLShaderProgram._makeShader = function(gl, typ, src) {
                var shader = gl.createShader(typ);
                if (gl.shaderSource(shader, src), gl.compileShader(shader), !gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    var msg = gl.getShaderInfoLog(shader);
                    throw gl.deleteShader(shader), new Error(msg);
                }
                return shader;
            }, WebGLShaderProgram._makeShaderProgram = function(gl, vSrc, fSrc) {
                var program = gl.createProgram(), vShader = WebGLShaderProgram._makeShader(gl, gl.VERTEX_SHADER, vSrc);
                gl.attachShader(program, vShader), gl.deleteShader(vShader);
                var fShader = WebGLShaderProgram._makeShader(gl, gl.FRAGMENT_SHADER, fSrc);
                if (gl.attachShader(program, fShader), gl.deleteShader(fShader), gl.linkProgram(program), 
                !gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    var msg = gl.getProgramInfoLog(program);
                    throw gl.deleteProgram(program), new Error(msg);
                }
                return program;
            }, WebGLShaderProgram.prototype.set_aVertex = function(buffer) {
                this._context.bindBuffer(this._context.ARRAY_BUFFER, buffer), this._context.enableVertexAttribArray(this._aVertex), 
                this._context.vertexAttribPointer(this._aVertex, 4, this._context.FLOAT, !1, 0, 0);
            }, WebGLShaderProgram.prototype.set_uColor = function(rgba) {
                this._context.uniform4f(this._uColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            }, WebGLShaderProgram.prototype.set_uAlpha = function(alpha) {
                this._context.uniform1f(this._uAlpha, alpha);
            }, WebGLShaderProgram.prototype.set_uSampler = function(value) {
                this._context.uniform1i(this._uSampler, value);
            }, WebGLShaderProgram.prototype.updateUniforms = function() {
                for (var i = 0; i < this._uniformCaches.length; ++i) {
                    var cache = this._uniformCaches[i], value = this._uniforms[cache.name].value;
                    (cache.isArray || value !== cache.beforeValue) && (cache.update(cache.loc, value), 
                    cache.beforeValue = value);
                }
            }, WebGLShaderProgram.prototype.initializeUniforms = function() {
                var _this = this, uniformCaches = [], uniforms = this._uniforms;
                null != uniforms && Object.keys(uniforms).forEach(function(k) {
                    var type = uniforms[k].type, isArray = Array.isArray(uniforms[k].value);
                    !isArray || "int" !== type && "float" !== type || (type += "_v");
                    var update = _this._uniformSetterTable[type];
                    if (!update) throw g.ExceptionFactory.createAssertionError("WebGLShaderProgram#initializeUniforms: Uniform type '" + type + "' is not supported.");
                    uniformCaches.push({
                        name: k,
                        update: update,
                        beforeValue: null,
                        isArray: isArray,
                        loc: _this._context.getUniformLocation(_this.program, k)
                    });
                }), this._uniformCaches = uniformCaches;
            }, WebGLShaderProgram.prototype.use = function() {
                this._context.useProgram(this.program);
            }, WebGLShaderProgram.prototype.unuse = function() {
                this._context.useProgram(null);
            }, WebGLShaderProgram.prototype.destroy = function() {
                this._context.deleteProgram(this.program);
            }, WebGLShaderProgram.prototype._uniform1f = function(loc, v) {
                this._context.uniform1f(loc, v);
            }, WebGLShaderProgram.prototype._uniform1i = function(loc, v) {
                this._context.uniform1i(loc, v);
            }, WebGLShaderProgram.prototype._uniform1fv = function(loc, v) {
                this._context.uniform1fv(loc, v);
            }, WebGLShaderProgram.prototype._uniform1iv = function(loc, v) {
                this._context.uniform1iv(loc, v);
            }, WebGLShaderProgram.prototype._uniform2fv = function(loc, v) {
                this._context.uniform2fv(loc, v);
            }, WebGLShaderProgram.prototype._uniform3fv = function(loc, v) {
                this._context.uniform3fv(loc, v);
            }, WebGLShaderProgram.prototype._uniform4fv = function(loc, v) {
                this._context.uniform4fv(loc, v);
            }, WebGLShaderProgram.prototype._uniform2iv = function(loc, v) {
                this._context.uniform2iv(loc, v);
            }, WebGLShaderProgram.prototype._uniform3iv = function(loc, v) {
                this._context.uniform3iv(loc, v);
            }, WebGLShaderProgram.prototype._uniform4iv = function(loc, v) {
                this._context.uniform4iv(loc, v);
            }, WebGLShaderProgram.prototype._uniformMatrix2fv = function(loc, v) {
                this._context.uniformMatrix2fv(loc, !1, v);
            }, WebGLShaderProgram.prototype._uniformMatrix3fv = function(loc, v) {
                this._context.uniformMatrix3fv(loc, !1, v);
            }, WebGLShaderProgram.prototype._uniformMatrix4fv = function(loc, v) {
                this._context.uniformMatrix4fv(loc, !1, v);
            }, WebGLShaderProgram._DEFAULT_VERTEX_SHADER = "#version 100\nprecision mediump float;\nattribute vec4 aVertex;\nvarying vec2 vTexCoord;\nvarying vec4 vColor;\nuniform vec4 uColor;\nuniform float uAlpha;\nvoid main() {    gl_Position = vec4(aVertex.xy, 0.0, 1.0);    vTexCoord = aVertex.zw;    vColor = uColor * uAlpha;}", 
            WebGLShaderProgram._DEFAULT_FRAGMENT_SHADER = "#version 100\nprecision mediump float;\nvarying vec2 vTexCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nvoid main() {    gl_FragColor = texture2D(uSampler, vTexCoord) * vColor;}", 
            WebGLShaderProgram;
        }();
        exports.WebGLShaderProgram = WebGLShaderProgram;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    27: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), WebGLShaderProgram_1 = require("./WebGLShaderProgram"), WebGLTextureAtlas_1 = require("./WebGLTextureAtlas"), WebGLPrimarySurface_1 = require("./WebGLPrimarySurface"), WebGLBackSurface_1 = require("./WebGLBackSurface"), WebGLSharedObject = function() {
            function WebGLSharedObject(width, height) {
                var surface = new WebGLPrimarySurface_1.WebGLPrimarySurface(this, width, height), context = surface.canvas.getContext("webgl", {
                    depth: !1,
                    preserveDrawingBuffer: !0
                });
                if (!context) throw g.ExceptionFactory.createAssertionError("WebGLSharedObject#constructor: could not initialize WebGLRenderingContext");
                this._surface = surface, this._context = context, this._init();
            }
            return WebGLSharedObject.prototype.getFillRectSurfaceTexture = function() {
                return this._fillRectSurfaceTexture;
            }, WebGLSharedObject.prototype.getPrimarySurface = function() {
                return this._surface;
            }, WebGLSharedObject.prototype.createBackSurface = function(width, height) {
                return new WebGLBackSurface_1.WebGLBackSurface(this, width, height);
            }, WebGLSharedObject.prototype.pushRenderTarget = function(renderTarget) {
                this._commit(), this._renderTargetStack.push(renderTarget), this._context.bindFramebuffer(this._context.FRAMEBUFFER, renderTarget.framebuffer), 
                this._context.viewport(0, 0, renderTarget.viewportWidth, renderTarget.viewportHeight);
            }, WebGLSharedObject.prototype.popRenderTarget = function() {
                this._commit(), this._renderTargetStack.pop();
                var renderTarget = this.getCurrentRenderTarget();
                this._context.bindFramebuffer(this._context.FRAMEBUFFER, renderTarget.framebuffer), 
                this._context.viewport(0, 0, renderTarget.viewportWidth, renderTarget.viewportHeight);
            }, WebGLSharedObject.prototype.getCurrentRenderTarget = function() {
                return this._renderTargetStack[this._renderTargetStack.length - 1];
            }, WebGLSharedObject.prototype.begin = function() {
                this.clear(), this._currentShaderProgram.use(), this._currentShaderProgram.set_aVertex(this._vertices), 
                this._currentShaderProgram.set_uColor(this._currentColor), this._currentShaderProgram.set_uAlpha(this._currentAlpha), 
                this._currentShaderProgram.set_uSampler(0), this._currentShaderProgram.updateUniforms();
            }, WebGLSharedObject.prototype.clear = function() {
                this._context.clear(this._context.COLOR_BUFFER_BIT);
            }, WebGLSharedObject.prototype.draw = function(state, surfaceTexture, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, color) {
                this._numSprites >= this._maxSpriteCount && this._commit();
                var shaderProgram;
                if (shaderProgram = surfaceTexture === this._fillRectSurfaceTexture || null == state.shaderProgram || null == state.shaderProgram._program ? this._defaultShaderProgram : state.shaderProgram._program, 
                this._currentShaderProgram !== shaderProgram && (this._commit(), this._currentShaderProgram = shaderProgram, 
                this._currentShaderProgram.use(), this._currentShaderProgram.updateUniforms(), this._currentCompositeOperation = null, 
                this._currentAlpha = null, this._currentColor = [], this._currentTexture = null), 
                this._currentTexture !== surfaceTexture.texture && (this._currentTexture = surfaceTexture.texture, 
                this._commit(), this._context.bindTexture(this._context.TEXTURE_2D, surfaceTexture.texture)), 
                (this._currentColor[0] !== color[0] || this._currentColor[1] !== color[1] || this._currentColor[2] !== color[2] || this._currentColor[3] !== color[3]) && (this._currentColor = color, 
                this._commit(), this._currentShaderProgram.set_uColor(color)), this._currentAlpha !== state.globalAlpha && (this._currentAlpha = state.globalAlpha, 
                this._commit(), this._currentShaderProgram.set_uAlpha(state.globalAlpha)), this._currentCompositeOperation !== state.globalCompositeOperation) {
                    this._currentCompositeOperation = state.globalCompositeOperation, this._commit();
                    var compositeOperation = this._compositeOps[this._currentCompositeOperation];
                    this._context.blendFunc(compositeOperation[0], compositeOperation[1]);
                }
                var tw = 1 / surfaceTexture.textureWidth, th = 1 / surfaceTexture.textureHeight, ox = surfaceTexture.textureOffsetX, oy = surfaceTexture.textureOffsetY, s = tw * (ox + offsetX + width), t = th * (oy + offsetY + height), u = tw * (ox + offsetX), v = th * (oy + offsetY);
                this._register(this._transformVertex(canvasOffsetX, canvasOffsetY, width, height, state.transformer), [ u, v, s, v, s, t, u, v, s, t, u, t ]);
            }, WebGLSharedObject.prototype.end = function() {
                if (this._commit(), this._deleteRequestedTargets.length > 0) {
                    for (var i = 0; i < this._deleteRequestedTargets.length; ++i) this.deleteRenderTarget(this._deleteRequestedTargets[i]);
                    this._deleteRequestedTargets = [];
                }
            }, WebGLSharedObject.prototype.makeTextureForSurface = function(surface) {
                this._textureAtlas.makeTextureForSurface(this, surface);
            }, WebGLSharedObject.prototype.disposeTexture = function(texture) {
                this._currentTexture === texture && this._commit();
            }, WebGLSharedObject.prototype.assignTexture = function(image, x, y, texture) {
                if (this._context.bindTexture(this._context.TEXTURE_2D, texture), image instanceof HTMLVideoElement) throw g.ExceptionFactory.createAssertionError("WebGLRenderer#assignTexture: HTMLVideoElement is not supported.");
                this._context.texSubImage2D(this._context.TEXTURE_2D, 0, x, y, this._context.RGBA, this._context.UNSIGNED_BYTE, image), 
                this._context.bindTexture(this._context.TEXTURE_2D, this._currentTexture);
            }, WebGLSharedObject.prototype.clearTexture = function(texturePixels, width, height, texture) {
                this._context.bindTexture(this._context.TEXTURE_2D, texture), this._context.texSubImage2D(this._context.TEXTURE_2D, 0, 0, 0, width, height, this._context.RGBA, this._context.UNSIGNED_BYTE, texturePixels), 
                this._context.bindTexture(this._context.TEXTURE_2D, this._currentTexture);
            }, WebGLSharedObject.prototype.makeTextureRaw = function(width, height, pixels) {
                void 0 === pixels && (pixels = null);
                var texture = this._context.createTexture();
                return this._context.bindTexture(this._context.TEXTURE_2D, texture), this._context.pixelStorei(this._context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_WRAP_S, this._context.CLAMP_TO_EDGE), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_WRAP_T, this._context.CLAMP_TO_EDGE), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MAG_FILTER, this._context.NEAREST), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MIN_FILTER, this._context.NEAREST), 
                this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, width, height, 0, this._context.RGBA, this._context.UNSIGNED_BYTE, pixels), 
                this._context.bindTexture(this._context.TEXTURE_2D, this._currentTexture), texture;
            }, WebGLSharedObject.prototype.makeTexture = function(data) {
                var texture = this._context.createTexture();
                return this._context.bindTexture(this._context.TEXTURE_2D, texture), this._context.pixelStorei(this._context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_WRAP_S, this._context.CLAMP_TO_EDGE), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_WRAP_T, this._context.CLAMP_TO_EDGE), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MAG_FILTER, this._context.NEAREST), 
                this._context.texParameteri(this._context.TEXTURE_2D, this._context.TEXTURE_MIN_FILTER, this._context.NEAREST), 
                data instanceof HTMLImageElement ? this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, this._context.RGBA, this._context.UNSIGNED_BYTE, data) : data instanceof HTMLCanvasElement ? this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, this._context.RGBA, this._context.UNSIGNED_BYTE, data) : data instanceof ImageData && this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, this._context.RGBA, this._context.UNSIGNED_BYTE, data), 
                this._context.bindTexture(this._context.TEXTURE_2D, this._currentTexture), texture;
            }, WebGLSharedObject.prototype.getPrimaryRenderTarget = function(width, height) {
                return this._renderTarget;
            }, WebGLSharedObject.prototype.createRenderTarget = function(width, height) {
                var context = this._context, framebuffer = context.createFramebuffer();
                context.bindFramebuffer(context.FRAMEBUFFER, framebuffer);
                var texture = context.createTexture();
                context.bindTexture(context.TEXTURE_2D, texture), context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR), 
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR), 
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE), 
                context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE), 
                context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, width, height, 0, context.RGBA, context.UNSIGNED_BYTE, null), 
                context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, texture, 0), 
                context.bindTexture(context.TEXTURE_2D, this._currentTexture);
                var renderTaget = this.getCurrentRenderTarget();
                return context.bindFramebuffer(context.FRAMEBUFFER, renderTaget.framebuffer), {
                    width: width,
                    height: height,
                    viewportWidth: width,
                    viewportHeight: height,
                    framebuffer: framebuffer,
                    texture: texture
                };
            }, WebGLSharedObject.prototype.requestDeleteRenderTarget = function(renderTaget) {
                this._deleteRequestedTargets.push(renderTaget);
            }, WebGLSharedObject.prototype.deleteRenderTarget = function(renderTaget) {
                var context = this._context;
                this.getCurrentRenderTarget() === renderTaget && this._commit(), context.deleteFramebuffer(renderTaget.framebuffer), 
                context.deleteTexture(renderTaget.texture);
            }, WebGLSharedObject.prototype.getContext = function() {
                return this._context;
            }, WebGLSharedObject.prototype.getDefaultShaderProgram = function() {
                return this._defaultShaderProgram;
            }, WebGLSharedObject.prototype.initializeShaderProgram = function(shaderProgram) {
                if (shaderProgram && !shaderProgram._program) {
                    var program = new WebGLShaderProgram_1.WebGLShaderProgram(this._context, shaderProgram.fragmentShader, shaderProgram.uniforms);
                    program.initializeUniforms(), shaderProgram._program = program;
                }
                return shaderProgram;
            }, WebGLSharedObject.prototype._init = function() {
                var _a, program = new WebGLShaderProgram_1.WebGLShaderProgram(this._context);
                this._textureAtlas = new WebGLTextureAtlas_1.WebGLTextureAtlas(), this._fillRectTexture = this.makeTextureRaw(1, 1, new Uint8Array([ 255, 255, 255, 255 ])), 
                this._fillRectSurfaceTexture = {
                    texture: this._fillRectTexture,
                    textureWidth: 1,
                    textureHeight: 1,
                    textureOffsetX: 0,
                    textureOffsetY: 0
                }, this._renderTarget = {
                    width: this._surface.width,
                    height: this._surface.height,
                    viewportWidth: this._surface.width,
                    viewportHeight: this._surface.height,
                    framebuffer: null,
                    texture: null
                }, this._maxSpriteCount = 1024, this._vertices = this._makeBuffer(24 * this._maxSpriteCount * 4), 
                this._verticesCache = new Float32Array(24 * this._maxSpriteCount), this._numSprites = 0, 
                this._currentTexture = null, this._currentColor = [ 1, 1, 1, 1 ], this._currentAlpha = 1, 
                this._currentCompositeOperation = g.CompositeOperation.SourceOver, this._currentShaderProgram = program, 
                this._defaultShaderProgram = program, this._renderTargetStack = [], this._deleteRequestedTargets = [], 
                this._currentShaderProgram.use();
                try {
                    this._currentShaderProgram.set_aVertex(this._vertices), this._currentShaderProgram.set_uColor(this._currentColor), 
                    this._currentShaderProgram.set_uAlpha(this._currentAlpha), this._currentShaderProgram.set_uSampler(0);
                } finally {
                    this._currentShaderProgram.unuse();
                }
                this._context.enable(this._context.BLEND), this._context.activeTexture(this._context.TEXTURE0), 
                this._context.bindTexture(this._context.TEXTURE_2D, this._fillRectTexture), this._compositeOps = (_a = {}, 
                _a[g.CompositeOperation.SourceAtop] = [ this._context.DST_ALPHA, this._context.ONE_MINUS_SRC_ALPHA ], 
                _a[g.CompositeOperation.ExperimentalSourceIn] = [ this._context.DST_ALPHA, this._context.ZERO ], 
                _a[g.CompositeOperation.ExperimentalSourceOut] = [ this._context.ONE_MINUS_DST_ALPHA, this._context.ZERO ], 
                _a[g.CompositeOperation.SourceOver] = [ this._context.ONE, this._context.ONE_MINUS_SRC_ALPHA ], 
                _a[g.CompositeOperation.ExperimentalDestinationAtop] = [ this._context.ONE_MINUS_DST_ALPHA, this._context.SRC_ALPHA ], 
                _a[g.CompositeOperation.ExperimentalDestinationIn] = [ this._context.ZERO, this._context.SRC_ALPHA ], 
                _a[g.CompositeOperation.DestinationOut] = [ this._context.ZERO, this._context.ONE_MINUS_SRC_ALPHA ], 
                _a[g.CompositeOperation.DestinationOver] = [ this._context.ONE_MINUS_DST_ALPHA, this._context.ONE ], 
                _a[g.CompositeOperation.Lighter] = [ this._context.ONE, this._context.ONE ], _a[g.CompositeOperation.Copy] = [ this._context.ONE, this._context.ZERO ], 
                _a[g.CompositeOperation.Xor] = [ this._context.ONE_MINUS_DST_ALPHA, this._context.ONE_MINUS_SRC_ALPHA ], 
                _a);
                var compositeOperation = this._compositeOps[this._currentCompositeOperation];
                this._context.blendFunc(compositeOperation[0], compositeOperation[1]);
            }, WebGLSharedObject.prototype._makeBuffer = function(data) {
                var buffer = this._context.createBuffer();
                return this._context.bindBuffer(this._context.ARRAY_BUFFER, buffer), this._context.bufferData(this._context.ARRAY_BUFFER, data, this._context.DYNAMIC_DRAW), 
                buffer;
            }, WebGLSharedObject.prototype._transformVertex = function(x, y, w, h, transformer) {
                var renderTaget = this.getCurrentRenderTarget(), cw = 2 / renderTaget.width, ch = -2 / renderTaget.height, m = transformer.matrix, a = cw * w * m[0], b = ch * w * m[1], c = cw * h * m[2], d = ch * h * m[3], e = cw * (x * m[0] + y * m[2] + m[4]) - 1, f = ch * (x * m[1] + y * m[3] + m[5]) + 1;
                return [ e, f, a + e, b + f, a + c + e, b + d + f, e, f, a + c + e, b + d + f, c + e, d + f ];
            }, WebGLSharedObject.prototype._register = function(vertex, texCoord) {
                var offset = 6 * this._numSprites;
                ++this._numSprites;
                for (var i = 0; 6 > i; ++i) this._verticesCache[4 * (i + offset) + 0] = vertex[2 * i + 0], 
                this._verticesCache[4 * (i + offset) + 1] = vertex[2 * i + 1], this._verticesCache[4 * (i + offset) + 2] = texCoord[2 * i + 0], 
                this._verticesCache[4 * (i + offset) + 3] = texCoord[2 * i + 1];
            }, WebGLSharedObject.prototype._commit = function() {
                this._numSprites > 0 && (this._context.bindBuffer(this._context.ARRAY_BUFFER, this._vertices), 
                this._context.bufferSubData(this._context.ARRAY_BUFFER, 0, this._verticesCache.subarray(0, 24 * this._numSprites)), 
                this._context.drawArrays(this._context.TRIANGLES, 0, 6 * this._numSprites), this._numSprites = 0);
            }, WebGLSharedObject;
        }();
        exports.WebGLSharedObject = WebGLSharedObject;
    }, {
        "./WebGLBackSurface": 20,
        "./WebGLPrimarySurface": 23,
        "./WebGLShaderProgram": 26,
        "./WebGLTextureAtlas": 28,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    28: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var WebGLTextureMap_1 = require("./WebGLTextureMap"), RenderingHelper_1 = require("../RenderingHelper"), WebGLTextureAtlas = function() {
            function WebGLTextureAtlas() {
                this._maps = [], this._insertPos = 0, this.emptyTexturePixels = new Uint8Array(WebGLTextureAtlas.TEXTURE_SIZE * WebGLTextureAtlas.TEXTURE_SIZE * 4);
            }
            return WebGLTextureAtlas.prototype.clear = function() {
                for (var i = 0; i < this._maps.length; ++i) this._maps[i].dispose();
            }, WebGLTextureAtlas.prototype.showOccupancy = function() {
                for (var i = 0; i < this._maps.length; ++i) console.log("occupancy[" + i + "]: " + this._maps[i].occupancy());
            }, WebGLTextureAtlas.prototype.makeTextureForSurface = function(shared, surface) {
                var image = surface._drawable;
                if (image && !image.texture) {
                    var width = image.width, height = image.height;
                    if (width >= WebGLTextureAtlas.TEXTURE_SIZE || height >= WebGLTextureAtlas.TEXTURE_SIZE) {
                        var w = RenderingHelper_1.RenderingHelper.toPowerOfTwo(image.width), h = RenderingHelper_1.RenderingHelper.toPowerOfTwo(image.height);
                        if (w !== image.width || h !== image.height) {
                            var canvas = document.createElement("canvas");
                            canvas.width = w, canvas.height = h;
                            var canvasContext = canvas.getContext("2d");
                            canvasContext.globalCompositeOperation = "copy", canvasContext.drawImage(image, 0, 0), 
                            image = canvasContext.getImageData(0, 0, w, h);
                        }
                        return surface._drawable.texture = shared.makeTexture(image), surface._drawable.textureOffsetX = 0, 
                        surface._drawable.textureOffsetY = 0, surface._drawable.textureWidth = w, void (surface._drawable.textureHeight = h);
                    }
                    this._assign(shared, surface, this._maps);
                }
            }, WebGLTextureAtlas.prototype._assign = function(shared, surface, maps) {
                for (var map, i = 0; i < maps.length; ++i) if (map = maps[(i + this._insertPos) % maps.length].insert(surface)) return this._register(shared, map, surface._drawable), 
                void (this._insertPos = i);
                map = null, maps.length >= WebGLTextureAtlas.TEXTURE_COUNT && (map = maps.shift(), 
                shared.disposeTexture(map.texture), map.dispose(), shared.clearTexture(this.emptyTexturePixels, WebGLTextureAtlas.TEXTURE_SIZE, WebGLTextureAtlas.TEXTURE_SIZE, map.texture)), 
                map || (map = new WebGLTextureMap_1.WebGLTextureMap(shared.makeTextureRaw(WebGLTextureAtlas.TEXTURE_SIZE, WebGLTextureAtlas.TEXTURE_SIZE), 0, 0, WebGLTextureAtlas.TEXTURE_SIZE, WebGLTextureAtlas.TEXTURE_SIZE)), 
                maps.push(map), map = map.insert(surface), this._register(shared, map, surface._drawable);
            }, WebGLTextureAtlas.prototype._register = function(shared, map, image) {
                image.texture = map.texture, image.textureOffsetX = map.offsetX, image.textureOffsetY = map.offsetY, 
                image.textureWidth = WebGLTextureAtlas.TEXTURE_SIZE, image.textureHeight = WebGLTextureAtlas.TEXTURE_SIZE, 
                shared.assignTexture(image, map.offsetX, map.offsetY, map.texture);
            }, WebGLTextureAtlas.TEXTURE_SIZE = 1024, WebGLTextureAtlas.TEXTURE_COUNT = 16, 
            WebGLTextureAtlas;
        }();
        exports.WebGLTextureAtlas = WebGLTextureAtlas;
    }, {
        "../RenderingHelper": 14,
        "./WebGLTextureMap": 29
    } ],
    29: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var WebGLTextureMap = function() {
            function WebGLTextureMap(texture, offsetX, offsetY, width, height) {
                this.texture = texture, this.offsetX = offsetX, this.offsetY = offsetY, this._width = width, 
                this._height = height;
            }
            return WebGLTextureMap.prototype.dispose = function() {
                this._left && (this._left.dispose(), this._left = null), this._right && (this._right.dispose(), 
                this._right = null), this._surface && (this._surface._drawable && (this._surface._drawable.texture = null), 
                this._surface = null);
            }, WebGLTextureMap.prototype.capacity = function() {
                return this._width * this._height;
            }, WebGLTextureMap.prototype.area = function() {
                if (!this._surface) return 0;
                var image = this._surface._drawable, a = image.width * image.height;
                return this._left && (a += this._left.area()), this._right && (a += this._right.area()), 
                a;
            }, WebGLTextureMap.prototype.occupancy = function() {
                return this.area() / this.capacity();
            }, WebGLTextureMap.prototype.insert = function(surface) {
                var image = surface._drawable, width = image.width + WebGLTextureMap.TEXTURE_MARGIN, height = image.height + WebGLTextureMap.TEXTURE_MARGIN;
                if (this._surface) {
                    if (this._left) {
                        var left = this._left.insert(surface);
                        if (left) return left;
                    }
                    if (this._right) {
                        var right = this._right.insert(surface);
                        if (right) return right;
                    }
                    return null;
                }
                if (this._width < width || this._height < height) return null;
                var remainWidth = this._width - width, remainHeight = this._height - height;
                return remainHeight >= remainWidth ? (this._left = new WebGLTextureMap(this.texture, this.offsetX + width, this.offsetY, remainWidth, height), 
                this._right = new WebGLTextureMap(this.texture, this.offsetX, this.offsetY + height, this._width, remainHeight)) : (this._left = new WebGLTextureMap(this.texture, this.offsetX, this.offsetY + height, width, remainHeight), 
                this._right = new WebGLTextureMap(this.texture, this.offsetX + width, this.offsetY, remainWidth, this._height)), 
                this._surface = surface, this;
            }, WebGLTextureMap.TEXTURE_MARGIN = 1, WebGLTextureMap;
        }();
        exports.WebGLTextureMap = WebGLTextureMap;
    }, {} ],
    30: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), InputAbstractHandler = (require("@akashic/akashic-pdi"), 
        function() {
            function InputAbstractHandler(inputView, disablePreventDefault) {
                if (Object.getPrototypeOf && Object.getPrototypeOf(this) === InputAbstractHandler.prototype) throw new Error("InputAbstractHandler is abstract and should not be directly instantiated");
                this.inputView = inputView, this.pointerEventLock = {}, this._xScale = 1, this._yScale = 1, 
                this._disablePreventDefault = !!disablePreventDefault, this.pointTrigger = new g.Trigger();
            }
            return InputAbstractHandler.isSupported = function() {
                return !1;
            }, InputAbstractHandler.prototype.start = function() {
                throw new Error("This method is abstract");
            }, InputAbstractHandler.prototype.stop = function() {
                throw new Error("This method is abstract");
            }, InputAbstractHandler.prototype.setScale = function(xScale, yScale) {
                void 0 === yScale && (yScale = xScale), this._xScale = xScale, this._yScale = yScale;
            }, InputAbstractHandler.prototype.pointDown = function(identifier, pagePosition) {
                this.pointTrigger.fire({
                    type: 0,
                    identifier: identifier,
                    offset: this.getOffsetFromEvent(pagePosition)
                }), this.pointerEventLock[identifier] = !0;
            }, InputAbstractHandler.prototype.pointMove = function(identifier, pagePosition) {
                this.pointerEventLock.hasOwnProperty(identifier + "") && this.pointTrigger.fire({
                    type: 1,
                    identifier: identifier,
                    offset: this.getOffsetFromEvent(pagePosition)
                });
            }, InputAbstractHandler.prototype.pointUp = function(identifier, pagePosition) {
                this.pointerEventLock.hasOwnProperty(identifier + "") && (this.pointTrigger.fire({
                    type: 2,
                    identifier: identifier,
                    offset: this.getOffsetFromEvent(pagePosition)
                }), delete this.pointerEventLock[identifier]);
            }, InputAbstractHandler.prototype.getOffsetFromEvent = function(e) {
                return {
                    x: e.offsetX,
                    y: e.offsetY
                };
            }, InputAbstractHandler.prototype.getScale = function() {
                return {
                    x: this._xScale,
                    y: this._yScale
                };
            }, InputAbstractHandler;
        }());
        exports.InputAbstractHandler = InputAbstractHandler;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine",
        "@akashic/akashic-pdi": 49
    } ],
    31: [ function(require, module, exports) {
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
        var InputAbstractHandler_1 = require("./InputAbstractHandler"), MouseHandler = function(_super) {
            function MouseHandler(inputView, disablePreventDefault) {
                var _this = _super.call(this, inputView, disablePreventDefault) || this, identifier = 1;
                return _this.onMouseDown = function(e) {
                    0 === e.button && (_this.eventTarget = e.target, _this.pointDown(identifier, e), 
                    window.addEventListener("mousemove", _this.onMouseMove, !1), window.addEventListener("mouseup", _this.onMouseUp, !1), 
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault()));
                }, _this.onMouseMove = function(e) {
                    e.target === _this.eventTarget && (_this.pointMove(identifier, e), _this._disablePreventDefault || (e.stopPropagation(), 
                    e.preventDefault()));
                }, _this.onMouseUp = function(e) {
                    e.target === _this.eventTarget && (_this.pointUp(identifier, e), window.removeEventListener("mousemove", _this.onMouseMove, !1), 
                    window.removeEventListener("mouseup", _this.onMouseUp, !1), _this._disablePreventDefault || (e.stopPropagation(), 
                    e.preventDefault()));
                }, _this;
            }
            return __extends(MouseHandler, _super), MouseHandler.prototype.start = function() {
                this.inputView.addEventListener("mousedown", this.onMouseDown, !1);
            }, MouseHandler.prototype.stop = function() {
                this.inputView.removeEventListener("mousedown", this.onMouseDown, !1);
            }, MouseHandler;
        }(InputAbstractHandler_1.InputAbstractHandler);
        exports.MouseHandler = MouseHandler;
    }, {
        "./InputAbstractHandler": 30
    } ],
    32: [ function(require, module, exports) {
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
        var MouseHandler_1 = require("./MouseHandler"), TouchHandler = function(_super) {
            function TouchHandler(inputView, disablePreventDefault) {
                var _this = _super.call(this, inputView, disablePreventDefault) || this;
                return _this.onTouchDown = function(e) {
                    for (var touches = e.changedTouches, i = 0, len = touches.length; len > i; i++) {
                        var touch = touches[i];
                        _this.pointDown(touch.identifier, _this.convertToPagePosition(touch));
                    }
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault());
                }, _this.onTouchMove = function(e) {
                    for (var touches = e.changedTouches, i = 0, len = touches.length; len > i; i++) {
                        var touch = touches[i];
                        _this.pointMove(touch.identifier, _this.convertToPagePosition(touch));
                    }
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault());
                }, _this.onTouchUp = function(e) {
                    for (var touches = e.changedTouches, i = 0, len = touches.length; len > i; i++) {
                        var touch = touches[i];
                        _this.pointUp(touch.identifier, _this.convertToPagePosition(touch));
                    }
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault());
                }, _this;
            }
            return __extends(TouchHandler, _super), TouchHandler.prototype.start = function() {
                _super.prototype.start.call(this), this.inputView.addEventListener("touchstart", this.onTouchDown), 
                this.inputView.addEventListener("touchmove", this.onTouchMove), this.inputView.addEventListener("touchend", this.onTouchUp);
            }, TouchHandler.prototype.stop = function() {
                _super.prototype.stop.call(this), this.inputView.removeEventListener("touchstart", this.onTouchDown), 
                this.inputView.removeEventListener("touchmove", this.onTouchMove), this.inputView.removeEventListener("touchend", this.onTouchUp);
            }, TouchHandler.prototype.convertToPagePosition = function(e) {
                var bounding = this.inputView.getBoundingClientRect(), scale = this.getScale();
                return {
                    offsetX: (e.pageX - Math.round(window.pageXOffset + bounding.left)) / scale.x,
                    offsetY: (e.pageY - Math.round(window.pageYOffset + bounding.top)) / scale.y
                };
            }, TouchHandler;
        }(MouseHandler_1.MouseHandler);
        exports.TouchHandler = TouchHandler;
    }, {
        "./MouseHandler": 31
    } ],
    33: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var AudioPluginManager = function() {
            function AudioPluginManager() {
                this._activePlugin = void 0;
            }
            return AudioPluginManager.prototype.getActivePlugin = function() {
                return void 0 === this._activePlugin ? null : this._activePlugin;
            }, AudioPluginManager.prototype.tryInstallPlugin = function(plugins) {
                var PluginConstructor = this.findFirstAvailablePlugin(plugins);
                return PluginConstructor ? (this._activePlugin = new PluginConstructor(), !0) : !1;
            }, AudioPluginManager.prototype.findFirstAvailablePlugin = function(plugins) {
                for (var i = 0, len = plugins.length; len > i; i++) {
                    var plugin = plugins[i];
                    if (plugin.isSupported()) return plugin;
                }
            }, AudioPluginManager;
        }();
        exports.AudioPluginManager = AudioPluginManager;
    }, {} ],
    34: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var audioPlugins = [];
        exports.AudioPluginRegistry = {
            addPlugin: function(plugin) {
                -1 === audioPlugins.indexOf(plugin) && audioPlugins.push(plugin);
            },
            getRegisteredAudioPlugins: function() {
                return audioPlugins;
            },
            clear: function() {
                audioPlugins = [];
            }
        };
    }, {} ],
    35: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), HTMLAudioAsset = function(_super) {
            function HTMLAudioAsset() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            return __extends(HTMLAudioAsset, _super), HTMLAudioAsset.prototype._load = function(loader) {
                var _this = this;
                if (null == this.path) return this.data = null, void setTimeout(function() {
                    return loader._onAssetLoad(_this);
                }, 0);
                var audio = new Audio(), startLoadingAudio = function(path, handlers) {
                    audio.autoplay = !1, audio.preload = "none", audio.src = path, _this._attachAll(audio, handlers), 
                    audio.preload = "auto", setAudioLoadInterval(audio, handlers), audio.load();
                }, handlers = {
                    success: function() {
                        _this._detachAll(audio, handlers), _this.data = audio, loader._onAssetLoad(_this), 
                        window.clearInterval(_this._intervalId);
                    },
                    error: function() {
                        _this._detachAll(audio, handlers), _this.data = audio, loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("HTMLAudioAsset loading error")), 
                        window.clearInterval(_this._intervalId);
                    }
                }, setAudioLoadInterval = function(audio, handlers) {
                    _this._intervalCount = 0, _this._intervalId = window.setInterval(function() {
                        4 === audio.readyState ? handlers.success() : (++_this._intervalCount, 600 === _this._intervalCount && handlers.error());
                    }, 100);
                };
                if (".aac" === this.path.slice(-4) && -1 !== HTMLAudioAsset.supportedFormats.indexOf("mp4")) {
                    var altHandlers = {
                        success: handlers.success,
                        error: function() {
                            _this._detachAll(audio, altHandlers), window.clearInterval(_this._intervalId);
                            var altPath = _this.path.slice(0, _this.path.length - 4) + ".mp4";
                            startLoadingAudio(altPath, handlers);
                        }
                    };
                    return void startLoadingAudio(this.path, altHandlers);
                }
                startLoadingAudio(this.path, handlers);
            }, HTMLAudioAsset.prototype.cloneElement = function() {
                return this.data ? new Audio(this.data.src) : null;
            }, HTMLAudioAsset.prototype._assetPathFilter = function(path) {
                return -1 !== HTMLAudioAsset.supportedFormats.indexOf("ogg") ? g.PathUtil.addExtname(path, "ogg") : -1 !== HTMLAudioAsset.supportedFormats.indexOf("aac") ? g.PathUtil.addExtname(path, "aac") : null;
            }, HTMLAudioAsset.prototype._attachAll = function(audio, handlers) {
                handlers.success && audio.addEventListener("canplaythrough", handlers.success, !1), 
                handlers.error && (audio.addEventListener("stalled", handlers.error, !1), audio.addEventListener("error", handlers.error, !1), 
                audio.addEventListener("abort", handlers.error, !1));
            }, HTMLAudioAsset.prototype._detachAll = function(audio, handlers) {
                handlers.success && audio.removeEventListener("canplaythrough", handlers.success, !1), 
                handlers.error && (audio.removeEventListener("stalled", handlers.error, !1), audio.removeEventListener("error", handlers.error, !1), 
                audio.removeEventListener("abort", handlers.error, !1));
            }, HTMLAudioAsset;
        }(g.AudioAsset);
        exports.HTMLAudioAsset = HTMLAudioAsset;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    36: [ function(require, module, exports) {
        "use strict";
        function resumeHandler() {
            playSuspendedAudioElements(), clearUserInteractListener();
        }
        function setUserInteractListener() {
            document.addEventListener("keydown", resumeHandler, !0), document.addEventListener("mousedown", resumeHandler, !0), 
            document.addEventListener("touchend", resumeHandler, !0);
        }
        function clearUserInteractListener() {
            document.removeEventListener("keydown", resumeHandler), document.removeEventListener("mousedown", resumeHandler), 
            document.removeEventListener("touchend", resumeHandler);
        }
        function playSuspendedAudioElements() {
            state = 2, suspendedAudioElements.forEach(function(audio) {
                return audio.play();
            }), suspendedAudioElements = [];
        }
        var HTMLAudioAutoplayHelper, state = 0, suspendedAudioElements = [];
        !function(HTMLAudioAutoplayHelper) {
            function setupChromeMEIWorkaround(audio) {
                function playHandler() {
                    switch (state) {
                      case 0:
                      case 1:
                        playSuspendedAudioElements();
                        break;

                      case 2:                    }
                    state = 2, clearTimeout(timer);
                }
                function suspendedHandler() {
                    switch (audio.removeEventListener("play", playHandler), state) {
                      case 0:
                        suspendedAudioElements.push(audio), state = 1, setUserInteractListener();
                        break;

                      case 1:
                        suspendedAudioElements.push(audio);
                        break;

                      case 2:
                        audio.play();
                    }
                }
                switch (state) {
                  case 0:
                    audio.addEventListener("play", playHandler, !0);
                    var timer = setTimeout(suspendedHandler, 100);
                    break;

                  case 1:
                    suspendedAudioElements.push(audio);
                    break;

                  case 2:                }
            }
            HTMLAudioAutoplayHelper.setupChromeMEIWorkaround = setupChromeMEIWorkaround;
        }(HTMLAudioAutoplayHelper || (HTMLAudioAutoplayHelper = {})), module.exports = HTMLAudioAutoplayHelper;
    }, {} ],
    37: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), autoPlayHelper = require("./HTMLAudioAutoplayHelper"), HTMLAudioPlayer = function(_super) {
            function HTMLAudioPlayer(system, manager) {
                var _this = _super.call(this, system) || this;
                return _this._manager = manager, _this._endedEventHandler = function() {
                    _this._onAudioEnded();
                }, _this._onPlayEventHandler = function() {
                    _this._onPlayEvent();
                }, _this._dummyDurationWaitTimer = null, _this;
            }
            return __extends(HTMLAudioPlayer, _super), HTMLAudioPlayer.prototype.play = function(asset) {
                this.currentAudio && this.stop();
                var audio = asset.cloneElement();
                audio ? (autoPlayHelper.setupChromeMEIWorkaround(audio), audio.volume = this._calculateVolume(), 
                audio.play()["catch"](function(err) {}), audio.loop = asset.loop, audio.addEventListener("ended", this._endedEventHandler, !1), 
                audio.addEventListener("play", this._onPlayEventHandler, !1), this._isWaitingPlayEvent = !0, 
                this._audioInstance = audio) : this._dummyDurationWaitTimer = setTimeout(this._endedEventHandler, asset.duration), 
                _super.prototype.play.call(this, asset);
            }, HTMLAudioPlayer.prototype.stop = function() {
                return this.currentAudio ? (this._clearEndedEventHandler(), this._audioInstance && (this._isWaitingPlayEvent ? this._isStopRequested = !0 : (this._audioInstance.pause(), 
                this._audioInstance = null)), void _super.prototype.stop.call(this)) : void _super.prototype.stop.call(this);
            }, HTMLAudioPlayer.prototype.changeVolume = function(volume) {
                _super.prototype.changeVolume.call(this, volume), this._audioInstance && (this._audioInstance.volume = this._calculateVolume());
            }, HTMLAudioPlayer.prototype._changeMuted = function(muted) {
                _super.prototype._changeMuted.call(this, muted), this._audioInstance && (this._audioInstance.volume = this._calculateVolume());
            }, HTMLAudioPlayer.prototype.notifyMasterVolumeChanged = function() {
                this._audioInstance && (this._audioInstance.volume = this._calculateVolume());
            }, HTMLAudioPlayer.prototype._onAudioEnded = function() {
                this._clearEndedEventHandler(), _super.prototype.stop.call(this);
            }, HTMLAudioPlayer.prototype._clearEndedEventHandler = function() {
                this._audioInstance && this._audioInstance.removeEventListener("ended", this._endedEventHandler, !1), 
                null != this._dummyDurationWaitTimer && (clearTimeout(this._dummyDurationWaitTimer), 
                this._dummyDurationWaitTimer = null);
            }, HTMLAudioPlayer.prototype._onPlayEvent = function() {
                this._isWaitingPlayEvent && (this._isWaitingPlayEvent = !1, this._isStopRequested && (this._isStopRequested = !1, 
                this._audioInstance.pause(), this._audioInstance = null));
            }, HTMLAudioPlayer.prototype._calculateVolume = function() {
                return this._muted ? 0 : this.volume * this._system.volume * this._manager.getMasterVolume();
            }, HTMLAudioPlayer;
        }(g.AudioPlayer);
        exports.HTMLAudioPlayer = HTMLAudioPlayer;
    }, {
        "./HTMLAudioAutoplayHelper": 36,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    38: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var HTMLAudioAsset_1 = require("./HTMLAudioAsset"), HTMLAudioPlayer_1 = require("./HTMLAudioPlayer"), HTMLAudioPlugin = function() {
            function HTMLAudioPlugin() {
                this._supportedFormats = this._detectSupportedFormats(), HTMLAudioAsset_1.HTMLAudioAsset.supportedFormats = this.supportedFormats;
            }
            return HTMLAudioPlugin.isSupported = function() {
                var audioElement = document.createElement("audio"), result = !1;
                try {
                    result = void 0 !== audioElement.canPlayType;
                } catch (e) {}
                return result;
            }, Object.defineProperty(HTMLAudioPlugin.prototype, "supportedFormats", {
                get: function() {
                    return this._supportedFormats;
                },
                set: function(supportedFormats) {
                    this._supportedFormats = supportedFormats, HTMLAudioAsset_1.HTMLAudioAsset.supportedFormats = supportedFormats;
                },
                enumerable: !0,
                configurable: !0
            }), HTMLAudioPlugin.prototype.createAsset = function(id, assetPath, duration, system, loop, hint) {
                return new HTMLAudioAsset_1.HTMLAudioAsset(id, assetPath, duration, system, loop, hint);
            }, HTMLAudioPlugin.prototype.createPlayer = function(system, manager) {
                return new HTMLAudioPlayer_1.HTMLAudioPlayer(system, manager);
            }, HTMLAudioPlugin.prototype._detectSupportedFormats = function() {
                if (-1 !== navigator.userAgent.indexOf("Edge/")) return [ "aac" ];
                var audioElement = document.createElement("audio"), supportedFormats = [];
                try {
                    for (var supportedExtensions = [ "ogg", "aac", "mp4" ], i = 0, len = supportedExtensions.length; len > i; i++) {
                        var ext = supportedExtensions[i], canPlay = audioElement.canPlayType("audio/" + ext), supported = "no" !== canPlay && "" !== canPlay;
                        supported && supportedFormats.push(ext);
                    }
                } catch (e) {}
                return supportedFormats;
            }, HTMLAudioPlugin;
        }();
        exports.HTMLAudioPlugin = HTMLAudioPlugin;
    }, {
        "./HTMLAudioAsset": 35,
        "./HTMLAudioPlayer": 37
    } ],
    39: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), PostMessageAudioPlugin_1 = require("./PostMessageAudioPlugin"), PostMessageAudioAsset = function(_super) {
            function PostMessageAudioAsset() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            return __extends(PostMessageAudioAsset, _super), PostMessageAudioAsset.prototype._load = function(loader) {
                var _this = this, param = {
                    id: this.id,
                    assetPath: this.path,
                    duration: this.duration,
                    loop: this.loop,
                    hint: this.hint
                };
                PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioAsset#_load", param), 
                setTimeout(function() {
                    return loader._onAssetLoad(_this);
                });
            }, PostMessageAudioAsset.prototype.destroy = function() {
                PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioAsset#destroy", {
                    id: this.id
                }), _super.prototype.destroy.call(this);
            }, PostMessageAudioAsset;
        }(g.AudioAsset);
        exports.PostMessageAudioAsset = PostMessageAudioAsset;
    }, {
        "./PostMessageAudioPlugin": 41,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    40: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), PostMessageAudioPlugin_1 = require("./PostMessageAudioPlugin"), PostMessageAudioPlayer = function(_super) {
            function PostMessageAudioPlayer(system, manager, id) {
                var _this = _super.call(this, system) || this;
                return _this._manager = manager, _this.id = id, PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#new", {
                    id: id
                }), _this;
            }
            return __extends(PostMessageAudioPlayer, _super), PostMessageAudioPlayer.prototype.play = function(asset) {
                PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#play", {
                    id: this.id,
                    assetId: asset.id
                });
            }, PostMessageAudioPlayer.prototype.stop = function() {
                PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#stop", {
                    id: this.id
                });
            }, PostMessageAudioPlayer.prototype.changeVolume = function(volume) {
                _super.prototype.changeVolume.call(this, volume), PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#changeVolume", {
                    id: this.id,
                    volume: this._calculateVolume()
                });
            }, PostMessageAudioPlayer.prototype._changeMuted = function(muted) {
                _super.prototype._changeMuted.call(this, muted), PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#changeVolume", {
                    id: this.id,
                    volume: this._calculateVolume()
                });
            }, PostMessageAudioPlayer.prototype._changePlaybackRate = function(rate) {
                _super.prototype._changePlaybackRate.call(this, rate), PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#changePlaybackRate", {
                    id: this.id,
                    rate: rate
                });
            }, PostMessageAudioPlayer.prototype.notifyMasterVolumeChanged = function() {
                PostMessageAudioPlugin_1.PostMessageAudioPlugin.send("akashic:AudioPlayer#changeVolume", {
                    id: this.id,
                    volume: this._calculateVolume()
                });
            }, PostMessageAudioPlayer.prototype._calculateVolume = function() {
                return this._muted ? 0 : this.volume * this._system.volume * this._manager.getMasterVolume();
            }, PostMessageAudioPlayer;
        }(g.AudioPlayer);
        exports.PostMessageAudioPlayer = PostMessageAudioPlayer;
    }, {
        "./PostMessageAudioPlugin": 41,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    41: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var postMessageHandler, PostMessageAudioAsset_1 = require("./PostMessageAudioAsset"), PostMessageAudioPlayer_1 = require("./PostMessageAudioPlayer"), PostMessageHandler_1 = require("./PostMessageHandler"), PostMessageAudioPlugin = function() {
            function PostMessageAudioPlugin() {
                this.supportedFormats = void 0, this._playerIdx = 0;
            }
            return PostMessageAudioPlugin.isSupported = function() {
                return "undefined" != typeof window && !!window.postMessage;
            }, PostMessageAudioPlugin.initialize = function(targetWindow, targetOrigin) {
                return postMessageHandler = new PostMessageHandler_1.PostMessageHandler(targetWindow, targetOrigin), 
                postMessageHandler.start(), postMessageHandler;
            }, PostMessageAudioPlugin.send = function(type, parameters) {
                postMessageHandler.send({
                    type: type,
                    parameters: parameters
                });
            }, PostMessageAudioPlugin.prototype.createAsset = function(id, assetPath, duration, system, loop, hint) {
                return new PostMessageAudioAsset_1.PostMessageAudioAsset(id, assetPath, duration, system, loop, hint);
            }, PostMessageAudioPlugin.prototype.createPlayer = function(system, manager) {
                return new PostMessageAudioPlayer_1.PostMessageAudioPlayer(system, manager, "" + this._playerIdx++);
            }, PostMessageAudioPlugin;
        }();
        exports.PostMessageAudioPlugin = PostMessageAudioPlugin;
    }, {
        "./PostMessageAudioAsset": 39,
        "./PostMessageAudioPlayer": 40,
        "./PostMessageHandler": 42
    } ],
    42: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), PostMessageHandler = function() {
            function PostMessageHandler(targetWindow, targetOrigin) {
                this.message = new g.Trigger(), this.targetWindow = targetWindow, this.targetOrigin = targetOrigin, 
                this.onMessage_bound = this.onMessage.bind(this);
            }
            return PostMessageHandler.prototype.start = function() {
                window.addEventListener("message", this.onMessage_bound);
            }, PostMessageHandler.prototype.stop = function() {
                window.removeEventListener("message", this.onMessage_bound);
            }, PostMessageHandler.prototype.send = function(message) {
                this.targetWindow.postMessage(message, this.targetOrigin);
            }, PostMessageHandler.prototype.onMessage = function(message) {
                message.origin === this.targetOrigin && this.message.fire(message.data);
            }, PostMessageHandler;
        }();
        exports.PostMessageHandler = PostMessageHandler;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    43: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), XHRLoader_1 = require("../../utils/XHRLoader"), helper = require("./WebAudioHelper"), WebAudioAsset = function(_super) {
            function WebAudioAsset() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            return __extends(WebAudioAsset, _super), WebAudioAsset.prototype._load = function(loader) {
                var _this = this;
                if (null == this.path) return this.data = null, void setTimeout(function() {
                    return loader._onAssetLoad(_this);
                }, 0);
                var successHandler = function(decodedAudio) {
                    _this.data = decodedAudio, loader._onAssetLoad(_this);
                }, errorHandler = function() {
                    loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("WebAudioAsset unknown loading error"));
                }, onLoadArrayBufferHandler = function(response) {
                    var audioContext = helper.getAudioContext();
                    audioContext.decodeAudioData(response, successHandler, errorHandler);
                }, xhrLoader = new XHRLoader_1.XHRLoader(), loadArrayBuffer = function(path, onSuccess, onFailed) {
                    xhrLoader.getArrayBuffer(path, function(error, response) {
                        error ? onFailed(error) : onSuccess(response);
                    });
                };
                return ".aac" === this.path.slice(-4) ? void loadArrayBuffer(this.path, onLoadArrayBufferHandler, function(error) {
                    var altPath = _this.path.slice(0, _this.path.length - 4) + ".mp4";
                    loadArrayBuffer(altPath, function(response) {
                        _this.path = altPath, onLoadArrayBufferHandler(response);
                    }, errorHandler);
                }) : void loadArrayBuffer(this.path, onLoadArrayBufferHandler, errorHandler);
            }, WebAudioAsset.prototype._assetPathFilter = function(path) {
                return -1 !== WebAudioAsset.supportedFormats.indexOf("ogg") ? g.PathUtil.addExtname(path, "ogg") : -1 !== WebAudioAsset.supportedFormats.indexOf("aac") ? g.PathUtil.addExtname(path, "aac") : null;
            }, WebAudioAsset.supportedFormats = [], WebAudioAsset;
        }(g.AudioAsset);
        exports.WebAudioAsset = WebAudioAsset;
    }, {
        "../../utils/XHRLoader": 48,
        "./WebAudioHelper": 45,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    44: [ function(require, module, exports) {
        "use strict";
        function resumeHandler() {
            var context = helper.getAudioContext();
            context.resume(), clearUserInteractListener();
        }
        function setUserInteractListener() {
            document.addEventListener("keydown", resumeHandler, !0), document.addEventListener("mousedown", resumeHandler, !0), 
            document.addEventListener("touchend", resumeHandler, !0);
        }
        function clearUserInteractListener() {
            document.removeEventListener("keydown", resumeHandler), document.removeEventListener("mousedown", resumeHandler), 
            document.removeEventListener("touchend", resumeHandler);
        }
        var WebAudioAutoplayHelper, helper = require("./WebAudioHelper");
        !function(WebAudioAutoplayHelper) {
            function setupChromeMEIWorkaround() {
                var context = helper.getAudioContext();
                if (!context || "function" == typeof context.resume) {
                    var gain = helper.createGainNode(context), osc = context.createOscillator();
                    osc.type = "sawtooth", osc.frequency.value = 440, osc.connect(gain), osc.start(0);
                    var contextState = context.state;
                    osc.disconnect(), "running" !== contextState && setUserInteractListener();
                }
            }
            WebAudioAutoplayHelper.setupChromeMEIWorkaround = setupChromeMEIWorkaround;
        }(WebAudioAutoplayHelper || (WebAudioAutoplayHelper = {})), module.exports = WebAudioAutoplayHelper;
    }, {
        "./WebAudioHelper": 45
    } ],
    45: [ function(require, module, exports) {
        "use strict";
        var WebAudioHelper, AudioContext = window.AudioContext || window.webkitAudioContext, singleContext = null;
        !function(WebAudioHelper) {
            function getAudioContext() {
                return singleContext || (singleContext = new AudioContext(), WebAudioHelper._workAroundSafari()), 
                singleContext;
            }
            function createGainNode(context) {
                return context.createGain ? context.createGain() : context.createGainNode();
            }
            function createBufferNode(context) {
                var sourceNode = context.createBufferSource();
                return sourceNode.start ? sourceNode : (sourceNode.start = sourceNode.noteOn, sourceNode.stop = sourceNode.noteOff, 
                sourceNode);
            }
            function _workAroundSafari() {
                document.addEventListener("touchstart", function touchInitializeHandler() {
                    document.removeEventListener("touchstart", touchInitializeHandler), singleContext.createBufferSource().start(0);
                }, !0);
            }
            WebAudioHelper.getAudioContext = getAudioContext, WebAudioHelper.createGainNode = createGainNode, 
            WebAudioHelper.createBufferNode = createBufferNode, WebAudioHelper._workAroundSafari = _workAroundSafari;
        }(WebAudioHelper || (WebAudioHelper = {})), module.exports = WebAudioHelper;
    }, {} ],
    46: [ function(require, module, exports) {
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
        var g = require("@akashic/akashic-engine"), helper = require("./WebAudioHelper"), WebAudioPlayer = function(_super) {
            function WebAudioPlayer(system, manager) {
                var _this = _super.call(this, system) || this;
                return _this._audioContext = helper.getAudioContext(), _this._manager = manager, 
                _this._gainNode = helper.createGainNode(_this._audioContext), _this._gainNode.connect(_this._audioContext.destination), 
                _this._sourceNode = void 0, _this._dummyDurationWaitTimer = null, _this._endedEventHandler = function() {
                    _this._onAudioEnded();
                }, _this;
            }
            return __extends(WebAudioPlayer, _super), WebAudioPlayer.prototype.changeVolume = function(volume) {
                _super.prototype.changeVolume.call(this, volume), this._gainNode.gain.value = this._calculateVolume();
            }, WebAudioPlayer.prototype._changeMuted = function(muted) {
                _super.prototype._changeMuted.call(this, muted), this._gainNode.gain.value = this._calculateVolume();
            }, WebAudioPlayer.prototype.play = function(asset) {
                if (this.currentAudio && this.stop(), asset.data) {
                    var bufferNode = helper.createBufferNode(this._audioContext);
                    bufferNode.loop = asset.loop, bufferNode.buffer = asset.data, this._gainNode.gain.value = this._calculateVolume(), 
                    bufferNode.connect(this._gainNode), this._sourceNode = bufferNode, this._sourceNode.onended = this._endedEventHandler, 
                    this._sourceNode.start(0);
                } else this._dummyDurationWaitTimer = setTimeout(this._endedEventHandler, asset.duration);
                _super.prototype.play.call(this, asset);
            }, WebAudioPlayer.prototype.stop = function() {
                return this.currentAudio ? (this._clearEndedEventHandler(), this._sourceNode && this._sourceNode.stop(0), 
                void _super.prototype.stop.call(this)) : void _super.prototype.stop.call(this);
            }, WebAudioPlayer.prototype.notifyMasterVolumeChanged = function() {
                this._gainNode.gain.value = this._calculateVolume();
            }, WebAudioPlayer.prototype._onAudioEnded = function() {
                this._clearEndedEventHandler(), _super.prototype.stop.call(this);
            }, WebAudioPlayer.prototype._clearEndedEventHandler = function() {
                this._sourceNode && (this._sourceNode.onended = null), null != this._dummyDurationWaitTimer && (clearTimeout(this._dummyDurationWaitTimer), 
                this._dummyDurationWaitTimer = null);
            }, WebAudioPlayer.prototype._calculateVolume = function() {
                return this._muted ? 0 : this.volume * this._system.volume * this._manager.getMasterVolume();
            }, WebAudioPlayer;
        }(g.AudioPlayer);
        exports.WebAudioPlayer = WebAudioPlayer;
    }, {
        "./WebAudioHelper": 45,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    47: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var WebAudioAsset_1 = require("./WebAudioAsset"), WebAudioPlayer_1 = require("./WebAudioPlayer"), autoPlayHelper = require("./WebAudioAutoplayHelper"), WebAudioPlugin = function() {
            function WebAudioPlugin() {
                this.supportedFormats = this._detectSupportedFormats(), autoPlayHelper.setupChromeMEIWorkaround();
            }
            return WebAudioPlugin.isSupported = function() {
                return "AudioContext" in window ? !0 : "webkitAudioContext" in window ? !0 : !1;
            }, Object.defineProperty(WebAudioPlugin.prototype, "supportedFormats", {
                get: function() {
                    return this._supportedFormats;
                },
                set: function(supportedFormats) {
                    this._supportedFormats = supportedFormats, WebAudioAsset_1.WebAudioAsset.supportedFormats = supportedFormats;
                },
                enumerable: !0,
                configurable: !0
            }), WebAudioPlugin.prototype.createAsset = function(id, assetPath, duration, system, loop, hint) {
                return new WebAudioAsset_1.WebAudioAsset(id, assetPath, duration, system, loop, hint);
            }, WebAudioPlugin.prototype.createPlayer = function(system, manager) {
                return new WebAudioPlayer_1.WebAudioPlayer(system, manager);
            }, WebAudioPlugin.prototype._detectSupportedFormats = function() {
                if (-1 !== navigator.userAgent.indexOf("Edge/")) return [ "aac" ];
                var audioElement = document.createElement("audio"), supportedFormats = [];
                try {
                    for (var supportedExtensions = [ "ogg", "aac", "mp4" ], i = 0, len = supportedExtensions.length; len > i; i++) {
                        var ext = supportedExtensions[i], canPlay = audioElement.canPlayType("audio/" + ext), supported = "no" !== canPlay && "" !== canPlay;
                        supported && supportedFormats.push(ext);
                    }
                } catch (e) {}
                return supportedFormats;
            }, WebAudioPlugin;
        }();
        exports.WebAudioPlugin = WebAudioPlugin;
    }, {
        "./WebAudioAsset": 43,
        "./WebAudioAutoplayHelper": 44,
        "./WebAudioPlayer": 46
    } ],
    48: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), XHRLoader = function() {
            function XHRLoader(options) {
                void 0 === options && (options = {}), this.timeout = options.timeout || 15e3;
            }
            return XHRLoader.prototype.get = function(url, callback) {
                this._getRequestObject({
                    url: url,
                    responseType: "text"
                }, callback);
            }, XHRLoader.prototype.getArrayBuffer = function(url, callback) {
                this._getRequestObject({
                    url: url,
                    responseType: "arraybuffer"
                }, callback);
            }, XHRLoader.prototype._getRequestObject = function(requestObject, callback) {
                var request = new XMLHttpRequest();
                request.open("GET", requestObject.url, !0), request.responseType = requestObject.responseType, 
                request.timeout = this.timeout, request.addEventListener("timeout", function() {
                    callback(g.ExceptionFactory.createAssetLoadError("loading timeout"));
                }, !1), request.addEventListener("load", function() {
                    if (request.status >= 200 && request.status < 300) {
                        var response = "text" === requestObject.responseType ? request.responseText : request.response;
                        callback(null, response);
                    } else callback(g.ExceptionFactory.createAssetLoadError("loading error. status: " + request.status));
                }, !1), request.addEventListener("error", function() {
                    callback(g.ExceptionFactory.createAssetLoadError("loading error. status: " + request.status));
                }, !1), request.send();
            }, XHRLoader;
        }();
        exports.XHRLoader = XHRLoader;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    49: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, {} ],
    "@akashic/pdi-browser": [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var Platform_1 = require("./Platform");
        exports.Platform = Platform_1.Platform;
        var ResourceFactory_1 = require("./ResourceFactory");
        exports.ResourceFactory = ResourceFactory_1.ResourceFactory;
        var g = require("@akashic/akashic-engine");
        exports.g = g;
        var AudioPluginRegistry_1 = require("./plugin/AudioPluginRegistry");
        exports.AudioPluginRegistry = AudioPluginRegistry_1.AudioPluginRegistry;
        var AudioPluginManager_1 = require("./plugin/AudioPluginManager");
        exports.AudioPluginManager = AudioPluginManager_1.AudioPluginManager;
        var HTMLAudioPlugin_1 = require("./plugin/HTMLAudioPlugin/HTMLAudioPlugin");
        exports.HTMLAudioPlugin = HTMLAudioPlugin_1.HTMLAudioPlugin;
        var WebAudioPlugin_1 = require("./plugin/WebAudioPlugin/WebAudioPlugin");
        exports.WebAudioPlugin = WebAudioPlugin_1.WebAudioPlugin;
        var PostMessageAudioPlugin_1 = require("./plugin/PostMessageAudioPlugin/PostMessageAudioPlugin");
        exports.PostMessageAudioPlugin = PostMessageAudioPlugin_1.PostMessageAudioPlugin;
    }, {
        "./Platform": 4,
        "./ResourceFactory": 6,
        "./plugin/AudioPluginManager": 33,
        "./plugin/AudioPluginRegistry": 34,
        "./plugin/HTMLAudioPlugin/HTMLAudioPlugin": 38,
        "./plugin/PostMessageAudioPlugin/PostMessageAudioPlugin": 41,
        "./plugin/WebAudioPlugin/WebAudioPlugin": 47,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ]
}, {}, []);