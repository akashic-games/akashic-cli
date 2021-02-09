# javascript-game-sample

**javascript-game-sample**はJavaScriptでAkashicのゲームを作る際のサンプルプロジェクトです。

## 利用方法

 `javascript-game-sample` を利用するにはNode.jsが必要です。

初回のみ、以下のコマンドを実行して、ビルドに必要なパッケージをインストールしてください。
この作業は `javascript-game-sample` を新しく生成するごとに必要です。

```sh
npm install
```

### 動作確認方法

以下のどちらかを実行後、ブラウザで `http://localhost:3000/game/` にアクセスすることでゲームを実行できます。

* `npm start`

* `npm install -g @akashic/akashic-sandbox` 後、 `akashic-sandbox .`

### テンプレートの使い方
#### javascript
* `script/main.js` を編集することでゲームの作成が可能です。
  * スプライトの表示、音を鳴らす、タッチイベント定義等が、最初からこのテンプレートで行われています。

#### javascript-minimal
* `script/main.js` を編集することでゲームの作成が可能です。
* 基本的な使い方は javascript テンプレートと同じですが、このテンプレートでは最低限のものしか記述されていないため以下のことは行われていません。
  * スプライトの表示
  * 音を鳴らす
  * タッチイベント定義

#### javascript-shin-ichiba-ranking
* ゲーム部分を作成する場合は、 `script/main.js` を編集してください。
  * 基本的に`script/_bootstrap.js`を編集する必要はありません。
* 基本的な使い方は javascript テンプレートと同じですが、このテンプレートでは `script/main.js` の `main` 関数の引数`param`に以下の値が新たに付与されています。
  * `param.sessionParameter`: [セッションパラメーター](https://akashic-games.github.io/guide/ranking.html#session-parameters)
  * `param.isAtsumaru`:コンテンツが動作している環境がゲームアツマール上かどうかを表すbool値
* ランキングモードに対応したニコニコ新市場コンテンツの作り方の詳細については、[こちら](https://akashic-games.github.io/guide/ranking.html)を参照してください。

### アセットの更新方法

各種アセットを追加したい場合は、それぞれのアセットファイルを以下のディレクトリに格納します。

* 画像アセット: `image`
* スクリプトアセット: `script`
* テキストアセット: `text`
* オーディオアセット: `audio`

これらのアセットを追加・変更したあとに `akashic scan asset` をすると、アセットの変更内容をもとに `game.json` を書き換えることができます。

### npm モジュールの追加・削除

`javascript-game-sample` でnpmモジュールを利用する場合、このディレクトリで `akashic install <package_name>` することで npm モジュールを追加することができます。

また `akashic uninstall <package_name>` すると npm モジュールを削除することができます。

## エクスポート方法

`javascript-game-sample` をエクスポートするときは以下のコマンドを利用します。

### htmlファイルのエクスポート

`akashic export html -o game` のコマンドを利用することで `game` ディレクトリにエクスポートすることができます。

`game/index.html` をブラウザで開くと単体動作させることができます。

### zipファイルのエクスポート

`akashic export zip -o game.zip -s` のコマンドを利用することで `game.zip` という名前のzipファイルを出力できます。

## テスト方法

以下のコマンドで [ESLint](https://github.com/eslint/eslint "ESLint")を使ったLintが実行されます。
スクリプトアセット内にES5構文に反する記述がある場合エラーを返します。

```sh
npm run lint
```
