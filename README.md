<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
</p>

# akashic-cli

[Akashic Engine](https://akashic-games.github.io/) を使ったゲーム作成を補助するコマンドラインユーティリティです。

## インストール

akashic-cli は Node.js v4.2 以降で動作します。
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

## ビルド方法

akashic-cli はTypeScriptで書かれたJSモジュールです。ビルドにはNode.jsが必要です。 リポジトリ直下で次を実行してください。

```
npm install
npm run build
```

これにより packages ディレクトリ以下の各モジュールがリンクされ、互いに利用できるようになります。

## 開発者向け

### バージョンの更新

akashic-cli への PullRequest 作成時に [changeset](https://github.com/changesets/changesets) を利用して変更内容を記録します。

```sh
npm run changeset
```

対話型プロンプトにより変更内容を入力後 `./.changeset` ディレクトリに出力されるファイルを PullRequest のコミットに含めてください。

対象の PullRequest をマージするとバージョン更新の PullRequest が自動的に作成されます。
内容を確認後、その PullRequest をマージすることで publish が完了します。

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
