# CHANGELOG

## 0.28.12
* `engine-files-v*` を `@akashic/headless-driver` を経由して解決するように変更
  * 利用者に影響はありません

## 0.28.11
* 内部モジュールの更新

## 0.28.10
* 0.28.9 が壊れていてコンテンツを実行できなくなっていた問題を修正

## 0.28.9
* 内部モジュールの更新

## 0.28.8
* 内部モジュールの更新

## 0.28.7
* game.json の `environment.features` の値をサポート

## 0.28.6
* 内部モジュールの更新

## 0.28.5
* 内部モジュールの更新

## 0.28.4
* 内部モジュールの更新

## 0.28.3
* 内部モジュールの更新

## 0.28.2
* 内部モジュールの更新

## 0.28.1
* 内部モジュールの更新

## 0.28.0
* 内部モジュールの更新

## 0.27.0
* 内部モジュールの更新

## 0.26.0
* 内部モジュールの更新

## 0.25.0
* 内部モジュールの更新

## 0.24.8
* 内部モジュールの更新

## 0.24.7
* 内部モジュールの更新

## 0.24.6
* interact.js のバージョンを 1.10.19 に更新

## 0.24.5
* 内部モジュールの更新

## 0.24.4
* 内部モジュールの更新

## 0.24.3
* 内部モジュールの更新

## 0.24.2
* 内部モジュールの更新

## 0.24.1
* v0.24.0 で `globalScripts` を持つコンテンツが動作しなくなった問題を修正

## 0.24.0
* `ScriptAsset#exports` のサポート

## 0.23.5
* 内部モジュールの更新

## 0.23.4
* 内部モジュールの更新

## 0.23.3
* 内部モジュールの更新

## 0.23.2
* 内部モジュールの更新

## 0.23.1
* 内部モジュールの更新

## 0.23.0
* 内部モジュールの更新

## 0.22.8
* 内部モジュールの更新

## 0.22.7
* 内部モジュールの更新

## 0.22.6
* 内部モジュールの更新

## 0.22.5
* 内部モジュールの更新

## 0.22.4
* 内部モジュールの更新

## 0.22.3
* 内部モジュールの更新

## 0.22.2
* 内部モジュールの更新

## 0.22.1
* 開発者ツールの E ダンプツールで例外が起きる問題を修正

## 0.22.0
* 内部モジュールの更新

## 0.21.3
* game.jsonの `environtment.nicolive` の値を akashic-sandbox 上で反映できるように

## 0.21.2
* 内部モジュールの更新

## 0.21.1
* 内部モジュールの更新

## 0.21.0
* 内部モジュールの更新

## 0.20.0
* 内部モジュールの更新

## 0.19.3
* `engine-files` のエイリアス名 `aev*` を `engine-files-v*` へ変更

## 0.19.2
* 内部モジュールの更新

## 0.19.1
* 内部モジュールの更新

## 0.19.0
* 環境変数 `ENGINE_FILES_V3_PATH` が設定されていた場合、指定されたパスの engine-files を利用してコンテンツを実行するよう対応

## 0.18.3
*  コンテンツの sandbox.config.js で `warn.useDate`, `warn.useMathRandom` が設定されていたらその設定を優先するよう対応

## 0.18.2
* 内部モジュールの更新

## 0.18.1
* ES6 の警告表示機能を削除

## 0.18.0
* 内部モジュールの更新

## 0.17.57
* @akashic/sandbox-configuration を使用するように修正

## 0.17.56
* sandbox.config.jsの `warn.drawDestinationEmpty` でコンテンツで範囲外描画されている場合の警告出力を制御するように

## 0.17.55
* 内部モジュールの更新

## 0.17.54
* 一部の描画処理を誤って「Safari での表示が崩れる」と判定していた問題を修正

## 0.17.53
* v3コンテンツで g.game.focusingCamera の指定が効かない問題を修正

## 0.17.52
* engine-filesを直接ホストするように修正

## 0.17.51
* ローカルインストール時にコンテンツを実行できなくなっていた問題を修正

## 0.17.50
* 内部コンポーネントの更新
  * @akashic/engine-files@3.2.2 に更新

## 0.17.49
* 0.17.48 が壊れていてコンテンツを実行できなくなっていた問題を修正

## 0.17.48
* 保持していた各バージョンの engine-files を削除し、package.json で管理するよう修正
* 内部コンポーネントの更新
  * @akashic/engine-files@1.2.1 に更新
  * @akashic/engine-files@2.2.1 に更新
  * @akashic/engine-files@3.2.1 に更新

