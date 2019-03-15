# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.5.12](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.11...@akashic/akashic-cli@1.5.12) (2019-03-15)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.11](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.10...@akashic/akashic-cli@1.5.11) (2019-03-15)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.10](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.9...@akashic/akashic-cli@1.5.10) (2019-03-13)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.9](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.8...@akashic/akashic-cli@1.5.9) (2019-03-12)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.8](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.7...@akashic/akashic-cli@1.5.8) (2019-03-11)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.7](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.6...@akashic/akashic-cli@1.5.7) (2019-03-07)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.6](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.5...@akashic/akashic-cli@1.5.6) (2019-03-06)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.5](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.4...@akashic/akashic-cli@1.5.5) (2019-03-04)


### Bug Fixes

* delete unnecessary files and make test work ([#31](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/31)) ([4517689](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/4517689))





## [1.5.4](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.3...@akashic/akashic-cli@1.5.4) (2019-02-28)

**Note:** Version bump only for package @akashic/akashic-cli





## [1.5.3](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli@1.5.2...@akashic/akashic-cli@1.5.3) (2019-02-27)

**Note:** Version bump only for package @akashic/akashic-cli





## 1.5.2 (2019-02-22)


### Features

* Make akashic-cli mono-repo ([#30](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/30)) ([fd5aa71](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/fd5aa71))





## 1.5.1
* `serve` コマンドを追加
* 依存モジュール追加: @akashic/akashic-cli-serve@0.0.6

## 1.5.0
* 依存モジュール更新: @akashic/akashic-cli-export-html@0.2.0

## 1.4.0
* 依存モジュール更新: @akashic/akashic-cli-export-zip@0.3.0
  * これにより、以下の変更が行われます。
    * `--force` オプションを追加
      * このオプションが与えられない場合、出力先ディレクトリ名またはファイル名が既に存在する場合、エラーになります
    * npm auditで警告がでているモジュールの更新
      * モジュールの更新で `archiver#bulk()` が廃止されていたため `archiver#file()` に修正
    * 参照されないスクリプトアセットを非グローバル化

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
