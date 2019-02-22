# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.0.9 (2019-02-22)


### Features

* Make akashic-cli mono-repo ([#30](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/30)) ([fd5aa71](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/fd5aa71))





## 0.0.8
* サーバー起動時にホスト名を指定しないとホストPC以外でアクセスできなくなる問題の修正
* 内部APIのエンドポイントを以下のように変更
  * /config/engine => /config/content.json
  * /config/engine/raw => /config/content.raw.json
* サーバーのコンソール上にログ出力するオプションを追加
  * オプション未使用時は、warn と error 以外のログ出力が行われないようになった

## 0.0.7
* サーバーにキャッシュを削除する機構を追加
* push通信テストが動かなくなっていたので修正

## 0.0.6
* require()できない問題を修正
* アイコンが正しく反映されていない問題を修正

## 0.0.5
* 初期リリース
