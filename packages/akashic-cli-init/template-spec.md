# テンプレートに関する仕様

## カスタムテンプレートの作成

`akashic-cli-init` はローカルリポジトリ(`$HOME/.akashic-templates`)内の、
テンプレート名と一致する名前のディレクトリの中身をカレントディレクトリにコピーします。

例えば `mytemplate` という名前のテンプレートを作成する場合、
`$HOME/.akashic-templates/mytemplate` 内に必要なファイルを配置します。

テンプレートの動作を設定するには、テンプレート設定ファイル (`template.json`) を
テンプレートディレクトリ直下に配置します。

以下はテンプレート設定ファイルの例です。

```json
{
  "formatVersion": "0",
  "files": [
    {"src": "mainScene.js", "dst": "script/mainScene.js"},
    {"src": "game.json", "dst": "game.json"}
  ],
  "gameJson": "game.json",
  "extensions": [
    { "module": "@akashic-extension/akashic-timeline", "version": "^3" },
    { "module": "@akashic-extension/akashic-label", "version": "^3" }
  ]
}
```

`formatVersion` キーには `"0"` を指定するか、またはキーごと省略してください。
これは将来の拡張のために予約されたキーです。

`files` キーにはコピーするファイルを列挙します。
上の例ではテンプレートディレクトリの `mainScene.js` をカレントディレクトリの
`script/mainScene.js` に、`game.json` を `game.json` にコピーします。
ファイルの一覧で、`src` と `dst` が同じ場合は `dst` の指定を省略できます。
`files` が存在しない場合は、`template.json` 以外のすべてのファイルを
そのままコピーします。

`files` を省略した場合、`exclude` キーでコピーさせないファイルを個別に指定できます。
`exclude` はファイル名または glob のワイルドカードのパターンの配列をサポートします。
現バージョンにおいて `files` と `exclude` は同時に指定した場合、 `files` が優先されます。

```json
{
  "formatVersion": "0",
  "exclude": [
    "package-lock.json"
  ],
  "gameJson": "game.json"
}
```

`gameJson` キーにはコピー先における `game.json` のパスを指定します。
`gameJson` が存在しない場合はカレントディレクトリに `game.json` が存在する必要が
あります。

`extensions` キーにはプロジェクトに追加可能な拡張機能の一覧を指定できます。
これらの拡張機能は `akashic-cli-init` の実行時に、CLI 上でチェックボックス形式で選択可能となります。
チェックを入れると、選択した拡張に対応する npm モジュールが自動的に `akashic install` されます。

`module` には追加したい npm モジュールの名前を文字列で指定します。
この名前は、実際に `npm install <module>` でインストールされるものです。

`version` にはインストールするバージョンやタグを指定できます (例: `"^3"`)。
この値を指定した場合は `npm install <module>@<version>` のように利用されます。
省略した場合は `latest` が使用されます。

## テンプレート配信サーバの作成

テンプレート配信サーバはHTTPまたはHTTPSでテンプレートの中身をzipで固めたファイルを配信します。
テンプレート配信サーバにはテンプレートリスト(`template-list.json`)とそれぞれの
テンプレートの種類に対応したテンプレートファイル(例: `javascript.zip`)が必要です。

テンプレートリストは以下のようなJSONファイルです。

```json
{
  "formatVersion": "0",
  "templates": {
    "javascript": "javascript.zip",
    "typescript": "typescript.zip"
  }
}
```

`formatVersion` キーには `"0"` を指定するか、またはキーごと省略してください。
これは将来の拡張のために予約されたキーです。

`templates` キーにテンプレート名と対応するzipファイルの対応関係を記述します。
zipファイルはテンプレートを構成するファイルを圧縮したものです。
zipファイルはテンプレートディレクトリ内で展開されるので、
トップレベルにフォルダは必要ありません。
