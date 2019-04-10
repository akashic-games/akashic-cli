# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.16](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.15...@akashic/akashic-cli-init@0.3.16) (2019-04-05)

**Note:** Version bump only for package @akashic/akashic-cli-init





## [0.3.15](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.14...@akashic/akashic-cli-init@0.3.15) (2019-04-03)

**Note:** Version bump only for package @akashic/akashic-cli-init





## [0.3.14](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.13...@akashic/akashic-cli-init@0.3.14) (2019-04-02)


### Bug Fixes

* fix where os.tmpdir() is used ([#55](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/55)) ([8701ec7](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/8701ec7))





## [0.3.13](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.12...@akashic/akashic-cli-init@0.3.13) (2019-03-28)

**Note:** Version bump only for package @akashic/akashic-cli-init





## [0.3.12](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.11...@akashic/akashic-cli-init@0.3.12) (2019-03-22)


### Features

* use jest in akashic-cli-init template ([#50](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/50)) ([4b3f90e](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/4b3f90e))





## [0.3.11](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.10...@akashic/akashic-cli-init@0.3.11) (2019-03-18)


### Bug Fixes

* fix warning section at npm audit ([#41](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/41)) ([f476fd8](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/f476fd8))





## [0.3.10](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.9...@akashic/akashic-cli-init@0.3.10) (2019-03-13)


### Bug Fixes

* npm script of zip in Akashic-cli-init ([#39](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/39)) ([60f7013](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/60f7013))





## [0.3.9](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.8...@akashic/akashic-cli-init@0.3.9) (2019-03-12)

**Note:** Version bump only for package @akashic/akashic-cli-init





## [0.3.8](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.7...@akashic/akashic-cli-init@0.3.8) (2019-03-06)

**Note:** Version bump only for package @akashic/akashic-cli-init





## [0.3.7](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-init@0.3.6...@akashic/akashic-cli-init@0.3.7) (2019-03-04)


### Bug Fixes

* delete unnecessary files and make test work ([#31](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/31)) ([4517689](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/4517689))





## 0.3.6 (2019-02-22)


### Features

* Make akashic-cli mono-repo ([#30](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/30)) ([fd5aa71](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/fd5aa71))





## 0.3.5
* javascriptテンプレートのREADMEを更新

## 0.3.4
* javascriptテンプレートを更新
  * スクリプトファイルをlintしてES5構文になっているかチェックする機能を追加

## 0.3.3
* コピー先に既存のファイルが存在する場合は、デフォルトでは処理を中断するように修正
* forceオプションを追加。
  * このオプションを指定した場合、コピー先の既存ファイルも上書きされます
* 各種依存モジュールの更新

## 0.3.2
* テンプレートを更新

## 0.3.1
* テンプレートを更新

## 0.3.0
* デフォルトで akashic-engine@2.0.0 を利用したテンプレートを出力するように

## 0.2.6
* ユーザーホームディレクトリのビルトインテンプレートを利用しない
  * テンプレートタイプに akashic-cli-init ビルトインの `javascript` `typescript` が指定された場合、ユーザーホームディレクトリに古いテンプレートが残っていても利用しないようになります。
    * これにより、 akashic-cli-init は常に最新のテンプレートを出力するようになります。

## 0.2.5
* テンプレートを更新
  * akashic-cli-init@0.2.4 以前のバージョンから 0.2.5 にアップデートする場合、テンプレートの更新を反映するには、ユーザーホームディレクトリにある `.akashic-templates` ディレクトリを削除する必要があります。

## 0.2.4
* --list オプションの有効化

## 0.2.3
* templatesをzipで持たないようにする対応

## 0.2.2
* typescript テンプレートを更新
  * テンプレートの更新を反映するには、 `npm install @akashic/akashic-cli` を実行し、 `~/.akashic-templates` を削除した後、 `akashic init` を実行してください。

## 0.2.1
* Node.js 7 で正常に動作しない場合がある問題の対応

## 0.2.0
* Node.js 7 対応

## 0.1.6
* javascript のテンプレートが生成できないバグの修正

## 0.1.5
* template.json のガイドメッセージ表示機能を追加

## 0.1.4
* 初期リリース
