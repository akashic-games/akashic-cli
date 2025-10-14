<p align="center">
  <img src="https://github.com/akashic-games/akashic-cli/blob/main/img/akashic-cli.png"/>
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

[ae]: https://akashic-games.github.io/

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
|`--verbose`|`-v`|詳細情報をログ出力します。|`false`|
|`--no-auto-start`|`-A`|ブラウザを開いた時、コンテンツを自動開始しないようにします。|N/A|
|`--target-service <name>`|`-s`|指定されたサービスの挙動を模擬します。(後述)|`none`|
|`--watch`|`-w`|アセットディレクトリを監視し、変更時に新規プレイを作成します。|N/A|
|`--server-external-script <filepath>`|N/A|指定ファイルの js を評価し、アクティブインスタンスの g.game.external に代入します。|N/A|
|`--debug-playlog <path>`|N/A|指定した playlog.json を読み込みます(エンジン開発用、または開発中のオプションです)。|N/A|
|`--debug-pause-active`|N/A|アクティブインスタンスをポーズした状態でプレイを開始します。(エンジン開発用のオプションです)|N/A|
|`--allow-external`|N/A|外部アセットを許可します。許可する値は sandbox.config.js から読み込みます。|N/A|
|`--no-open-browser`|N/A|起動時に自動でブラウザを開かないようにします。|N/A|
|`--preserve-disconnected`|N/A|サーバ切断時に開いている子ウィンドウを閉じないようにします。|N/A|
|`--experimental-open <num>`|N/A|起動時に子ウィンドウを指定数開いて起動します。上限は 10 です。試験中の機能です。通常、利用しないでください。|N/A|
|`--ssl-cert <certificatePath>`|N/A|HTTPS で起動するための SSL 証明書のパスを指定します。|N/A|
|`--ssl-key <privatekeyPath>`|N/A|HTTPS で起動するための 秘密鍵のパスを指定します。|N/A|
|`--cors-allow-origin <origin>`|N/A|Access-Control-Allow-Origin レスポンスヘッダーの値を指定します。|N/A|
|`--sandbox-config <path>`|N/A|指定した sandbox.config.js を読み込みます。|`./sandbox.config.js`|
|`--help`|`-h`|ヘルプを表示して終了します。|N/A|
|`--version`|`-V`|バージョンを表示して終了します。|N/A|

オプション `--target-service` には下記の値を指定できます。

* `nicolive`: ニコニコ生放送
* `none`: なし (デフォルト値)

## 環境変数

| 環境変数 | 説明 | 注釈 |
|--------|-----|-----|
| `ENGINE_FILES_V3_PATH` | engine-files v3 のビルド成果物のパス。 (e.g. `./engineFilesV3_x_y.js`) <br> この値が指定された場合、 対象の engine-files を akashic-engine v3 コンテンツ実行時に利用します。 | エンジン開発用のオプションです。通常、ゲーム開発時に利用する必要はありません。 |
| `PLAYLOG_CLIENT_PATH` | playlog-client のビルド成果物のパス。 (e.g. `./playlogClientVx_y_z.js`) <br> この値が指定された場合、 `/contents/:contentId/content.raw.json` からも参照され利用されます。 | エンジン開発用のオプションです。通常、ゲーム開発時に利用する必要はありません。 |

## 外部参照できる DOM 要素

akashic-cli-serveの自動実行テストでDOMを参照できるようにするために、以下のように各DOMにclass名を付与しました。

