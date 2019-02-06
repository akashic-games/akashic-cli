<p align="center">
<img src="https://github.com/akashic-games/akashic-cli-serve/blob/master/img/akashic.png"/>
</p>

# akashic-cli-serve

akashic-cli-serve は、 [Akashic Engine][ae] で作成されたゲームの動作確認環境です。
サーバとして起動して、ブラウザからマルチプレイのゲームを動作させることができます。

このモジュールは、[akashic-cli](https://github.com/akashic-games/akashic-cli) に組み込まれています。
通常、ゲーム開発者がこのモジュールを直接利用する必要はありません。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

現時点では、マルチプレイの動作確認環境です。
シングルプレイの動作確認には、より多機能な `akashic-sandbox` をご利用ください。

## インストール

```
npm install -g @akashic/akashic-cli-serve
```

## 利用方法

```
akashic-cli-serve [<options>] [<path>]
```

`<path>` に、起動するゲームの game.json があるディレクトリを与えてください。
省略された場合、 `.` と解釈されます。

`<options>` に指定可能なオプションは次のとおりです。

|オプション|短縮名|効果|デフォルト値|
|:----------:|:---:|:---:|:---:|
|`--hostname <hostname>`|`-H`|起動するサーバのホスト名を指定します。|`localhost`|
|`--port <port>`|`-p`|起動するサーバのポート番号を指定します。|`3300`|
|`--help`|`-h`|ヘルプを表示して終了します。|N/A|
|`--version`|`-V`|バージョンを表示して終了します。|N/A|

[ae]: https://akashic-games.github.io/

## 開発

初期化:

```
npm i
```

ビルド:

```
npm run build
```

Storybook 起動:

```
npm run storybook
```

内部モジュール更新: 実行には `optionalDependencies` が解決できる必要があります。

```
node run copy:agv
```

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/game-driver/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
