<p align="center">
  <img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
</p>

# akashic-cli-commons

**akashic-cli-commons** は [Akashic Engine](https://akashic-games.github.io/) で使われる、各 akashic-cli-xxx コマンドの共通ライブラリです。

通常、ゲーム開発者がこのライブラリを直接利用する必要はありません。
[akashic-cli](https://github.com/akashic-games/akashic-cli) を利用してください。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## ビルド方法

**akashic-cli-commons** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

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