|        class名         |                     要素                     |
| :--------------------: | :------------------------------------------: |
| `external-ref_button_display-option`  | 表示オプションボタン |
| `external-ref_checkbox_shows-background-image` | 背景表示チェックボックス |
| `external-ref_checkbox_shows-grid` | グリッド表示チェックボックス |
| `external-ref_button_select-entity-from-screen` | ゲーム画面からエンティティ選択ボタン |
| `external-ref_button_refresh-entity-tree` | エンティティツリー更新ボタン |
| `external-ref_button_dump-to-console` | 選択エンティティをコンソールにダンプするボタン |
| `external-ref_button_send-event` | イベント送信ボタン |
| `external-ref_button_copy-event` | イベントコピーボタン |
| `external-ref_button_shows-event-list` | イベントリストの表示・非表示を切り替えるボタン |
| `external-ref_button_send-editing-event` | 編集したイベントを送信するボタン |
| `external-ref_button_download-snapshot` | スナップショット保存ボタン |
| `external-ref_button_seek-snapshot` | スナップショットへシークするボタン |
| `external-ref_button_pause` | インスタンスポーズボタン |
| `external-ref_button_real-time-execution` | リアルタイム実行ボタン |
| `external-ref_button_add-instance` | インスタンス追加ボタン |
| `external-ref_checkbox_auto-send-event` | セッションパラメータ送信チェックボックス |
| `external-ref_text_total-time-limit` | 制限時間入力テキストボックス |
| `external-ref_checkbox_use-preferred-total-time-limit` | game.jsonのpreferredSessionParametersの値を利用チェックボックス |
| `external-ref_checkbox_stops-game-on-timeout` | 時間経過後にゲームを停止チェックボックス |
| `external-ref_button_new-play` | 新規プレイ作成ボタン |
| `external-ref_button_active-pause` | アクティブインスタンスをポーズ/解除ボタン |
| `external-ref_button_join-leave` | インスタンスのプレイヤーのJoin/Leaveを送信するボタン |
| `external-ref_button_player-info-accept` | コンテンツでのプレイヤー名表示許諾ボタン |
| `external-ref_button_player-info-reject` | コンテンツでのプレイヤー名表示拒否ボタン |
| `external-ref_img_background` | 背景画像 |
| `external-ref_div_game-content` | コンテンツ表示エリア |
| `external-ref_canvas_grid` | グリッド |
| `external-ref_div_player-info-dialog` | プレイヤー名表示に関するダイアログ |
| `external-ref_checkbox_joins-automatically` | 自動的にJoinするチェックボックス |
| `external-ref_button_start-content` | コンテンツ開始ボタン |
| `external-ref_button_dev-tools` | Devtools表示ボタン |

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
npm run copy:agv
```

## Docker での起動

以下コマンドで Docker イメージを作成します。

```sh
docker build -t akashic-cli-serve .
```

その後 Docker コンテナを起動してください。

```sh
docker run \
  -p 3300:3300 \
  --name akashic-cli-serve \
  --rm \
  -it \
  --mount type=bind,src=/path/to/game,dst=/game,readonly akashic-cli-serve
```

`--mount` の `src` にコンテンツの絶対パス (`game.json` が存在するディレクトリ) を指定してください。
`akashic-cli-serve` への引数を省略すると、 Docker コンテナ内部の `/game` をデフォルトのコンテンツのパスとして実行します。

カレントディレクトリに `game.json` が存在する場合、Linux では以下のように実行できます。

```sh
docker run \
  -p 3300:3300 \
  --name akashic-cli-serve \
  --rm \
  -it \
  --mount type=bind,src=$(pwd),dst=/game,readonly akashic-cli-serve
```

任意のオプション引数を `akashic-cli-serve` へ与える場合、`akashic-cli-serve` に対してコンテンツのパスを引数として明示的に指定してください。
以下は `akashic-cli-serve` へ `--verbose` オプションを与えて実行する例です。
Docker コンテナ内の `/game` をコンテンツのパスとして末尾で指定している点に注意してください。

```sh
docker run \
  -p 3300:3300 \
  --name serve \
  --rm \
  -it \
  --mount type=bind,src=/path/to/game,dst=/game,readonly akashic-cli-serve \
  --verbose /game
```

Windows 環境においては
[バインドマウントの利用](https://docs.docker.com/storage/bind-mounts/#start-a-container-with-a-bind-mount)
および
[Windows におけるパス変換](https://docs.docker.com/desktop/troubleshoot/topics/#path-conversion-on-windows)
を参考に適宜コンテンツのパスを変換してください。

Mac の Apple Silicon (M1/M2) 環境において正常にビルドできない場合は Docker のベースイメージのアーキテクチャを `linux/amd64` に指定してください。

```Dockerfile
FROM --platform=linux/amd64 node:***
```

また、起動時に `--platform=linux/amd64` をオプションに加えてください。

```sh
docker run \
  --platform linux/x86_64 \
  ...
```

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
