# typescript-game-sample

**typescript-game-sample**はTypeScriptでAkashicのゲームを作る際のサンプルプロジェクトです。

## 利用方法

 `typescript-game-sample` を利用するにはNode.jsが必要です。

初回のみ、以下のコマンドを実行して、ビルドに必要なパッケージをインストールしてください。
この作業は `typescript-game-sample` を新しく生成するごとに必要です。

```sh
npm install
```

### ビルド方法

`typescript-game-sample` はTypeScriptで書かれているため、以下のコマンドでJavaScriptファイルに変換する必要があります。

```sh
npm run build
```

`src` ディレクトリ以下のTypeScriptファイルがコンパイルされ、`script` ディレクトリ以下にJavaScriptファイルが生成されます。

`npm run build` は自動的に `akashic scan asset script` を実行するので、`game.json` の更新が行われます。

### 動作確認方法

以下のどちらかを実行後、ブラウザで `http://localhost:3000/game/` にアクセスすることでゲームを実行できます。

* `npm start`

* `npm install -g @akashic/akashic-sandbox` 後、 `akashic-sandbox .`

### テンプレートの使い方
#### typescript
* `src/main.ts` を編集することでゲームの作成が可能です。
  * スプライトの表示、音を鳴らす、タッチイベント定義等が、最初からこのテンプレートで行われています。

#### typescript-minimal
* `src/main.ts` を編集することでゲームの作成が可能です。
* 基本的な使い方は typescript テンプレートと同じですが、このテンプレートでは最低限のものしか記述されていないため以下のことは行われていません。
  * スプライトの表示
  * 音を鳴らす
  * タッチイベント定義

#### typescript-shin-ichiba-ranking
* ゲーム部分を作成する場合は、 `src/main.ts` を編集してください。
  * 基本的に`src/_bootstrap.ts`を編集する必要はありません。
* 基本的な使い方は typescript テンプレートと同じですが、このテンプレートでは `src/main.ts` の `main` 関数の引数`param`に以下の値が新たに付与されています。
  * `param.sessionParameter`: [セッションパラメーター](https://akashic-games.github.io/guide/ranking.html#session-parameters)
  * `param.isAtsumaru`:コンテンツが動作している環境がRPGアツマール上かどうかを表すbool値
* ランキングモードに対応したニコニコ新市場コンテンツの作り方の詳細については、[こちら](https://akashic-games.github.io/guide/ranking.html)を参照してください。

### アセットの更新方法

各種アセットを追加したい場合は、それぞれのアセットファイルを以下のディレクトリに格納します。

* 画像アセット: `image`
* スクリプトアセット: `script`
* テキストアセット: `text`
* オーディオアセット: `audio`

これらのアセットを追加・変更したあとに `npm run update` をすると、アセットの変更内容をもとに `game.json` を書き換えることができます。

### npm モジュールの追加・削除

`typescript-game-sample` でnpmモジュールを利用する場合、このディレクトリで `akashic install <package_name>` することで npm モジュールを追加することができます。

また `akashic uninstall <package_name>` すると npm モジュールを削除することができます。

## エクスポート方法

`typescript-game-sample` をエクスポートするときは以下のコマンドを利用します。

### htmlファイルのエクスポート

`npm run export-html` のコマンドを利用することで `game` ディレクトリにエクスポートすることができます。

`game/index.html` をブラウザで開くと単体動作させることができます。

### zipファイルのエクスポート

`npm run export-zip` のコマンドを利用することで `game.zip` という名前のzipファイルを出力できます。

## テスト方法

1. [TSLint](https://github.com/palantir/tslint "TSLint")を使ったLint
2. [Jasmine](http://jasmine.github.io "Jasmine")を使ったテスト

がそれぞれ実行されます。

```sh
npm test
```

テストコードのサンプルとして `spec/testSpec.js` を用意していますので参考にしてテストコードを記述して下さい。