## 0.17.47
* ブラウザの開発者ツールでソースファイル名に余計なクエリパラメータがつかないように修正

## 0.17.46
* 内部コンポーネントの更新
* v1(engine-files@1.2.0)
* v2(engine-files@2.2.0)
* v3(engine-files@3.2.0)

## 0.17.45
* 内部コンポーネントの更新
* v1(engine-files@1.2.0)
* v2(engine-files@2.2.0)
* v3(engine-files@3.1.9)

## 0.17.44
* 内部コンポーネントの更新
* v1(engine-files@1.2.0)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.9)

## 0.17.43
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.9)

## 0.17.42
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.8)

## 0.17.41
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.7)

## 0.17.40
* エンティティの範囲外が描画されている時エラーを投げる処理を追加

## 0.17.39
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.6)

## 0.17.38
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.5)

## 0.17.37
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.4)

## 0.17.36
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.3)

## 0.17.35
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.1)

## 0.17.34
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.1.0)

## 0.17.33
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.0.22)

## 0.17.32
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.0.21)

## 0.17.31
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.57)
* v3(engine-files@3.0.20)

## 0.17.30
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.56)
* v3(engine-files@3.0.20)

## 0.17.29
* publish 時のファイル破損のためバージョンのみ更新

## 0.17.28
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.56)
* v3(engine-files@3.0.19)

## 0.17.27
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.55)
* v3(engine-files@3.0.19)

## 0.17.26
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.55)
* v3(engine-files@3.0.18)

## 0.17.25
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.54)
* v3(engine-files@3.0.18)

## 0.17.24
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.54)
* v3(engine-files@3.0.17)

## 0.17.23
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.54)
* v3(engine-files@3.0.16)

## 0.17.22
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.54)
* v3(engine-files@3.0.15)

## 0.17.21
* v3 コンテンツにおいてスナップショット確認ツールが動作しない問題を修正

## 0.17.20
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.53)
* v3(engine-files@3.0.14)

## 0.17.19
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.53)
* v3(engine-files@3.0.13)

## 0.17.18
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.53)
* v3(engine-files@3.0.11)

## 0.17.17
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.53)
* v3(engine-files@3.0.11)

## 0.17.16
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.53)
* v3(engine-files@3.0.10)

## 0.17.15
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.53)
* v3(engine-files@3.0.9)

## 0.17.14
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.52)
* v3(engine-files@3.0.9)

## 0.17.13
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.52)
* v3(engine-files@3.0.8)

## 0.17.12
devツールの "セッションパラメータ送る" と "ニコニコ新市場のセッションパラメータを送る" を同時に送信するとコンテンツが実行できなくなる不具合の修正

## 0.17.11
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.51)
* v3(engine-files@3.0.8)

## 0.17.10
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.51)
* v3(engine-files@3.0.7)

## 0.17.9
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.51)
* v3(engine-files@2.1.51)

## 0.17.8
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.7)

## 0.17.7
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.6)

## 0.17.6
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.5)

## 0.17.5
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.4)

## 0.17.4
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.3)

## 0.17.3
* ニコニコ新市場対応テストでv3コンテンツを停止する時にエラーになる問題を修正

## 0.17.2
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.2)

## 0.17.1
* 内部コンポーネントの更新
* v1(engine-files@1.1.16)
* v2(engine-files@2.1.50)
* v3(engine-files@3.0.1)

## 0.17.0
* `@akashic/game-storage` への依存を切る対応

## 0.16.25
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.49, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.11)

## 0.16.24
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.48, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.11)

## 0.16.23
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.48, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.10)

## 0.16.22
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.47, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.10)

## 0.16.21
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.47, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.9)

## 0.16.20
* コンテンツのsandbox.config.jsでES6機能警告表示の設定が行われていたらそちらの設定を優先するよう対応

## 0.16.19
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.47, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.8)

## 0.16.18
* 内部コンポーネントの更新
* v1(engine-files@1.1.16, game-storage@0.0.6)
* v2(engine-files@2.1.46, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.7)

## 0.16.17
* 内部コンポーネントの更新
* v1(engine-files@1.1.15, game-storage@0.0.6)
* v2(engine-files@2.1.45, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.7)

## 0.16.16
* 内部コンポーネントの更新
* v1(engine-files@1.1.15, game-storage@0.0.6)
* v2(engine-files@2.1.44, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.7)

