<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
</p>

# akashic-cli-sandbox

akashic-cli-sandbox は、 [Akashic Engine](https://akashic-games.github.io/) を使って作成されたゲームの動作確認ツールです。

## インストール

Node.js が必要です。次のコマンドでインストールできます。

```
npm install -g @akashic/akashic-cli-sandbox
```

## 利用方法

```
akashic-cli-sandbox [-p <port>] [--cascade<cascade-path>] [<path>]
```

で、 `<path>` に置かれているAkashicのゲームを起動できます。
出力される案内にしたがって、Webブラウザで `http://localhost:3000/game/` を開いてください。

`<path>` には `game.json` が存在する必要があります。省略された場合、 `<path>` はカレントディレクトリ (`.`) です。
`-p` オプションを指定すると、サーバのポート番号を変更できます。たとえば `-p 3100` とした場合、 Webブラウザで開くURLは `http://localhost:3100/game/` になります。

`--cascade <cascade-path>` を与えると、 `path` にある game.json に対して `<cascade-path>` にある game.json がカスケードされます。
`--cascade` を複数指定した場合、指定した順でカスケードされます。

Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## Akashic Engine 2.0 を利用したコンテンツの起動方法

`game.json` に以下の記述を追加すると、対象のゲームを Akashic Engine 2.0 として実行します。

```js
{
..
  "environment": {
    "sandbox-runtime": "2"
  }
}
```

## 表示オプション

* http://localhost:3000/game/?profiler=1 にアクセスすると、プロファイラー表示モードでゲームを実行することができます
* http://localhost:3000/game/?fit=1 にアクセスすると、画面を最大まで拡大した状態でゲームを実行することができます
* http://localhost:3000/game/?bg=1 にアクセスすると、バックグラウンドとゲームに色をつけた状態でゲームを実行することができます

## デベロッパーメニュー

* ゲーム画面右上の歯車マークをクリックするとデベロッパーメニューが開きます。
* http://localhost:3000/game/?devmode=disable にアクセスするとデベロッパーメニューを無効化できます。

## 設定ファイルの利用

コンテンツの `game.json` と同じディレクトリに `sandbox.config.js` を置いた場合、実行時の挙動をカスタマイズできます。

```js
var config = {
  /** ゲーム実行時にeventsの同名メンバーをイベントとして送信します */
  autoSendEventName: "event0",
  /** ゲーム実行時にデベロッパーメニューを開きます */
  showMenu: true,
  /** デベロッパーメニューに登録済みのイベントとして表示します */
  events: {
    event0: [32, null, "9999", {foo: "foo"}, false],
    event1: [32, null, "9999", {var: "var"}, false]
  }
}
module.exports = config;
```

## ビルド方法

**akashic-cli-sandbox** はTypeScriptで書かれたJSモジュールであるため、ビルドにはNode.jsが必要です。

`npm run build` にてビルドできます。

```sh
npm install
npm run build # src/以下をビルド
```

## 環境変数

| 環境変数 | 説明 | 注釈 |
|--------|-----|-----|
| `ENGINE_FILES_V3_PATH` | engine-files v3 のビルド成果物のパス。 (e.g. `./engineFilesV3_x_y.js`) <br> この値が指定された場合、 対象の engine-files を akashic-engine v3 コンテンツ実行時に利用します。 | エンジン開発用のオプションです。通常、ゲーム開発時に利用する必要はありません。 |

## テスト方法

1. [eslint](https://eslint.org/ "eslint")を使ったLint
2. [vitest](https://vitest.dev/ "vitest")を使ったテスト

が実行されます。

```sh
npm test
```

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
