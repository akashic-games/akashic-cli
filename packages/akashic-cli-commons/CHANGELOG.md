# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.19](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-commons@0.2.18...@akashic/akashic-cli-commons@0.2.19) (2019-04-03)

**Note:** Version bump only for package @akashic/akashic-cli-commons





## [0.2.18](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-commons@0.2.17...@akashic/akashic-cli-commons@0.2.18) (2019-03-28)

**Note:** Version bump only for package @akashic/akashic-cli-commons





## [0.2.17](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-commons@0.2.16...@akashic/akashic-cli-commons@0.2.17) (2019-03-18)


### Bug Fixes

* fix warning section at npm audit ([#41](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/41)) ([f476fd8](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/f476fd8))





## [0.2.16](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-commons@0.2.15...@akashic/akashic-cli-commons@0.2.16) (2019-03-12)

**Note:** Version bump only for package @akashic/akashic-cli-commons





## [0.2.15](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-commons@0.2.14...@akashic/akashic-cli-commons@0.2.15) (2019-03-06)


### Bug Fixes

* allow same asset filepath when export zip  ([#40](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/40)) ([8a26c0b](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/8a26c0b))





## [0.2.14](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-commons@0.2.13...@akashic/akashic-cli-commons@0.2.14) (2019-03-04)


### Bug Fixes

* delete unnecessary files and make test work ([#31](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/31)) ([4517689](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/4517689))





## 0.2.13 (2019-02-22)

### Features

* Make akashic-cli mono-repo ([#30](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/30)) ([fd5aa71](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/fd5aa71))

## 0.2.12
* ビルドツールの変更

## 0.2.11
* 対象のコードがes5構文に沿っているかを判定する関数の追加

## 0.2.10
* `Renamer` のハッシュ化でディレクトリもハッシュ化する

## 0.2.9
* `Renamer` がgame.jsonの `moduleMainScripts` のファイル名をハッシュ化してしまう問題を修正

## 0.2.8
* game.json のハッシュ化処理が誤っていた問題を修正

## 0.2.7
* `Renamer#renameAssetFilenames()` がオーディオアセットを正常に変換できない問題を解決

## 0.2.6
* `Renamer` を追加

## 0.2.5
* version 0.2.4 が正しくパブリッシュ出来ていなかったのを修正

## 0.2.4
* `NodeModules#listModuleMainScripts()` を追加

## 0.2.3
* `NodeModules#_listPackageJsonsFromScriptsPath()` を `NodeModules#listPackageJsonsFromScriptsPath()` に変更
* `NodeModules#_listScriptFiles()` を `NodeModules#listScriptFiles()` に変更
* `GameConfiguration#ModuleMainScripts` を追加

## 0.2.2

* game.json に environment メンバを追加

## 0.2.1
* `NodeModules#listModuleFiles()` がモジュール名だけでなくファイル名を受け付けられるように
* `NodeModules#listModuleFiles()` がコアモジュールを検出した時、エラーでなく警告するように

## 0.2.0
* Npmモジュールへの依存をやめ、execを利用
* Node.js 7 対応

## 0.1.3
* 初期リリース