## 0.16.15
* 内部コンポーネントの更新
* v1(engine-files@1.1.15, game-storage@0.0.6)
* v2(engine-files@2.1.43, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.7)

## 0.16.14
* 内部コンポーネントの更新
* v1(engine-files@1.1.15, game-storage@0.0.6)
* v2(engine-files@2.1.42, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.7)

## 0.16.13
* 最新のengine-filesを導入した時にv3系のコンテンツを実行できなくなる不具合の修正
* 内部コンポーネントの更新
  * v1(engine-files@1.1.15, game-storage@0.0.6)
  * v2(engine-files@2.1.41, game-storage@0.0.6)
  * v3(engine-files@3.0.0-beta.6)

## 0.16.12
* 内部コンポーネントの更新
* v1(engine-files@1.1.15, game-storage@0.0.6)
* v2(engine-files@2.1.41, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.5)

## 0.16.11
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.41, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.5)

## 0.16.10
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.40, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.5)

## 0.16.9
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.39, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.5)

## 0.16.8
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.39, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.4)

## 0.16.7
* v3用のコンポーネントをコンテンツ実行に利用するよう修正

## 0.16.6
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.39, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.3)

## 0.16.5
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.39, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.3)

## 0.16.4
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.38, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.3)

## 0.16.3
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.38, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.2)

## 0.16.2
* 内部コンポーネントの更新
* v1(engine-files@1.1.14, game-storage@0.0.6)
* v2(engine-files@2.1.37, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.2)

## 0.16.1
* 内部コンポーネントの更新
* v1(engine-files@1.1.13, game-storage@0.0.6)
* v2(engine-files@2.1.36, game-storage@0.0.6)
* v3(engine-files@3.0.0-beta.1)

## 0.16.0
* v3用のコンポーネントを追加
  * v1(engine-files@1.1.13, game-storage@0.0.6)
  * v2(engine-files@2.1.35, game-storage@0.0.6)
  * v3(engine-files@3.0.0-beta.1)

## 0.15.23
* `game.json`の`preferredSessionParameters.TotalTimeLimit`の値を利用するUIを、`DevTool`の`niconico`タブへ追加。

## 0.15.22
* 内部コンポーネントの更新
  * v1(engine-files@1.1.13, game-storage@0.0.6)
  * v2(engine-files@2.1.35, game-storage@0.0.6)

## 0.15.21
* 内部コンポーネントの更新
  * v1(engine-files@1.1.13, game-storage@0.0.6)
  * v2(engine-files@2.1.34, game-storage@0.0.6)

## 0.15.20
* 内部コンポーネントの更新
  * v1(engine-files@1.1.13, game-storage@0.0.6)
  * v2(engine-files@2.1.33, game-storage@0.0.6)

## 0.15.19
* 内部コンポーネントの更新
  * v1(engine-files@1.1.13, game-storage@0.0.6)
  * v2(engine-files@2.1.32, game-storage@0.0.6)

## 0.15.18
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.32, game-storage@0.0.6)

## 0.15.17
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.31, game-storage@0.0.6)

## 0.15.16
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.30, game-storage@0.0.6)

## 0.15.15
* コンテンツの中で `Date.now()` `Math.random()` が利用されていた場合、警告を表示する

## 0.15.14
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.29, game-storage@0.0.6)

## 0.15.13
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.28, game-storage@0.0.6)

## 0.15.12
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.28, game-storage@0.0.6)

## 0.15.11
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.27, game-storage@0.0.6)

## 0.15.10
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.26, game-storage@0.0.6)

## 0.15.9
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.25, game-storage@0.0.6)

## 0.15.8
* 内部コンポーネントの更新
  * v1(engine-files@1.1.12, game-storage@0.0.6)
  * v2(engine-files@2.1.24, game-storage@0.0.6)

## 0.15.7
* 内部コンポーネントの更新
  * v1(engine-files@1.1.11, game-storage@0.0.6)
  * v2(engine-files@2.1.24, game-storage@0.0.6)

## 0.15.6
* 内部コンポーネントの更新
  * v1(engine-files@1.1.11, game-storage@0.0.6)
  * v2(engine-files@2.1.23, game-storage@0.0.6)

## 0.15.5
* プレイログ出力時のファイル拡張子を `.json`へ修正
* バージョン情報をタイトルに表示するよう対応

