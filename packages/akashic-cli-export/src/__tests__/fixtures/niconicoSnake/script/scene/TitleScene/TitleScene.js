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
exports.TitleScene = exports.createTitleScene = void 0;

var SceneBase_1 = require("../SceneBase");

var TitleBehavior_1 = require("./TitleBehavior");

var joinSequence_1 = require("../../utils/joinSequence");

var BigButton_1 = require("../../entity/TitleScene/BigButton");

var RecruitmentCountDown_1 = require("../../entity/TitleScene/RecruitmentCountDown");

var WaitingText_1 = require("../../entity/TitleScene/WaitingText");

var HowtoText_1 = require("../../entity/TitleScene/HowtoText");

function createTitleScene(stateManager) {
  var assetIds = ["frame_howto", "btn_frame_join", "btn_frame_join_disable"];
  var titleScene = new TitleScene({
    game: g.game,
    stateManager: stateManager,
    assetIds: assetIds
  });
  return titleScene;
}

exports.createTitleScene = createTitleScene;

var TitleScene =
/** @class */
function (_super) {
  __extends(TitleScene, _super);

  function TitleScene(param) {
    var _this = _super.call(this, param) || this;

    _this.stateManager = param.stateManager;
    _this._isApplied = false;

    _this.onLoad.add(function () {
      _this.createRoot();

      _this.createBackground();

      _this.setBehavior(new TitleBehavior_1.TitleBehavior({
        scene: _this,
        stateManager: _this.stateManager
      }));

      _this.setMessageEventListener();

      _this.createHowtoText();

      _this.createStartButton();

      _this.createPreparationText();

      if (_this.stateManager.sessionParameter.config.debug) _this.createDebugButton();
    });

    return _this;
  }

  TitleScene.prototype.createRoot = function () {
    this.root = new g.E({
      scene: this
    });
    this.append(this.root);
  };

  TitleScene.prototype.createBackground = function () {
    var backgroundRect = new g.FilledRect({
      scene: this,
      width: g.game.width,
      height: g.game.height,
      cssColor: "rgba(0,6,43,0.70)" // 色指定はデザイン指示より

    });
    this.root.append(backgroundRect);
  };

  TitleScene.prototype.resetScene = function () {
    if (this.lotteryResultText) {
      this.lotteryResultText.destroy();
    }

    this.createStartButton();
    this.createPreparationText();
  };

  TitleScene.prototype.createHowtoText = function () {
    var howtoText = new HowtoText_1.HowtoText({
      scene: this,
      y: 48,
      text: this.stateManager.sessionParameter.howtoMessage
    });
    this.root.append(howtoText);
  };

  TitleScene.prototype.createStartButton = function () {
    var _this = this;

    if (!this.stateManager.isBroadcaster) return;
    this.startButton = new BigButton_1.BigButton({
      scene: this,
      text: "参加者受付を開始する",
      textColor: "white",
      font: this.stateManager.resource.font,
      x: g.game.width / 2,
      y: 482,
      anchorX: 0.5,
      anchorY: 0.0,
      touchable: true,
      local: true
    });
    this.startButton.onPointUp.add(function () {
      _this.startButton.destroy();

      joinSequence_1.startRecruitmentSequence();
    });
    this.root.append(this.startButton);
  };

  TitleScene.prototype.createPreparationText = function () {
    if (this.stateManager.isBroadcaster) return;
    this.preparationText = this._createBitTextLabel("放送者が準備中です");
  };

  TitleScene.prototype.createJoinButton = function () {
    var _this = this;

    if (this.stateManager.isBroadcaster) {
      if (this.startButton && !this.startButton.destroyed()) {
        this.startButton.destroy();
      }

      return;
    }

    this.preparationText.destroy();
    this.joinButton = new BigButton_1.BigButton({
      scene: this,
      text: "参加する",
      textColor: "white",
      font: this.stateManager.resource.font,
      x: g.game.width / 2,
      y: 440,
      anchorX: 0.5,
      anchorY: 0.0,
      touchable: true,
      local: true
    });
    this.joinButton.pointUp.addOnce(function (event) {
      _this.joinButton.toDisable("参加受付完了");

      _this._isApplied = true; // リロード時は実行されない

      joinSequence_1.joinRequestSequence(event.player);
    });
    this.root.append(this.joinButton);
  };

  TitleScene.prototype.createWaitingText = function () {
    this.waitingText = new WaitingText_1.WaitingText({
      scene: this,
      font: this.stateManager.resource.font,
      y: 510 // 手調整 (レイアウト指示+30)

    });
    this.root.append(this.waitingText);
  };

  TitleScene.prototype.createDebugButton = function () {
    var _this = this;

    var RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
    var join10Button = new g.Label({
      scene: this,
      font: this.stateManager.resource.font,
      text: "join10bot",
      fontSize: 30,
      textColor: "black",
      touchable: true,
      x: 10,
      y: 10
    });
    join10Button.onPointDown.add(function () {
      join10Button.opacity = 0.5;
      join10Button.textColor = "red";
      join10Button.invalidate();
    });
    join10Button.onPointUp.add(function () {
      join10Button.opacity = 1;
      join10Button.textColor = "black";
      join10Button.invalidate();
      if (!_this.stateManager.applicantList) return; // 参加者受付を開始していない

      for (var i = 0; i < 10; i++) {
        var name_1 = "";
        var nameLength = Math.floor(Math.random() * 15) + 1;

        for (var i_1 = 0; i_1 < nameLength; i_1++) {
          name_1 += RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
        }

        joinSequence_1.joinRequestSequence({
          id: Math.round(Math.random() * 1000).toString(),
          name: name_1
        });
      }
    });
    this.root.append(join10Button);
  };

  TitleScene.prototype.setRecruitmentTimer = function (startTime) {
    var _this = this;

    this.countDown = new RecruitmentCountDown_1.RecruitmentCountDown({
      scene: this,
      font: this.stateManager.resource.font,
      y: 594 // 手調整 (レイアウト指示+80)

    });
    var entrySec = this.stateManager.sessionParameter.entrySec;
    this.countDown.setTime(entrySec);
    this.root.append(this.countDown);

    var checkTimeUp = function checkTimeUp() {
      var fpsTime = g.game.age - startTime;

      _this.countDown.setTime(entrySec - fpsTime / g.game.fps);

      if (fpsTime > entrySec * g.game.fps) {
        _this.tallyUp();

        _this.update.remove(checkTimeUp);
      }
    };

    this.onUpdate.add(checkTimeUp);
  };

  TitleScene.prototype.tallyUp = function () {
    if (!this.stateManager.isBroadcaster) {
      this.joinButton.destroy();
    }

    this.countDown.destroy();
    this.createWaitingText();
  };

  TitleScene.prototype.showLotteryResult = function (numPlayers) {
    this.waitingText.destroy(); // 応募者がいない場合 (1人は放送者)

    if (numPlayers <= 1) {
      this.lotteryResultText = this._createBitTextLabel("参加者が集まりませんでした");
      return;
    } // 放送者の場合


    if (this.stateManager.isBroadcaster) {
      this.lotteryResultText = this._createBitTextLabel("参加者が決定しました");
      return;
    } // 当選者の場合


    if (g.game.selfId in this.stateManager.playerList) {
      this.lotteryResultText = this._createBitTextLabel("当選しました");
      return;
    } // 応募したが落選した場合
    // NOTE: タイトルで参加後リロードすると応募していない扱いになる


    if (this._isApplied) {
      this.lotteryResultText = this._createBitTextLabel("落選しました");
      return;
    } // 応募していない場合


    this.lotteryResultText = this._createBitTextLabel("参加者が決定しました");
  };

  TitleScene.prototype._createBitTextLabel = function (text, top) {
    if (top === void 0) {
      top = 510;
    }

    var label = new g.Label({
      scene: this,
      text: text,
      font: this.stateManager.resource.font,
      fontSize: 73,
      textColor: "white",
      textAlign: "center",
      x: g.game.width / 2,
      y: top,
      anchorX: 0.5,
      anchorY: 0,
      local: true
    });
    this.root.append(label);
    return label;
  };

  return TitleScene;
}(SceneBase_1.SceneBase);

exports.TitleScene = TitleScene;