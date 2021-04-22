<p align="center">
  <img src="https://github.com/akashic-games/akashic-cli/blob/master/img/akashic-cli.png"/>
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
|`--no-auto-start`|`-A`|ブラウザを開いた時、コンテンツを自動開始しないようにします。|N/A|
|`--help`|`-h`|ヘルプを表示して終了します。|N/A|
|`--version`|`-V`|バージョンを表示して終了します。|N/A|
|`--target-service`|`-s`|ブラウザを開いた時、引数で指定したサービスのモードで開始します。|`none`|
|`--allow-external`|N/A|`外部アセットを許可します。許可する値は sandbox.config.js から読み込みます。|N/A|
|`--no-open-browser`|N/A|起動時に自動でブラウザを開かないようにします。|N/A|
|`--preserve-disconnected`|N/A|サーバ切断時に開いている子ウィンドウを閉じないようにします。|N/A|
|`--experimental-open <num>`|N/A|起動時に子ウィンドウを指定数開いて起動します。上限は 10 です。試験中の機能です。通常、利用しないでください。|N/A|

## 環境変数

| 環境変数 | 説明 | 注釈 |
|--------|-----|-----|
| `ENGINE_FILES_V3_PATH` | engine-files v3 のビルド成果物のパス。 (e.g. `./engineFilesV3_x_y.js`) <br> この値が指定された場合、 対象の engine-files を akashic-engine v3 コンテンツ実行時に利用します。 | エンジン開発用のオプションです。通常、ゲーム開発時に利用する必要はありません。 |

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

## ライセンス

本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。