## 0.15.4
* 内部コンポーネントの更新
  * v1(engine-files@1.1.11, game-storage@0.0.6)
  * v2(engine-files@2.1.22, game-storage@0.0.6)

## 0.15.3
* 内部コンポーネントの更新
  * v1(engine-files@1.1.10, game-storage@0.0.6)
  * v2(engine-files@2.1.22, game-storage@0.0.6)

## 0.15.2
* `fit to Window` から `default size` でサイズを戻すとコンテンツの位置がずれる問題を修正

## 0.15.1
* engineFiles更新スクリプトの修正
* 内部コンポーネント更新
  * v1(engine-files@1.1.10, game-storage@0.0.6)
  * v2(engine-files@2.1.21, game-storage@0.0.6)

## 0.15.0
* LocalStorageに保存するプレイログデータを修正

## 0.14.0
* スクリプトファイルに "use strict" 宣言を付けるように
* デバッグビルド版 engine-files を利用するように

## 0.13.70
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.69
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.68
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.67
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.66
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.65
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.64
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.19, game-storage@0.0.6)

## 0.13.63
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.18, game-storage@0.0.6)

## 0.13.62
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.17, game-storage@0.0.6)

## 0.13.61
* 内部コンポーネントの更新
  * v1(engine-files@1.1.9, game-storage@0.0.6)
  * v2(engine-files@2.1.16, game-storage@0.0.6)

## 0.13.60
* 内部コンポーネントの更新
  * v1(engine-files@1.1.8, game-storage@0.0.6)
  * v2(engine-files@2.1.15, game-storage@0.0.6)

## 0.13.59
* 内部コンポーネントの更新
  * v1(engine-files@1.1.8, game-storage@0.0.6)
  * v2(engine-files@2.1.14, game-storage@0.0.6)

## 0.13.58
* 内部コンポーネントの更新
  * v1(engine-files@1.1.8, game-storage@0.0.6)
  * v2(engine-files@2.1.13, game-storage@0.0.6)

## 0.13.57
* 内部モジュールの更新スクリプトの修正

## 0.13.56
* 内部コンポーネントの更新
  * v1(engine-files@1.1.7, game-storage@0.0.6)
  * v2(engine-files@2.1.12, game-storage@0.0.6)

## 0.13.55
* 内部モジュールの更新方法の変更

## 0.13.54
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.20, pdi-browser@0.10.15)
  * v2(akashic-engine@2.4.11, game-driver@1.4.11, pdi-browser@1.5.6)

## 0.13.53
* 「ランキング対応テスト」を「ニコニコ新市場対応テスト」に表記変更
* ニコニコ新市場対応テストで、セッションパラメーターとして mode を送ることができるよう対応

## 0.13.52
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.19, pdi-browser@0.10.14)
  * v2(akashic-engine@2.4.11, game-driver@1.4.11, pdi-browser@1.5.5)

## 0.13.51
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.18, pdi-browser@0.10.13)
  * v2(akashic-engine@2.4.10, game-driver@1.4.10, pdi-browser@1.5.4)

## 0.13.50
* g.Logger 非推奨化に追従するため、 logger.js を削除

## 0.13.49
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.18, pdi-browser@0.10.12)
  * v2(akashic-engine@2.4.10, game-driver@1.4.10, pdi-browser@1.5.3)

## 0.13.48
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.18, pdi-browser@0.10.12)
  * v2(akashic-engine@2.4.8, game-driver@1.4.10, pdi-browser@1.5.3)

## 0.13.47
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.17, pdi-browser@0.10.12)
  * v2(akashic-engine@2.4.8, game-driver@1.4.9, pdi-browser@1.5.3)

## 0.13.46
* 内部コンポーネントの更新
  * v1(akashic-engine@1.13.0, game-driver@0.11.16, pdi-browser@0.10.12)
  * v2(akashic-engine@2.4.8, game-driver@1.4.8, pdi-browser@1.5.3)

## 0.13.45
* 内部コンポーネントの更新

## 0.13.44
* 内部コンポーネントの更新

## 0.13.43
* 内部コンポーネントの更新

## 0.13.42
* 内部コンポーネントの更新

## 0.13.41
* 内部コンポーネントの更新

## 0.13.40
* コンテンツに対してランキングモードの開始g.MessageEventを送ることができるよう対応
* ストレージタブをメニューから削除

## 0.13.39
* ES5でサポートされていない機能が利用されていた場合コンソール上に警告を出す機能を追加

