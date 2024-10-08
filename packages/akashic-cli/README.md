<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
</p>

# akashic-cli

[Akashic Engine](https://akashic-games.github.io/) を使ったゲーム作成を補助するコマンドラインユーティリティです。

## インストール

akashic-cli は Node.js v18 以降で動作します。
以下のコマンドでインストールできます。

```sh
npm install -g @akashic/akashic-cli
```

## 利用方法

インストール後、 `akashic` コマンドが利用できるようになります。

例: カレントディレクトリに空のAkashicゲームを生成

```
akashic init
```

例: カレントディレクトリ以下のファイルを検索してアセットとして追加

```
akashic scan asset
```

例: カレントディレクトリのAkashicゲームをホストするマルチプレイ動作確認用サーバを起動

```
akashic serve
```

例: カレントディレクトリのAkashicゲームを、HTMLファイル(と画像・音声をまとめたディレクトリ)に変換し、 `../exported-my-game/` に出力する

```
akashic export html -o ../exported-my-game
```

各コマンドの詳細については、 [利用ガイド](https://akashic-games.github.io/reference/tool/akashic-cli/akashic-cli.html) を参照してください。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
