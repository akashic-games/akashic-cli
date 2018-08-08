# CHANGELOG

## 1.3.2
* 各種依存モジュールの更新

## 1.3.1
* 依存モジュール更新: @akashic/akashic-cli-export-html@0.1.22

## 1.3.0

* 依存モジュール更新
  * @akashic/akashic-cli-commons@0.2.5
  * @akashic/akashic-cli-scan@0.2.1
  * @akashic/akashic-cli-install@0.3.1
  * @akashic/akashic-cli-uninstall@0.3.0
  * @akashic/akashic-cli-export-zip@0.1.11
  * @akashic/akashic-cli-export-zip@0.2.0
* これにより、以下の変更が行われます。
  * akashic scan, install, uninstall が game.json の moduleMainScripts フィールドを作成・更新・削除するように
  * akashic export zip に --minify オプション追加
  * akashic export html に --bundle, --minify, --strip オプション追加
* moduleMainScripts を含む game.json を扱うために、 akashic-engine@1.12.7 以降または akashic-engine@2.0.2 以降が必要になります。

## 1.2.1
* publish失敗の修正
  * 機能変更はありません

## 1.2.0
* 依存モジュール更新: akashic-cli-init@0.3.0

## 1.1.4
* 依存モジュール更新: akashic-cli-scan@0.1.2

## 1.1.3
* publish失敗の修正
  * 機能変更はありません

## 1.1.2
* submoduleのバージョンアップ

## 1.1.1
* ヘルプの一部が正しくない問題を修正

## 1.1.0

* Node.js 7 対応

## 1.0.8

* 初期リリース