## 0.13.38
* 内部コンポーネントの更新

## 0.13.37
* 内部コンポーネントの更新

## 0.13.36
* 内部コンポーネントの更新

## 0.13.35
* 内部コンポーネントの更新

## 0.13.34
* 内部コンポーネントの更新

## 0.13.33
* 内部コンポーネントの更新

## 0.13.32
* 相対時刻ベースの `g.Timestamp` を利用していたコンテンツにおいてリプレイが正常に行われていなかった件の修正

## 0.13.31
* 内部コンポーネントの更新

## 0.13.30
* 内部コンポーネントの更新

## 0.13.29
* 内部コンポーネントの更新

## 0.13.28
* 内部コンポーネントの更新

## 0.13.27
* 内部コンポーネントの更新

## 0.13.26
* 内部コンポーネントの更新

## 0.13.25
* 内部コンポーネントのバージョンが正しいかどうかチェックする機構の追加
* v1のエンジンモジュールを以下に更新
  * akashic-engine@1.12.10
  * game-driver@0.11.12
  * pdi-browser@0.10.8

## 0.13.24
* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.3.2

## 0.13.23
* 内部モジュールの更新方法の変更

## 0.13.22
* akashic-sandboxインストール時にエラーが出力されていた問題を修正

## 0.13.21
* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.3.0
  * pdi-browser@1.4.0

## 0.13.20
* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.2.1

## 0.13.19
* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.2.0
    * 更新なし
  * game-driver@1.1.1
    * 更新なし
  * pdi-browser@1.3.1

## 0.13.18
* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.2.0
  * game-driver@1.1.1
    * 差分あり
  * pdi-browser@1.3.0

## 0.13.17
* 0.13.16が壊れていてビルドできなくなっていた問題を修正

## 0.13.16
* 内部モジュールの更新方法の変更

* v2のエンジンモジュールを以下に更新
  * game-driver@1.1.1
  * pdi-browser@1.2.1

* v1のエンジンモジュールを以下に更新
  * game-driver@0.11.10
    * 更新なし
  * pdi-browser@0.10.7

## 0.13.15
* 0.13.14 のモジュール更新が不十分だった問題を修正

## 0.13.14
* fit to window ボタンの実装を pdi-browser@1.1.0 に追従

* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.1.1
  * game-driver@1.0.1
    * 更新なし
  * pdi-browser@1.1.0
    * 更新なし

* v1のエンジンモジュールを以下に更新
  * akashic-engine@1.12.8
  * game-driver@0.11.10
  * pdi-browser@0.10.6

## 0.13.13

* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.1.0
  * game-driver@1.0.1
  * pdi-browser@1.1.0

## 0.13.12

* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.0.3
  * game-driver@1.0.1
  * pdi-browser@1.0.3

## 0.13.11

* デベロッパーツールのデザインを調整

## 0.13.10

* JavaScriptコードからarrow functionを削除

## 0.13.9

* 0.13.8 の修正が不十分だった問題を修正

## 0.13.8

* sandbox.config.js を利用できるように

## 0.13.7

* 0.13.6でv2系のコンテンツが動作しなくなっていた問題を修正

## 0.13.6

* v1のエンジンモジュールを以下に更新
  * game-driver@0.11.8

## 0.13.5
* v2のエンジンモジュールを以下に更新
  * akashic-engine@2.0.2
  * game-driver@1.0.0
  * pdi-browser@1.0.1

* v1のエンジンモジュールを以下に更新
  * akashic-engine@1.12.7
  * game-driver@0.11.7
  * pdi-browser@0.10.3

## 0.13.4

* akashic-engine@2.0.0 を利用するように

## 0.12.3

内部コンポーネントの更新

## 0.12.2
* akashic-engine@1.12.2 を利用するように

## 0.12.1
* akashic-engine@1.12.1 を利用するように

## 0.12.0
* 内部コンポーネントの更新

## 0.11.1

* 内部コンポーネントの更新

## 0.11.0

* akashic-engine@1.12.0 に追従

## 0.10.6

* 「ゲーム開始時にsandbox-playerの自動Join」を有効にした場合、リプレイが正常に動作しないバグの修正

## 0.10.5

* 内部コンポーネントの更新

## 0.10.4

* TypeScript 2.1.6 導入
* 内部コンポーネントの更新

## 0.10.2

* 内部コンポーネントの更新

## 0.10.1

* 初期リリース
