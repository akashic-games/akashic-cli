"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioType = exports.PlayerInfo = exports.PlayerState = exports.StateManager = void 0;

var TitleScene_1 = require("./scene/TitleScene/TitleScene");

var MainGameScene_1 = require("./scene/MainGameScene/MainGameScene");

var MessageEventType_1 = require("./types/MessageEventType");

var UserTouchState_1 = require("./types/UserTouchState");

var Snake_1 = require("./entity/Snake");

var defaultParameter_1 = require("./config/defaultParameter");

var ResultScene_1 = require("./scene/ResultScene/ResultScene");

var audioUtils_1 = require("./utils/audioUtils");

var StateRoleChecker_1 = require("./utils/StateRoleChecker");

var utils_1 = require("./commonUtils/utils");

var lottery_1 = require("./commonUtils/lottery");
/**
 * ゲーム全体の状態を管理するクラス
 */


var StateManager =
/** @class */
function () {
  function StateManager(param) {
    this.sessionParameter = param.sessionParameter;
    this.broadcaster = param.broadcaster;
    this.isBroadcaster = param.broadcaster.id === g.game.selfId;
    this.audioAssets = {};
    this.userNameLabels = {};
    this.topPlayerList = [];
    this.foodList = [];
    this.waitingFoodList = [];
    this.maxFoodListLength = 25;
    this.isGameOver = false;
    this.createResource();
  }

  StateManager.prototype.createResource = function () {
    var foodCharsAsset = g.game.assets.foodAvailableChars;
    var foodString = JSON.parse(foodCharsAsset.data).foodAvailableChars.join("");
    var font = new g.DynamicFont({
      game: g.game,
      fontFamily: g.FontFamily.SansSerif,
      size: 72,
      fontWeight: g.FontWeight.Bold,
      hint: {
        presetChars: foodString
      }
    });
    this.resource = {
      font: font
    };
  };

  StateManager.prototype.changeTitleScene = function () {
    var scene = TitleScene_1.createTitleScene(this);
    g.game.pushScene(scene);
  };

  StateManager.prototype.changeMainGameScene = function () {
    var scene = MainGameScene_1.createMainGameScene(this);
    g.game.pushScene(scene);
  };

  StateManager.prototype.changeResultScene = function () {
    var scene = ResultScene_1.createResultScene(this);
    g.game.pushScene(scene);
  };

  StateManager.prototype.setPlayerList = function (playerList) {
    var _this = this;

    this.playerList = {};
    Object.keys(playerList).forEach(function (playerId) {
      _this.playerList[playerId] = new PlayerInfo({
        player: playerList[playerId].player,
        user: playerList[playerId].user,
        isBroadcaster: playerId === _this.broadcaster.id,
        snakeType: playerList[playerId].snakeType
      });
    });
  };
  /**
   * サーバインスタンスのみ実行
   * ゲーム参加者の募集を開始する
   */


  StateManager.prototype.startRecruitment = function (broadcasterData) {
    this.broadcasterData = broadcasterData;
    this.applicantList = [];
    this.startTime = g.game.age;
    var message = {
      messageType: MessageEventType_1.MessageEventType.waitRecruitment,
      messageData: {
        startTime: this.startTime
      }
    };
    g.game.raiseEvent(new g.MessageEvent(message));
  };
  /**
   * サーバインスタンスのみ実行
   * 参加プレイヤーリクエストを受け付ける
   * リクエストに対する挙動は抽選の有無などによる
   */


  StateManager.prototype.receiveJoinRequest = function (player, user) {
    if (g.game.age - this.startTime > this.sessionParameter.entrySec * g.game.fps) return;

    if (this.applicantList.some(function (p) {
      return p.player.id === player.id;
    })) {
      return;
    }

    this.applicantList.push({
      player: player,
      user: user
    });
  };
  /**
   * サーバインスタンスのみ実行
   * 抽選を開始する。
   */


  StateManager.prototype.startLottery = function () {
    var _this = this;

    var seed = +this.broadcaster.id;
    this.applicantList.forEach(function (applicant, i) {
      seed += +applicant.player.id + i;
    });
    if (!!this.sessionParameter.config.debug && this.sessionParameter.config.debug.skipLottery) seed = 2525;
    this.randomGenerator = new g.XorshiftRandomGenerator(seed); // サーバインスタンスだけg.game.randomの状態が変わってしまうのを避ける

    var winners = lottery_1.weightedLottery(this.applicantList, Math.min(this.applicantList.length, this.sessionParameter.numPlayers), this.sessionParameter.premiumWeight, this.randomGenerator, function (userData) {
      return userData.user.isPremium;
    });
    var playerList = {};
    playerList[this.broadcaster.id] = new PlayerInfo({
      player: this.broadcaster,
      user: this.broadcasterData,
      isBroadcaster: true,
      snakeType: "ABCDEFGHI".charAt(Math.floor(this.randomGenerator.generate() * 9))
    });
    winners.forEach(function (winner) {
      playerList[winner.player.id] = new PlayerInfo({
        player: winner.player,
        user: winner.user,
        isBroadcaster: false,
        snakeType: "ABCDEFGHI".charAt(Math.floor(_this.randomGenerator.generate() * 9))
      });
    });

    this._currentSetTimeout(function () {
      // 「集計中...」表示のためのバッファ
      var numPlayers = Object.keys(playerList).length;
      var message = {
        messageType: MessageEventType_1.MessageEventType.lotteryResult,
        messageData: {
          playerList: playerList,
          numPlayers: numPlayers
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));

      if (numPlayers > 1) {
        _this.startGame();
      } else {
        _this.restartRequruitment();
      }
    }, 3000);
  };
  /**
   * ゲームを開始する
   */


  StateManager.prototype.startGame = function () {
    this._currentSetTimeout(function () {
      //　抽選結果表示のためのバッファ
      g.game.raiseEvent(new g.MessageEvent({
        messageType: MessageEventType_1.MessageEventType.startGame
      }));
    }, 3000);
  };
  /**
   * 参加者が集まらなかったので抽選をやり直す
   */


  StateManager.prototype.restartRequruitment = function () {
    this._currentSetTimeout(function () {
      g.game.raiseEvent(new g.MessageEvent({
        messageType: MessageEventType_1.MessageEventType.restartRecruitment
      }));
    }, 3000);
  };
  /**
   * サーバインスタンスのみ実行
   * プレイヤーの初期位置を生成する
   */


  StateManager.prototype.setupInitLayout = function () {
    var playerInitLayoutList = this._generateInitLayout();

    var message = {
      messageType: MessageEventType_1.MessageEventType.initMainGame,
      messageData: {
        playerInitLayoutList: playerInitLayoutList
      }
    };
    g.game.raiseEvent(new g.MessageEvent(message));
    this.endInvincibleTime(MessageEventType_1.ScopeType.All);
  };
  /**
   * 全てのインスタンスで実行
   * 各プレイヤーインスタンスのカメラとSnakeを設定する
   */


  StateManager.prototype.setCameraAndSnake = function (playerId, snake) {
    this.playerList[playerId].snake = snake;
    this.playerList[playerId].camera = new g.Camera2D({});
    if (playerId === g.game.selfId) g.game.focusingCamera = this.playerList[playerId].camera; // 最初は無敵状態なので透過させる

    this.playerList[playerId].snake.modifyOpacity(0.5);
  };
  /**
   * 全てのインスタンスで実行
   * 受け取ったプレイヤー操作を状態に反映する
   */


  StateManager.prototype.applyTouchState = function (playerId, state, direction) {
    if (!this.playerList[playerId]) return;
    this.playerList[playerId].uiState.state = state;
    if (direction != null) this.playerList[playerId].uiState.direction = direction;

    if (!!this.playerList[playerId].snake && state === UserTouchState_1.UserTouchState.onPoint && direction != null) {
      var snake = this.playerList[playerId].snake;
      var radianFineness = this.sessionParameter.config.userInput.radianFineness;
      var deg = (this.playerList[playerId].uiState.direction / radianFineness * 360 + 90) % 360;
      snake.head.angle = deg;

      if (this.playerList[playerId].snake.rotateState !== Snake_1.SnakeRotateState.noRotate) {
        var rad = deg / 180 * Math.PI;
        var check = snake.head.x * -Math.cos(rad) - snake.head.y * Math.sin(rad);
        if (check > 0) snake.rotateState = Snake_1.SnakeRotateState.onClockwise;else snake.rotateState = Snake_1.SnakeRotateState.onCounterClockwise;
      }
    }

    if (!!this.playerList[playerId].snake) this.playerList[playerId].snake.dashing(state);
  };
  /**
   * サーバインスタンスのみ実行
   * 無敵状態解除シーケンスを開始する
   */


  StateManager.prototype.endInvincibleTime = function (scope, playerId) {
    var animationMessageData;
    var setPlayingMessageData;

    switch (scope) {
      case MessageEventType_1.ScopeType.All:
        animationMessageData = {
          animationType: MessageEventType_1.AnimationType.Blinking,
          scope: MessageEventType_1.ScopeType.All
        };
        setPlayingMessageData = {
          scope: MessageEventType_1.ScopeType.All
        };
        break;

      case MessageEventType_1.ScopeType.One:
        animationMessageData = {
          animationType: MessageEventType_1.AnimationType.Blinking,
          scope: MessageEventType_1.ScopeType.One,
          playerId: playerId
        };
        setPlayingMessageData = {
          scope: MessageEventType_1.ScopeType.One,
          playerId: playerId
        };
        break;

      default: // do nothing

    } // 点滅アニメーション


    this._currentSetTimeout(function () {
      var message = {
        messageType: MessageEventType_1.MessageEventType.animation,
        messageData: animationMessageData
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }, this.sessionParameter.config.snake.invincibleTime * 0.75);

    if (scope === MessageEventType_1.ScopeType.All) this.setCountDown(); // 無敵状態解除通知

    this._currentSetTimeout(function () {
      var message = {
        messageType: MessageEventType_1.MessageEventType.setPlaying,
        messageData: setPlayingMessageData
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }, this.sessionParameter.config.snake.invincibleTime);
  };
  /**
   * サーバーインスタンスのみ実行
   * カウントダウン表示を行う
   */


  StateManager.prototype.setCountDown = function () {
    var _loop_1 = function _loop_1(count) {
      var countDownType;

      switch (count) {
        case 4:
          countDownType = MessageEventType_1.CountDownType.Three;
          break;

        case 3:
          countDownType = MessageEventType_1.CountDownType.Two;
          break;

        case 2:
          countDownType = MessageEventType_1.CountDownType.One;
          break;

        case 1:
          countDownType = MessageEventType_1.CountDownType.Start;
          break;

        default: // do nothing

      }

      this_1._currentSetTimeout(function () {
        var message = {
          messageType: MessageEventType_1.MessageEventType.countDown,
          messageData: {
            countDownType: countDownType
          }
        };
        g.game.raiseEvent(new g.MessageEvent(message));
      }, this_1.sessionParameter.config.snake.invincibleTime - count * 1000);
    };

    var this_1 = this;

    for (var count = 4; count > 0; --count) {
      _loop_1(count);
    }
  };
  /**
   * 全てのインスタンスで実行
   * 各スネークの無敵状態を解除し、ゲームを開始する
   */


  StateManager.prototype.applyPlayingStateForAllSnakes = function () {
    var _this = this;

    Object.keys(this.playerList).forEach(function (playerId) {
      if (!_this.playerList[playerId].snake) return;

      _this.setPlayerState(playerId, PlayerState.playing);

      _this.playerList[playerId].snake.removeTween(MessageEventType_1.AnimationType.Blinking);

      _this.playerList[playerId].snake.modifyOpacity(1.0);
    });
  };
  /**
   * 全てのインスタンスで実行
   * 特定のスネークの無敵状態を解除し、リスポーンする
   */


  StateManager.prototype.applyPlayingStateForOneSnake = function (playerId) {
    if (!this.playerList[playerId].snake) return;
    this.setPlayerState(playerId, PlayerState.playing);
    this.playerList[playerId].snake.removeTween(MessageEventType_1.AnimationType.Blinking);
    this.playerList[playerId].snake.modifyOpacity(1.0);
  };
  /**
   * 指定PlayerのPlayerStateをセットする
   */


  StateManager.prototype.setPlayerState = function (playerId, state) {
    this.playerList[playerId].state = state;
  };
  /**
   * 全てのインスタンスで実行
   * 全スネークのアニメーション処理
   */


  StateManager.prototype.animateAllSnakes = function (animationType) {
    var _this = this;

    Object.keys(this.playerList).forEach(function (playerId) {
      if (!_this.playerList[playerId].snake) return;
      var snake = _this.playerList[playerId].snake;

      switch (animationType) {
        case MessageEventType_1.AnimationType.Blinking:
          snake.blinking();
          break;

        default: // do nothing

      }
    });
  };
  /**
   * 全てのインスタンスで実行
   * 特定のスネークのアニメーション処理
   */


  StateManager.prototype.animateOneSnake = function (animationType, playerId) {
    if (!this.playerList[playerId].snake) return;
    var snake = this.playerList[playerId].snake;

    switch (animationType) {
      case MessageEventType_1.AnimationType.Blinking:
        snake.blinking();
        break;

      case MessageEventType_1.AnimationType.ToBroadcasterView:
        snake.modifyOpacity(0.0);

        if (playerId === g.game.selfId) {
          snake.parent.scene.showBroadcasterDisplayViewing();
        }

        break;

      default: // do nothing

    }
  };
  /**
   * 参加プレイヤーの初期配置を生成する
   */


  StateManager.prototype._generateInitLayout = function () {
    var _this = this;

    var playerList = {};
    var playerCountRank = this.dividePlayerCountIntoTiers();
    var fieldRadius = this.sessionParameter.config.field.radius[playerCountRank] - 50;
    var lengthOfSquareInField = Math.floor(fieldRadius / Math.sqrt(2)) * 2;
    Object.keys(this.playerList).forEach(function (playerId) {
      playerList[playerId] = {
        direction: _this.randomGenerator.get(0, _this.sessionParameter.config.userInput.radianFineness - 1),
        state: UserTouchState_1.UserTouchState.noPoint,
        position: {
          x: _this.randomGenerator.generate() * lengthOfSquareInField - lengthOfSquareInField / 2,
          y: _this.randomGenerator.generate() * lengthOfSquareInField - lengthOfSquareInField / 2
        },
        name: _this.playerList[playerId].user.name
      };
    });
    return playerList;
  };
  /**
   * サーバーインスタンスのみ実行
   * スネークの衝突判定をチェックする
   */


  StateManager.prototype.checkSnakeCollision = function () {
    var _this = this;

    if (this.isGameOver) return;
    var playersInConflict = [];
    Object.keys(this.playerList).forEach(function (playerId) {
      Object.keys(_this.playerList).forEach(function (enemyId) {
        var playerState = _this.playerList[playerId].state;
        var enemyState = _this.playerList[enemyId].state;

        if (enemyId !== playerId && StateRoleChecker_1.checkStateRole(playerState, StateRoleChecker_1.StateRoleType.CanCollideType) && StateRoleChecker_1.checkStateRole(enemyState, StateRoleChecker_1.StateRoleType.CanCollideType)) {
          if (_this._isSnakeSegmentCollision(playerId, enemyId)) {
            // 衝突後の処理
            playersInConflict.push({
              deadPlayerId: playerId,
              killerPlayerId: enemyId
            });
          }
        }
      });
    });

    if (playersInConflict.length) {
      var message = {
        messageType: MessageEventType_1.MessageEventType.sendPlayersInConflict,
        messageData: {
          playersInConflict: playersInConflict
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };

  StateManager.prototype._isSnakeSegmentCollision = function (playerId, enemyId) {
    var collided = false;
    var playerSnake = this.playerList[playerId].snake;
    var enemySnake = this.playerList[enemyId].snake;
    if (!playerSnake || !enemySnake) return false;
    var playerHeadArea = commonAreaFromSprite(playerSnake.head.body);
    /** スネークの頭同士の判定 */

    var enemyHeadArea = commonAreaFromSprite(enemySnake.head.body);
    collided = collided || g.Collision.withinAreas(playerHeadArea, enemyHeadArea, playerSnake.head.body.width / 2);
    /** あるスネークと敵スネーク節の当たり判定 */

    enemySnake.segments.forEach(function (seg) {
      if (seg.type === Snake_1.SnakeSegmentType.Jewel) return;
      var enemyBodyArea = commonAreaFromSprite(seg.body);
      collided = collided || g.Collision.withinAreas(playerHeadArea, enemyBodyArea, (seg.body.width + playerSnake.head.body.width) / 2);
    });
    return collided;
  };
  /**
   * サーバーインスタンスのみ実行
   * 食べられたエサをチェックする
   */


  StateManager.prototype.checkEatenFoods = function (fieldRadius) {
    var _this = this;

    if (this.isGameOver) return;
    var noEatenFoodIndexList = [];
    var eatenFoodInfo = [];
    this.foodList.forEach(function (shownFood, foodIndex) {
      var isEaten = false;
      Object.keys(_this.playerList).forEach(function (playerId) {
        if (isEaten) return;
        var playerSnake = _this.playerList[playerId].snake;
        if (!shownFood || !playerSnake || !StateRoleChecker_1.checkStateRole(_this.playerList[playerId].state, StateRoleChecker_1.StateRoleType.CanDropType)) return;
        var foodArea = {
          width: shownFood.food.width,
          height: shownFood.food.height,
          x: shownFood.food.x - shownFood.food.width / 2,
          y: shownFood.food.y - shownFood.food.height / 2
        };
        var playerHeadArea = commonAreaFromSprite(playerSnake.head.body);

        if (!isEaten && g.Collision.withinAreas(foodArea, playerHeadArea, (foodArea.width + playerSnake.head.body.width) / 2)) {
          isEaten = true;
          eatenFoodInfo.push({
            eaterId: playerId,
            eatenIndex: foodIndex
          });
          return;
        }
      });
      if (!isEaten) noEatenFoodIndexList.push(foodIndex);
    });

    if (this.waitingFoodList.length !== 0 || eatenFoodInfo.length !== 0) {
      var message = {
        messageType: MessageEventType_1.MessageEventType.eatenFoods,
        messageData: {
          eatenFoodInfo: eatenFoodInfo,
          noEatenFoodIndexList: noEatenFoodIndexList,
          fieldRadius: fieldRadius
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };
  /**
   * サーバーインスタンスでのみ実行
   * ランキング情報を更新する
   */


  StateManager.prototype.updateRanking = function () {
    var _this = this;

    var rankingList = [];
    Object.keys(this.playerList).forEach(function (playerId) {
      var playerState = _this.playerList[playerId].state;
      if (!_this.playerList[playerId].snake || playerState !== PlayerState.playing) return;
      rankingList.push(_this.playerList[playerId]);
    });
    rankingList.sort(function (left, right) {
      return left.snake.words.length > right.snake.words.length ? -1 : 1;
    });
    var isSame = rankingList.length === this.topPlayerList.length;
    this.topPlayerList.forEach(function (player, i) {
      if (!isSame || !player) return;
      if (player.player.id !== rankingList[i].player.id) isSame = false;
    }); // 変更があった場合のみ通知する

    if (!isSame || this.topPlayerList.length === 0) {
      this.topPlayerList = rankingList;
      var topPlayerAccountDataList_1 = [];
      this.topPlayerList.forEach(function (player) {
        var playerState = _this.playerList[player.player.id].state;
        if (!_this.playerList[player.player.id].snake || playerState !== PlayerState.playing) return;
        topPlayerAccountDataList_1.push({
          id: player.player.id,
          name: player.user.name,
          isPremium: player.user.isPremium
        });
      });
      var message = {
        messageType: MessageEventType_1.MessageEventType.rankingAccountData,
        messageData: {
          rankingAccountData: topPlayerAccountDataList_1
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };
  /**
   * 全てのインスタンスで実行
   * 食べられたエサの情報を反映する
   */


  StateManager.prototype.applyEatenFoods = function (eatenFoodInfo, noEatenFoodIndexList, fieldRadius) {
    var _this = this;

    eatenFoodInfo.forEach(function (info) {
      if (!_this.foodList[info.eatenIndex].root.destroyed()) _this.foodList[info.eatenIndex].destroy();
      if (!_this.playerList[info.eaterId].snake) return;

      _this.playerList[info.eaterId].snake.eatFood(_this.foodList[info.eatenIndex]);
    });
    var newFoodList = [];
    noEatenFoodIndexList.forEach(function (noEatenIndex) {
      var food = _this.foodList[noEatenIndex].food;

      if (Math.pow(food.x, 2) + Math.pow(food.y, 2) <= Math.pow(fieldRadius + 100, 2)) {
        newFoodList.push(_this.foodList[noEatenIndex]);
      } else {
        if (!_this.foodList[noEatenIndex].root.destroyed()) _this.foodList[noEatenIndex].destroy();
      }
    });
    this.waitingFoodList.forEach(function (food) {
      return newFoodList.push(food);
    });
    this.waitingFoodList = [];
    this.foodList = newFoodList;
  };
  /**
   * サーバーインスタンスのみ実行
   * 食べられたお宝をチェックする
   */


  StateManager.prototype.checkEatenJewel = function () {
    var _this = this;

    if (this.isGameOver) return;
    var nowOwnerId = this.jewelData.ownerId;
    var jewelArea;

    if (nowOwnerId != null) {
      // お宝所有者がいる場合
      if (!StateRoleChecker_1.checkStateRole(this.playerList[nowOwnerId].state, StateRoleChecker_1.StateRoleType.CanDropType)) return;
      var segments = this.playerList[nowOwnerId].snake.segments;
      var jewel = segments[segments.length - 1];
      if (!jewel || jewel.type !== Snake_1.SnakeSegmentType.Jewel) return;
      jewelArea = {
        width: jewel.body.width,
        height: jewel.body.height,
        x: jewel.x + jewel.body.x,
        y: jewel.y + jewel.body.y
      };
    } else {
      jewelArea = {
        width: this.jewelData.jewel.jewel.width,
        height: this.jewelData.jewel.jewel.height,
        x: this.jewelData.jewel.jewel.x - this.jewelData.jewel.jewel.width / 2,
        y: this.jewelData.jewel.jewel.y - this.jewelData.jewel.jewel.height / 2
      };
    }

    Object.keys(this.playerList).forEach(function (playerId) {
      var playerSnake = _this.playerList[playerId].snake;
      if (!playerSnake || playerId === nowOwnerId || !StateRoleChecker_1.checkStateRole(_this.playerList[playerId].state, StateRoleChecker_1.StateRoleType.CanDropType)) return;
      var playerHeadArea = commonAreaFromSprite(playerSnake.head.body);

      if (g.Collision.withinAreas(jewelArea, playerHeadArea, (jewelArea.width + playerHeadArea.height) / 2)) {
        // お宝をゲットした最初の一人をオーナーとする
        nowOwnerId = playerId;
        return;
      }
    });

    if (nowOwnerId !== this.jewelData.ownerId) {
      var message = {
        messageType: MessageEventType_1.MessageEventType.updateJewelOwner,
        messageData: {
          ownerId: nowOwnerId
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };
  /**
   * サーバーインスタンスでのみ実行
   * フィールド上のお宝がフィールド外に存在するか判定する
   */


  StateManager.prototype.checkJewelOutsideField = function (fieldRadius) {
    if (this.jewelData.ownerId != null) return;
    var jewel = this.jewelData.jewel.jewel;

    if (Math.pow(jewel.x, 2) + Math.pow(jewel.y, 2) > Math.pow(fieldRadius, 2)) {
      var playerCountRank = this.dividePlayerCountIntoTiers();
      var fieldRadius_1 = this.sessionParameter.config.field.radius[playerCountRank] - 50;
      var lengthOfSquareInField = Math.floor(fieldRadius_1 / Math.sqrt(2)) * 2;
      var message = {
        messageType: MessageEventType_1.MessageEventType.respawnJewel,
        messageData: {
          position: {
            x: this.randomGenerator.generate() * lengthOfSquareInField - lengthOfSquareInField / 2,
            y: this.randomGenerator.generate() * lengthOfSquareInField - lengthOfSquareInField / 2
          }
        }
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }
  };
  /**
   * 全インスタンスで実行
   * お宝をリスポーンさせる
   */


  StateManager.prototype.setRespawnJewel = function (position) {
    if (this.jewelData.ownerId != null) return;
    this.jewelData.jewel.respawn(position);
  };
  /**
   * 全てのインスタンスで実行
   * お宝の更新情報を反映する
   */


  StateManager.prototype.applyEatenJewel = function (ownerId) {
    if (!this.playerList[ownerId].snake) return;
    var stolenPlayerId = this.jewelData.ownerId; // お宝を盗まれたプレイヤーのid

    if (stolenPlayerId != null) this.playerList[stolenPlayerId].snake.removeJewel();
    this.playerList[ownerId].snake.eatJewel();

    if (stolenPlayerId == null && !this.jewelData.jewel.root.destroyed()) {
      this.jewelData.jewel.destroy();
    }

    this.jewelData.ownerId = ownerId;
  };
  /**
   * 全てのインスタンスで実行
   * リスポーンしたSnakeを設定する
   */


  StateManager.prototype.setRespawnSnake = function (playerId, snakeLayer, nowRadius) {
    --this.playerList[playerId].respawnTimes;

    var _a = this._generateNewSnakeLayout(playerId, snakeLayer, true, nowRadius),
        snake = _a[0],
        direction = _a[1];

    this.playerList[playerId].snake = snake;
    this.playerList[playerId].uiState = {
      direction: direction,
      state: UserTouchState_1.UserTouchState.noPoint
    };
    this.setPlayerState(playerId, PlayerState.invincible);
    this.playerList[playerId].snake.modifyOpacity(0.5);
    this.userNameLabels[playerId].show();
  };
  /**
   * 全てのインスタンスで実行
   * 放送者の天使スネークを設定する
   */


  StateManager.prototype.setBroadcasterAngelSnake = function (snakeLayer, nowRadius) {
    var _a = this._generateNewSnakeLayout(this.broadcaster.id, snakeLayer, false, nowRadius),
        snake = _a[0],
        direction = _a[1];

    this.playerList[this.broadcaster.id].snake = snake;
    this.playerList[this.broadcaster.id].uiState = {
      direction: direction,
      state: UserTouchState_1.UserTouchState.noPoint
    };
    this.setPlayerState(this.broadcaster.id, PlayerState.ghost);
    this.userNameLabels[this.broadcaster.id].show();
  };
  /**
   * 全てのインスタンスで実行
   * PreventTypeを適用する
   */


  StateManager.prototype.applyPreventUserTouch = function (playerId, preventType) {
    this.playerList[playerId].preventType = preventType;
  };
  /**
   * サーバーインスタンスでのみ実行
   * フィールド上のスネークをカウントし、ゲームを終了するか判定する
   */


  StateManager.prototype.checkGameEnd = function () {
    var _this = this;

    if (this.isGameOver || !!this.sessionParameter.config.debug && (this.sessionParameter.config.debug.skipLottery || this.sessionParameter.config.debug.banEndingGameByNumberOfPlayers)) return;
    var playingSnakes = Object.keys(this.playerList).filter(function (playerId) {
      return StateRoleChecker_1.checkStateRole(_this.playerList[playerId].state, StateRoleChecker_1.StateRoleType.CanCountType);
    });
    playingSnakes.forEach(function (playerId) {
      _this.playerList[playerId].lengthCount = _this.playerList[playerId].snake.words.length;
    });

    if (playingSnakes.length <= 1) {
      this.gameEndProcedure();
    }
  };
  /**
   * サーバーインスタンスでのみ実行
   * ゲームを終了手続きを行う
   */


  StateManager.prototype.gameEndProcedure = function () {
    if (this.isGameOver) return;
    var message = {
      messageType: MessageEventType_1.MessageEventType.finishGame
    };
    g.game.raiseEvent(new g.MessageEvent(message));

    this._currentSetTimeout(function () {
      var message = {
        messageType: MessageEventType_1.MessageEventType.startResult
      };
      g.game.raiseEvent(new g.MessageEvent(message));
    }, 5000);
  };
  /**
   * オーディオをセッションパラメータで指定されたボリュームで再生する
   */


  StateManager.prototype.playAudioAtParamVolume = function (audioType) {
    var audioPlayer = this.audioAssets[audioType].play();
    audioUtils_1.changeAudioMasterVolume(audioPlayer, this.sessionParameter.config);
  };
  /**
   * サーバインスタンスのみ実行
   * リザルト画面で表示するランキングの準備をする
   */


  StateManager.prototype.setupResultRanking = function () {
    var _this = this;

    var rankingList = [];
    Object.keys(this.playerList).forEach(function (playerId) {
      rankingList.push(_this.playerList[playerId]);
    });
    var lengthRankingList = rankingList.slice();
    var killRankingList = rankingList.slice();
    lengthRankingList.sort(function (left, right) {
      return left.lengthCount > right.lengthCount ? -1 : 1;
    });
    killRankingList.sort(function (left, right) {
      return left.killCount > right.killCount ? -1 : 1;
    }); // そのままRankingListを送れないので、最低限のデータだけ送る

    var lengthRankingPlayerIdList = [];
    var killRankingPlayerIdList = [];
    lengthRankingList.forEach(function (p) {
      return lengthRankingPlayerIdList.push({
        playerId: p.player.id,
        count: _this.playerList[p.player.id].lengthCount
      });
    });
    killRankingList.forEach(function (p) {
      return killRankingPlayerIdList.push({
        playerId: p.player.id,
        count: _this.playerList[p.player.id].killCount
      });
    });
    var message = {
      messageType: MessageEventType_1.MessageEventType.initResult,
      messageData: {
        lengthRankingPlayerIdList: lengthRankingPlayerIdList,
        killRankingPlayerIdList: killRankingPlayerIdList,
        jewelOwnerId: this.jewelData.ownerId
      }
    };
    g.game.raiseEvent(new g.MessageEvent(message));
  };
  /**
   * プレイヤー人数をランク分けする
   */


  StateManager.prototype.dividePlayerCountIntoTiers = function () {
    var _this = this;

    var playerCount = 0;
    Object.keys(this.playerList).forEach(function (playerId) {
      var playerState = _this.playerList[playerId].state;
      if (StateRoleChecker_1.checkStateRole(playerState, StateRoleChecker_1.StateRoleType.CanCountType)) ++playerCount;
    });

    if (playerCount <= 10) {
      return 4;
    } else if (playerCount <= 30) {
      return 3;
    } else if (playerCount <= 50) {
      return 2;
    } else if (playerCount <= 70) {
      return 1;
    } else {
      return 0;
    }
  };

  StateManager.prototype._generateNewSnakeLayout = function (playerId, snakeLayer, rebornEffect, nowRadius) {
    var snakeConfig = this.sessionParameter.config.snake;
    var maxLength = nowRadius - snakeConfig.baseSpeed * snakeConfig.maxNameLength * Math.round(90 / snakeConfig.baseSpeed) * 2; // speed * segments * historyDistanceInterval

    var direction = Math.ceil(g.game.random.get(0, 1) * (this.sessionParameter.config.userInput.radianFineness - 1) / 2); // 左右の2択

    var position = {
      x: (g.game.random.generate() - 0.5) * maxLength,
      y: (g.game.random.generate() - 0.5) * maxLength
    };
    var name = this.playerList[playerId].user.name;
    var words = utils_1.stringToArray(name).slice(0, Math.min(name.length, this.sessionParameter.config.snake.maxNameLength));

    if (words.length < this.sessionParameter.config.snake.maxNameLength) {
      var blankCount = this.sessionParameter.config.snake.maxNameLength - words.length;

      for (var i = 0; i < blankCount; ++i) {
        words.push("　");
      }
    }

    var snake = new Snake_1.Snake({
      parent: snakeLayer,
      x: position.x,
      y: position.y,
      angle: direction / this.sessionParameter.config.userInput.radianFineness * 360,
      words: words,
      snakeBaseSpeed: this.sessionParameter.config.snake.baseSpeed,
      snakeMaxSpeedScale: this.sessionParameter.config.snake.maxSpeedScale,
      snakeMaxKnotLength: this.sessionParameter.config.snake.maxKnotLength,
      font: this.resource.font,
      snakeType: this.playerList[playerId].snakeType,
      rebornEffect: rebornEffect,
      onEndRebornEffect: function onEndRebornEffect() {
        if (!g.game.isActiveInstance()) return;
        var preventTouchMessage = {
          messageType: MessageEventType_1.MessageEventType.preventUsertouch,
          messageData: {
            playerId: playerId,
            preventType: MessageEventType_1.PreventType.None
          }
        };
        g.game.raiseEvent(new g.MessageEvent(preventTouchMessage));
      }
    });
    return [snake, direction];
  };

  StateManager.prototype._currentSetTimeout = function (handler, milliseconds) {
    var scene = g.game.scene();

    if (scene) {
      scene.setTimeout(handler, milliseconds);
    }
  };

  return StateManager;
}();

exports.StateManager = StateManager;
var PlayerState;

(function (PlayerState) {
  /**
   * 不可視な天使（ゴースト）として参加している
   */
  PlayerState["ghost"] = "ghost";
  /**
   * 盤面に影響を持つスネークを操作している
   */

  PlayerState["playing"] = "playing";
  /**
   * join済みだがゴーストもスネークも操作していない
   */

  PlayerState["dead"] = "dead";
  /**
   * 無敵状態（当たり判定なし）
   * ゲーム開始・リスポン直後に即死するのを避けるための状態で、ghostとは区別される
   * 生きているプレイヤーとしてカウントされる
   */

  PlayerState["invincible"] = "invincible";
  /**
   * 演出中の状態（当たり判定なし）
   * キルされた時などに演出を行うための状態
   * 生きているプレイヤーとしてカウントされる
   */

  PlayerState["staging"] = "staging";
  /**
   * joinを押してないプレイヤーはPlayerStateが生成されないため、これを表現する種別はない
   */
})(PlayerState = exports.PlayerState || (exports.PlayerState = {}));

var PlayerInfo =
/** @class */
function () {
  function PlayerInfo(param) {
    this.player = param.player;
    this.user = param.user;
    this.snakeType = param.snakeType;
    this.state = PlayerState.invincible;
    this.respawnTimes = param.user.isPremium || param.isBroadcaster ? defaultParameter_1.sessionParameter.config.snake.premiumRespawnTimes : defaultParameter_1.sessionParameter.config.snake.respawnTimes;
    this.killCount = 0;
    this.preventType = MessageEventType_1.PreventType.None;
    this.lengthCount = 0;
    this.lastWords = "";
  }

  PlayerInfo.prototype.destroySnake = function () {
    this.lastWords = this.getsLastWords();
    this.snake.destroy();
    this.snake = null;
    this.state = PlayerState.dead;
  };

  PlayerInfo.prototype.getsLastWords = function () {
    return this.snake.words.reduce(function (str, ch) {
      return str + ch;
    }, "");
  };

  return PlayerInfo;
}();

exports.PlayerInfo = PlayerInfo;
var AudioType;

(function (AudioType) {
  // ----------
  // ゲーム画面のオーディオ
  // ----------

  /**
   * ゲーム画面BGM
   */
  AudioType["GameBGM"] = "GameBGM";
  /**
   * ３２１カウントダウン時のSE
   */

  AudioType["Count"] = "Count";
  /**
   * ゲーム開始時のSE
   */

  AudioType["Start"] = "Start";
  /**
   * ゲーム終了時のSE
   */

  AudioType["Finish"] = "Finish";
  /**
   * 衝突時のSE
   */

  AudioType["Collision"] = "Collision";
  /**
   * ダッシュ時のSE
   */

  AudioType["Dash"] = "Dash";
  /**
   * お宝ゲット時のSE
   */

  AudioType["Jewel"] = "Jewel";
  /**
   * 選択時のSE
   */

  AudioType["Select"] = "Select"; // ----------
  // リザルト画面のオーディオ
  // ----------

  /**
   * イントロ
   */

  AudioType["Intro"] = "Intro";
  /**
   * リザルト画面BGM
   */

  AudioType["ResultBGM"] = "ResultBGM";
})(AudioType = exports.AudioType || (exports.AudioType = {}));

function commonAreaFromSprite(e) {
  var centerPos = e.localToGlobal({
    x: e.anchorX * e.width,
    y: e.anchorY * e.height
  });
  return {
    x: centerPos.x - e.anchorX * e.width,
    y: centerPos.y - e.anchorY * e.height,
    width: e.width,
    height: e.height
  };
}