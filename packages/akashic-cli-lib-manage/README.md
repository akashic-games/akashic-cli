<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
</p>

# akashic-cli-lib-manage
**akashic-cli-lib-manage** には以下のツールが含まれています。
* akashic-cli-install
* akashic-cli-uninstall
* akashic-cli-update

通常、ゲーム開発者がこれらのツールを直接利用する必要はありません。
[akashic-cli](https://github.com/akashic-games/akashic-cli) を利用してください。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## akashic-cli-install

**akashic-cli-install** は Akashic ゲーム用の `npm install` のラッパーです。

### 実行方法

```
akashic-cli-install
```

## akashic-cli-uninstall

**akashic-cli-uninstall** は Akashic ゲーム用の `npm uninstall` のラッパーです。

### 実行方法

```
akashic-cli-uninstall
```

## akashic-cli-update

**akashic-cli-update** は game.json の内容を更新するツールです。

### 実行方法

```
akashic-cli-update
```

## ビルド方法

**akashic-cli-lib-manage** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

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
