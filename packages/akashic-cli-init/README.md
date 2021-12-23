<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/master/img/akashic-cli.png"/>
</p>

# akashic-cli-init

**akashic-cli-init** は Akashic ゲームのテンプレートを生成するツールです。

通常、ゲーム開発者がこのツールを直接利用する必要はありません。
[akashic-cli](https://github.com/akashic-games/akashic-cli) を利用してください。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## ビルド方法

**akashic-cli-init** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

`npm run build` によりgulpを使ってビルドできます。

```sh
npm install
npm run build
```

## テスト方法

```sh
npm test
```

## 実行方法
デフォルトのテンプレートで初期化する。
```sh
akashic-cli-init
```

指定したテンプレートで初期化する。
```sh
akashic-cli-init -t typescript
```

akashic-cli-init のテンプレートはローカルテンプレートディレクトリに配置されています。
ローカルテンプレートディレクトリにテンプレートが存在しない場合、
テンプレートを以下の順番で探し、最初に見つかったものを利用します。
1. テンプレート配信サーバ (ただしURLが空文字列の場合このステップは省略)
2. コマンドに付属するファクトリテンプレート
* javascript
* javascript-minimal
* javascript-shin-ichiba-ranking
* typescript
* typescript-minimal
* typescript-shin-ichiba-ranking
* javascript-v3
* javascript-minimal-v3
* javascript-shin-ichiba-ranking-v3
* typescript-v3
* typescript-minimal-v3
* typescript-shin-ichiba-ranking-v3
テンプレートを再ダウンロードする場合、一度ローカルテンプレートのディレクトリを手動で削除する必要があります。
ローカルテンプレートのディレクトリは akashic-config で未設定の場合、
`~/.akashic-templates` になります。

### GitHub リポジトリからのテンプレート生成

-t に `github:<owner>/<repository>` と指定することで github.com からテンプレートを生成できます。
private repository など認証が必要な場合は `akashic config` で `init.github.protocol` を `ssh` に設定してください。

```sh
akashic config set init.github.protocol ssh # 初回のみ。認証を必要としない場合は不要。
akashic-cli-init -t github:your-orgs/your-repo
```

また `ghe:<owner>/<repository>` と指定することで GitHub Enterprise からテンプレートを生成できます。
GitHub Enterprise の URL は `akashic config` により設定できます。

```sh
akashic config set init.ghe.host your.company.com # 初回のみ
akashic init -t ghe:your-orgs/your-repo
```

これらの実行には `git` コマンドが必要です。
`git` コマンドのパスを直接指定する場合は環境変数 `GIT_BIN_PATH` に値を設定してください。

## 設定項目
akashic-cli-init は以下の設定を利用します。設定は `akashic config` コマンドを利用して行います。
* `init.repository`
  * テンプレート配信サーバのURL。空文字列の時はサーバを利用しない。デフォルトは空文字列。
* `init.defaultTemplateType`
  * テンプレートの種類が省略されたときに利用するテンプレート名。デフォルトは `javascript`。
* `init.localTemplateDirectory`
  * ローカルファイルシステムでテンプレートを保存する場所。デフォルトは `$HOME/.akashic-templates`。
* `init.github.host`
  * GitHub のホスト。デフォルトは `github.com`。
* `init.github.protocol`
  * GitHub からプロジェクトを clone する際のプロトコル。`https` または `ssh` が指定可能。デフォルトは `https`。
* `init.ghe.host`
  * GitHub Enterprise のホスト (e.g. `your.company.com`)。デフォルトは `undefined`。
* `init.ghe.protocol`
  * GitHub Enterprise からプロジェクトを clone する際のプロトコル。`https` または `ssh` が指定可能。デフォルトは `https`。

## 非公式な URL へのアクセス確認と保存
`-t gihtub:` や `ghe:`、 `-r` オプションで非公式な URL へアクセスする場合はプロンプトにて確認を行います。
プロンプトにて URL へのアクセスを許可した場合は、`.akashicrc` へ最大 4 件保存します。5 件目を保存する場合は、最初の 1 件目が削除されます。
また、保存されている値とオプションで指定された値が同じ場合は、確認のプロンプトをスキップします。

## 開発者向け

### ファクトリテンプレートの更新

ファクトリテンプレートを更新する場合は、 templates-src/ 以下 と templates-src-v3/ 以下を編集後、 `npm run update:template-zips` を実行して zip ファイルを更新します。

### ファクトリテンプレートの追加

ファクトリテンプレートを追加する場合は、 templates-src/ 以下に game-xxx/ デイレクトリを加えて
 `npm run update:template-zips` を実行後、 templates/template-list.json を編集してください。
game-xxx/ ディレクトリは、 Akashic ゲームである必要があります。
(実装上の制限から、現在は package.json を含むゲームを置くことはできないので注意してください。)

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。

