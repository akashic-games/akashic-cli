"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RankingType = exports.ResultScene = exports.createResultScene = void 0;

var akashic_label_1 = require("@akashic-extension/akashic-label");

var akashic_timeline_1 = require("@akashic-extension/akashic-timeline");

var SceneBase_1 = require("../SceneBase");

var StateManager_1 = require("../../StateManager");

var ResultBehavior_1 = require("./ResultBehavior");

var utils_1 = require("../../commonUtils/utils");

var MessageEventType_1 = require("../../types/MessageEventType");

var assetIds_1 = require("../../assetIds");

var RankingLabel_1 = require("../../entity/ResultScene/RankingLabel");

function createResultScene(stateManager) {
  var assetIds = [];
  assetIds.push.apply(assetIds, assetIds_1.resultAssetIds);
  var resultScene = new ResultScene({
    game: g.game,
    stateManager: stateManager,
    assetIds: assetIds
  });
  return resultScene;
}

exports.createResultScene = createResultScene;

var ResultScene =
/** @class */
function (_super) {
  __extends(ResultScene, _super);

  function ResultScene(param) {
    var _this = _super.call(this, param) || this;

    _this.stateManager = param.stateManager;
    _this.timeline = new akashic_timeline_1.Timeline(_this);

    _this.onLoad.add(function () {
      _this.setBehavior(new ResultBehavior_1.ResultBehavior({
        scene: _this,
        stateManager: _this.stateManager
      }));

      _this.setMessageEventListener();

      if (g.game.isActiveInstance()) _this.stateManager.setupResultRanking();
    });

    return _this;
  }

  ResultScene.prototype.init = function (lengthRankingPlayerIdList, killRankingPlayerIdList, jewelOwnerId) {
    this._createFont();

    this._createRoot();

    this._playBGM();

    this._createBaseRanking();

    this._createLengthRanking(lengthRankingPlayerIdList);

    this._createKillRanking(killRankingPlayerIdList);

    this._createJewelOwnerLabel(jewelOwnerId);

    if (this.stateManager.isBroadcaster) {
      this._createNextButton();

      this._createBackButton();
    } else {
      this._createUnableButton();
    } // ログ出力


    if (g.game.isActiveInstance()) {
      try {
        this._sendResultLog(lengthRankingPlayerIdList, killRankingPlayerIdList, jewelOwnerId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  ResultScene.prototype.changeShownRankingType = function (nextRankingType) {
    switch (nextRankingType) {
      case RankingType.Length:
        this.lengthRankingLabel.setInitialPosition();
        this.lengthRankingLabel.scroll();
        this.killRanking.hide();
        this.lengthRanking.show();
        this.showRankingType = RankingType.Length;
        break;

      case RankingType.Kill:
        this.killRankingLabel.setInitialPosition();
        this.killRankingLabel.scroll();
        this.lengthRanking.hide();
        this.killRanking.show();
        this.showRankingType = RankingType.Kill;
        break;

      default: // do nothing

    }
  };

  ResultScene.prototype.changeScrollSpeed = function (rankingType, speedType) {
    switch (rankingType) {
      case RankingType.Length:
        this.lengthRankingLabel.scroll(speedType);
        break;

      case RankingType.Kill:
        this.killRankingLabel.scroll(speedType);
        break;

      default: // do nothing

    }
  };

  ResultScene.prototype._createFont = function () {
    var resultFontGlyph = JSON.parse(this.assets.result_glyph.data);
    this.resultNumFont = new g.BitmapFont({
      src: this.assets.result_num_b,
      map: resultFontGlyph,
      defaultGlyphWidth: 24,
      defaultGlyphHeight: 36
    });
    this.resultNumRedFont = new g.BitmapFont({
      src: this.assets.result_num_r,
      map: resultFontGlyph,
      defaultGlyphWidth: 24,
      defaultGlyphHeight: 36
    });
  };

  ResultScene.prototype._createRoot = function () {
    this.root = new g.E({
      scene: this
    });
    this.append(this.root);
  };

  ResultScene.prototype._playBGM = function () {
    var _this = this;

    this.stateManager.audioAssets[StateManager_1.AudioType.Intro] = this.assets.snake_result_intro;
    this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Intro);
    this.setTimeout(function () {
      _this.stateManager.audioAssets[StateManager_1.AudioType.ResultBGM] = _this.assets.snake_result;

      _this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.ResultBGM);
    }, this.stateManager.audioAssets[StateManager_1.AudioType.Intro].duration);
  };

  ResultScene.prototype._createBaseRanking = function () {
    var baseRankingAsset = this.assets.result_base_ranking;
    this.baseRanking = new g.Sprite({
      scene: this,
      src: baseRankingAsset,
      width: baseRankingAsset.width,
      height: baseRankingAsset.height,
      x: 151,
      y: 50
    });
    this.root.append(this.baseRanking);
  };

  ResultScene.prototype._createLengthRanking = function (lengthRankingPlayerIdList) {
    this.showRankingType = RankingType.Length;
    this.lengthRanking = new g.E({
      scene: this
    });
    this.root.append(this.lengthRanking);
    this.lengthRankingLabel = new RankingLabel_1.RankingLabel({
      scene: this,
      width: 978,
      height: 470 - 14,
      x: 151,
      y: 50,
      touchable: this.stateManager.isBroadcaster,
      resultNumFont: this.resultNumFont,
      resultNumRedFont: this.resultNumRedFont,
      rankingPlayerIdList: lengthRankingPlayerIdList
    });

    if (this.stateManager.isBroadcaster) {
      this.lengthRankingLabel.onPointDown.add(function () {
        var message = {
          messageType: MessageEventType_1.MessageEventType.changeScrollSpeed,
          messageData: {
            rankingType: RankingType.Length,
            speedType: RankingLabel_1.ScrollSpeedType.High
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      });
      this.lengthRankingLabel.onPointUp.add(function () {
        var message = {
          messageType: MessageEventType_1.MessageEventType.changeScrollSpeed,
          messageData: {
            rankingType: RankingType.Length,
            speedType: RankingLabel_1.ScrollSpeedType.Normal
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      });
    }

    this.lengthRanking.append(this.lengthRankingLabel);
    this.lengthRankingLabel.scroll();
    var lengthRankingTitleAsset = this.assets.result_title_length;
    var lengthRankingTitle = new g.Sprite({
      scene: this,
      src: lengthRankingTitleAsset,
      x: 220,
      y: 5
    });
    this.lengthRanking.append(lengthRankingTitle);
  };

  ResultScene.prototype._createKillRanking = function (killRankingPlayerIdList) {
    this.killRanking = new g.E({
      scene: this,
      hidden: true
    });
    this.root.append(this.killRanking);
    this.killRankingLabel = new RankingLabel_1.RankingLabel({
      scene: this,
      width: 978,
      height: 470 - 14,
      x: 151,
      y: 50,
      touchable: this.stateManager.isBroadcaster,
      resultNumFont: this.resultNumFont,
      resultNumRedFont: this.resultNumRedFont,
      rankingPlayerIdList: killRankingPlayerIdList
    });

    if (this.stateManager.isBroadcaster) {
      this.killRankingLabel.onPointDown.add(function () {
        var message = {
          messageType: MessageEventType_1.MessageEventType.changeScrollSpeed,
          messageData: {
            rankingType: RankingType.Kill,
            speedType: RankingLabel_1.ScrollSpeedType.High
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      });
      this.killRankingLabel.onPointUp.add(function () {
        var message = {
          messageType: MessageEventType_1.MessageEventType.changeScrollSpeed,
          messageData: {
            rankingType: RankingType.Kill,
            speedType: RankingLabel_1.ScrollSpeedType.Normal
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      });
    }

    this.killRanking.append(this.killRankingLabel);
    var killRankingTitleAsset = this.assets.result_title_kill;
    var killRankingTitle = new g.Sprite({
      scene: this,
      src: killRankingTitleAsset,
      x: 220,
      y: 5
    });
    this.killRanking.append(killRankingTitle);
  };

  ResultScene.prototype._createJewelOwnerLabel = function (ownerId) {
    var ownerBaseAsset = this.assets.result_base_treasure;
    var ownerBase = new g.Sprite({
      scene: this,
      src: ownerBaseAsset,
      x: 281,
      y: 530
    });
    this.root.append(ownerBase);
    var ownerLabelText = "";

    if (ownerId == null) {
      ownerLabelText += "お宝保持者はいませんでした";
    } else {
      ownerLabelText += utils_1.clampString(this.stateManager.playerList[ownerId].user.name, 14, "…");
    }

    var ownerLabel = new akashic_label_1.Label({
      scene: this,
      text: ownerLabelText,
      textColor: "white",
      font: this.stateManager.resource.font,
      fontSize: 34,
      width: ownerBaseAsset.width,
      x: 281,
      y: 612,
      textAlign: "center"
    });
    this.root.append(ownerLabel);
  };

  ResultScene.prototype._createNextButton = function () {
    var _this = this;

    var nextButtonOffAsset = this.assets.result_btn_next_off;
    var nextButtonOnAsset = this.assets.result_btn_next_on;
    var button = new g.Sprite({
      scene: this,
      src: nextButtonOffAsset,
      width: nextButtonOffAsset.width,
      height: nextButtonOffAsset.height,
      x: 1138,
      y: 552,
      touchable: true,
      local: true
    });
    button.onPointDown.add(function () {
      _this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Select);

      button._surface = g.SurfaceUtil.asSurface(nextButtonOnAsset);
      button.invalidate();
    });
    button.onPointUp.add(function () {
      button._surface = g.SurfaceUtil.asSurface(nextButtonOffAsset);
      button.invalidate();
      var nextRankingType;

      switch (_this.showRankingType) {
        case RankingType.Length:
          nextRankingType = RankingType.Kill;
          break;

        case RankingType.Kill:
          nextRankingType = RankingType.Length;
          break;

        default: // do nothing

      }

      var message = {
        messageType: MessageEventType_1.MessageEventType.nextRankingType,
        messageData: {
          nextRankingType: nextRankingType
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    });
    this.root.append(button);
  };

  ResultScene.prototype._createBackButton = function () {
    var _this = this;

    var backButtonOffAsset = this.assets.result_btn_back_off;
    var backButtonOnAsset = this.assets.result_btn_back_on;
    var button = new g.Sprite({
      scene: this,
      src: backButtonOffAsset,
      width: backButtonOffAsset.width,
      height: backButtonOffAsset.height,
      x: 1013,
      y: 552,
      touchable: true,
      local: true
    });
    button.onPointDown.add(function () {
      _this.stateManager.playAudioAtParamVolume(StateManager_1.AudioType.Select);

      button._surface = g.SurfaceUtil.asSurface(backButtonOnAsset);
      button.invalidate();
    });
    button.onPointUp.add(function () {
      button._surface = g.SurfaceUtil.asSurface(backButtonOffAsset);
      button.invalidate();
      var nextRankingType;

      switch (_this.showRankingType) {
        case RankingType.Length:
          nextRankingType = RankingType.Kill;
          break;

        case RankingType.Kill:
          nextRankingType = RankingType.Length;
          break;

        default: // do nothing

      }

      var message = {
        messageType: MessageEventType_1.MessageEventType.nextRankingType,
        messageData: {
          nextRankingType: nextRankingType
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    });
    this.root.append(button);
  };

  ResultScene.prototype._createUnableButton = function () {
    var backButtonAsset = this.assets.result_btn_back_off_unable;
    var nextButtonAsset = this.assets.result_btn_next_off_unable;
    var backButton = new g.Sprite({
      scene: this,
      src: backButtonAsset,
      width: backButtonAsset.width,
      height: backButtonAsset.height,
      x: 1013,
      y: 552,
      local: true
    });
    this.root.append(backButton);
    var nextButton = new g.Sprite({
      scene: this,
      src: nextButtonAsset,
      width: nextButtonAsset.width,
      height: nextButtonAsset.height,
      x: 1138,
      y: 552,
      local: true
    });
    this.root.append(nextButton);
  };

  ResultScene.prototype._sendResultLog = function (lengthRankingPlayerIdList, killRankingPlayerIdList, jewelOwnerId) {
    var _this = this;

    var logData = [];
    lengthRankingPlayerIdList.forEach(function (data, rank) {
      var userId = data.playerId;
      var killRankingIndex = killRankingPlayerIdList.findIndex(function (_a) {
        var playerId = _a.playerId;
        return playerId === userId;
      });
      logData.push({
        rank: rank + 1,
        userId: userId,
        score: data.count,
        params: {
          userId: userId,
          userName: _this.stateManager.playerList[userId].user.name,
          isPremium: _this.stateManager.playerList[userId].user.isPremium,
          lengthCount: data.count,
          lengthRank: rank + 1,
          words: _this.stateManager.playerList[userId].lastWords,
          killCount: killRankingPlayerIdList[killRankingIndex].count,
          killRank: killRankingIndex + 1,
          haveJewel: jewelOwnerId != null && userId === jewelOwnerId
        }
      });
    });

    if (g.game.external && g.game.external.send) {
      g.game.external.send({
        type: "multi:result",
        sessionId: g.game.playId,
        data: logData
      });
    }
  };

  return ResultScene;
}(SceneBase_1.SceneBase);

exports.ResultScene = ResultScene;
var RankingType;

(function (RankingType) {
  RankingType["Length"] = "Length";
  RankingType["Kill"] = "Kill";
})(RankingType = exports.RankingType || (exports.RankingType = {}));