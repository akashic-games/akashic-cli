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

`npm run build` によりビルドできます。

```sh
npm install
npm run build
```

## テスト方法

```sh
npm test
```

## 実行方法

指定したテンプレートで初期化する。

```sh
akashic-cli-init -t typescript
```

`-t` オプションに与えらえれる値 (テンプレートタイプ) は `-l` オプションで一覧できます。

```sh
akashic-cli-init -l
```

akashic-cli-init は、以下に置かれているテンプレートを利用できます。

- テンプレート配信サーバ (デフォルトでは `https://github.com/akashic-contents/templates` で提供されているもの)
- ローカルテンプレートディレクトリ (デフォルトでは `~/.akashic-templates/`)

同一のテンプレートタイプがテンプレート配信サーバとローカルテンプレートディレクトリにある場合、テンプレート配信サーバが優先されます。

### GitHub リポジトリからのテンプレート生成

-t に `github:<owner>/<repository>` と指定することで GitHub (github.com) からテンプレートを取得できます。
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

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。

