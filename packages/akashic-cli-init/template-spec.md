# テンプレートに関する仕様

## カスタムテンプレートの作成

`akashic-init` はローカルリポジトリ(`$HOME/.akashic-templates`)内の、
テンプレート名と一致する名前のディレクトリの中身をカレントディレクトリにコピーします。

例えば `mytemplate` という名前のテンプレートを作成する場合、
`$HOME/.akashic-templates/mytemplate` 内に必要なファイルを配置します。

テンプレートの動作を設定するには、テンプレート設定ファイル (`template.json`) を
テンプレートディレクトリ直下に配置します。

以下はテンプレート設定ファイルの例です。

```
{
  "files": [
    {"src": "mainScene.js", "dst": "script/mainScene.js"},
    {"src": "game.json": "dst": "game.json"}
  ],
  "gameJson": "game.json"
}
```

`files` キーにはコピーするファイルを列挙します。
上の例ではテンプレートディレクトリの `mainScene.js` をカレントディレクトリの
`script/mainScene.js` に、`game.json` を `game.json` にコピーします。
ファイルの一覧で、`src` と `dst` が同じ場合は `dst` の指定を省略できます。
`files` が存在しない場合は、`template.json` 以外のすべてのファイルを
そのままコピーします。

`gameJson` キーにはコピー先における `game.json` のパスを指定します。
`gameJson` が存在しない場合はカレントディレクトリに `game.json` が存在する必要が
あります。

## テンプレート配信サーバの作成

テンプレート配信サーバはHTTPまたはHTTPSでテンプレートの中身をzipで固めたファイルを配信します。
テンプレート配信サーバにはテンプレートリスト(`template-list.json`)とそれぞれの
テンプレートの種類に対応したテンプレートファイル(例: `javascript.zip`)が必要です。

テンプレートリストは以下のようなJSONファイルです。

```
{
  "templates": {
    "javascript": "javascript.zip",
    "typescript": "typescript.zip"
  }
}
```

`templates` キーにテンプレート名と対応するzipファイルの対応関係を記述します。
zipファイルはテンプレートを構成するファイルを圧縮したものです。
zipファイルはテンプレートディレクトリ内で展開されるので、
トップレベルにフォルダは必要ありません。
