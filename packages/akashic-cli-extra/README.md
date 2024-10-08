<p align="center">
  <img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
</p>

# akashic-cli-extra
akashic-cli-extraには以下のツールが含まれています。
* akashic-cli-config
* akashic-cli-modify
* akashic-cli-stat

通常、ゲーム開発者がこれらのツールを直接利用する必要はありません。
[akashic-cli](https://github.com/akashic-games/akashic-cli) を利用してください。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## akashic-cli-config

**akashic-cli-config** は akashic コマンドの設定を管理するツールです。

### 実行方法

```
akashic-cli-config
```

## akashic-cli-modify

**akashic-cli-modify** は game.json の必須パラメータを更新するツールです。

### 実行方法

```
akashic-cli-modify
```

## akashic-cli-stat

**akashic-cli-stat** は Akashic ゲームの統計情報を取得するツールです。

### 実行方法

```
akashic-cli-stat
```

## ビルド方法

**akashic-cli-extra** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

`npm run build` によりgulpを使ってビルドできます。

```sh
npm install
npm run build
```

## テスト方法

1. [eslint](https://eslint.org/ "eslint")を使ったLint
2. [vitest](https://vitest.dev/ "vitest")を使ったテスト

がそれぞれ実行されます。

```sh
npm test
```

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
