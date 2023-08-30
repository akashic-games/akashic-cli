# CHANGELOG

## 2.16.42 (2023-08-30)

#### Bug Fix
* `akashic-cli-serve`
  * [#1270](https://github.com/akashic-games/akashic-cli/pull/1270) Fix consolelog dump for serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* `akashic-cli-serve`
  * [#1265](https://github.com/akashic-games/akashic-cli/pull/1265) feat(serve): add Dockerfile ([@yu-ogi](https://github.com/yu-ogi))
* Other
  * [#1266](https://github.com/akashic-games/akashic-cli/pull/1266) chore(serve): add build test for Dockerfile ([@yu-ogi](https://github.com/yu-ogi))

#### Update Dependencies
* Other
  * [#1267](https://github.com/akashic-games/akashic-cli/pull/1267) chore(deps): update docker/setup-buildx-action action to v2 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#1268](https://github.com/akashic-games/akashic-cli/pull/1268) chore(deps): update node.js to v20 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.41 (2023-08-24)

#### Other Change
* `akashic-cli-scan`
  * [#1262](https://github.com/akashic-games/akashic-cli/pull/1262) enable strict in akashic-cli-scan ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.40 (2023-08-23)

#### Update Dependencies
* `akashic-cli-scan`, `akashic-cli-serve`
  * [#1263](https://github.com/akashic-games/akashic-cli/pull/1263) fix(deps): update dependency @akashic/headless-driver to v2.9.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.16.39 (2023-08-02)

#### Other Change
* `akashic-cli-extra`, `akashic-cli-lib-manage`
  * [#1261](https://github.com/akashic-games/akashic-cli/pull/1261) Support editorconfig for install and modify ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1260](https://github.com/akashic-games/akashic-cli/pull/1260) chore(deps): update dependency @akashic/game-configuration to v2.0.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.38 (2023-07-28)

#### Enhancement
* `akashic-cli-serve`
  * [#1259](https://github.com/akashic-games/akashic-cli/pull/1259) Support shouMenu of sandbox.config.js in serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.37 (2023-07-27)

#### Other Change
* `akashic-cli-export`
  * [#1257](https://github.com/akashic-games/akashic-cli/pull/1257) Add game.json validation for export-zip nicolive option ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.36 (2023-07-18)

#### Bug Fix
* `akashic-cli-export`
  * [#1255](https://github.com/akashic-games/akashic-cli/pull/1255) Fix to enable hash-length in nicolive option of export-zip ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.35 (2023-07-11)

#### Enhancement
* `akashic-cli-serve`
  * [#1253](https://github.com/akashic-games/akashic-cli/pull/1253) feat(serve): support ScriptAsset#exports ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.34 (2023-07-04)

#### Bug Fix
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1251](https://github.com/akashic-games/akashic-cli/pull/1251) fix(export): fix crash on --hash-filename and hint.extensions ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.33 (2023-06-30)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-export`
  * [#1250](https://github.com/akashic-games/akashic-cli/pull/1250) feat(export): include .m4a files ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.32 (2023-06-26)

#### Enhancement
* `akashic-cli-export`
  * [#1248](https://github.com/akashic-games/akashic-cli/pull/1248) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.7.2, engineFiles@2.2.3, engineFiles@1.2.2) ([@xnv](https://github.com/xnv))
  * [#1246](https://github.com/akashic-games/akashic-cli/pull/1246) Fix export html file copy logic ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1228](https://github.com/akashic-games/akashic-cli/pull/1228) chore(deps): update akashic major/minor dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))


## 2.16.30 (2023-05-26)

#### Bug Fix
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`
  * [#1240](https://github.com/akashic-games/akashic-cli/pull/1240) Fix tests involving NodeModules#extractModuleMainInfo ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-extra`
  * [#1216](https://github.com/akashic-games/akashic-cli/pull/1216) fix(deps): update dependency ini to v4 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1241](https://github.com/akashic-games/akashic-cli/pull/1241) chore(deps): update dependency socket.io-parser to 4.2.3 [security] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.29 (2023-05-22)

#### Enhancement
* `akashic-cli-init`
  * [#1238](https://github.com/akashic-games/akashic-cli/pull/1238) feat(init): template.json の exclude をサポート ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.28 (2023-05-18)

#### Other Change
* `akashic-cli-commons`, `akashic-cli-export`
  * [#1232](https://github.com/akashic-games/akashic-cli/pull/1232) Remove atsumaru option in export html ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.27 (2023-05-11)

#### Bug Fix
* `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1236](https://github.com/akashic-games/akashic-cli/pull/1236) Revert "Update dependency engine.io to 6.4.2 [SECURITY]" ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.26 (2023-05-11)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-export`
  * [#1233](https://github.com/akashic-games/akashic-cli/pull/1233) feat(export): output warning when exporting too large size ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-commons`, `akashic-cli-serve`
  * [#1231](https://github.com/akashic-games/akashic-cli/pull/1231) feat(serve): warn if message event size is too large ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.25 (2023-05-11)

#### Bug Fix
* `akashic-cli-init`
  * [#1234](https://github.com/akashic-games/akashic-cli/pull/1234) chore(init): use unzipper@0.10.11 ([@yu-ogi](https://github.com/yu-ogi))

#### Update Dependencies
* `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1230](https://github.com/akashic-games/akashic-cli/pull/1230) Update dependency engine.io to 6.4.2 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.24 (2023-04-27)

#### Bug Fix
* `akashic-cli-commons`, `akashic-cli-export`
  * [#1229](https://github.com/akashic-games/akashic-cli/pull/1229) Fix scan bug on windows ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* `akashic-cli-serve`
  * [#1225](https://github.com/akashic-games/akashic-cli/pull/1225) Remove atsumaru from serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-scan`
  * [#1226](https://github.com/akashic-games/akashic-cli/pull/1226) Change scan test to jest ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.23 (2023-04-13)

#### Enhancement
* `akashic-cli-export`
  * [#1224](https://github.com/akashic-games/akashic-cli/pull/1224) feat(export): convert character encoding to UTF-8 ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.22 (2023-04-07)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-export`
  * [#1220](https://github.com/akashic-games/akashic-cli/pull/1220) Add --nicolive option to akashic-cli-export-zip ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.21 (2023-04-06)

#### Enhancement
* `akashic-cli-commons`
  * [#1219](https://github.com/akashic-games/akashic-cli/pull/1219) Add parameters for Nicolive to commons ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.20 (2023-04-05)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-serve`
  * [#1221](https://github.com/akashic-games/akashic-cli/pull/1221) feat(serve): add --debug-trusted-iframe option ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.16.19 (2023-04-04)

#### Bug Fix
* `akashic-cli-commons`, `akashic-cli-lib-manage`, `akashic-cli-scan`
  * [#1213](https://github.com/akashic-games/akashic-cli/pull/1213) Fix to add extension to moduleMainScripts in akashic-cli-scan ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1222](https://github.com/akashic-games/akashic-cli/pull/1222) fix(deps): update dependency @akashic/headless-driver to v2.7.3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.18 (2023-03-31)

#### Bug Fix
* `akashic-cli-serve`
  * [#1217](https://github.com/akashic-games/akashic-cli/pull/1217) fix(serve): fix lost join in -s nicolive mode ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.17 (2023-03-17)

#### Enhancement
* `akashic-cli-export`
  * [#1214](https://github.com/akashic-games/akashic-cli/pull/1214) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.6.7, engineFiles@2.2.2, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1198](https://github.com/akashic-games/akashic-cli/pull/1198) chore(deps): update akashic major/minor dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.16 (2023-03-08)

#### Bug Fix
* `akashic-cli-serve`
  * [#1212](https://github.com/akashic-games/akashic-cli/pull/1212) Fix scriptAsset update for watch option in serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.16.15 (2023-03-03)

#### Update Dependencies
* `akashic-cli-serve`
  * [#1211](https://github.com/akashic-games/akashic-cli/pull/1211) chore(deps): update & follow headless-driver@2.6.3 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))


## 2.16.13 (2023-02-20)

#### Bug Fix
* `akashic-cli`
  * [#1207](https://github.com/akashic-games/akashic-cli/pull/1207) Fix subcommand version for akashic-cli ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.12 (2023-02-09)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-serve`
  * [#1203](https://github.com/akashic-games/akashic-cli/pull/1203) faet(serve): add --debug-pause-active ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1204](https://github.com/akashic-games/akashic-cli/pull/1204) fix(deps): update dependency @akashic/headless-driver to v2.6.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.11 (2023-01-31)

#### Bug Fix
* `akashic-cli-serve`
  * [#1202](https://github.com/akashic-games/akashic-cli/pull/1202) Fix bug in experimental-open option ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.10 (2023-01-27)

#### Enhancement
* `akashic-cli-export`
  * [#1200](https://github.com/akashic-games/akashic-cli/pull/1200) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.6.2, engineFiles@2.2.2, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1199](https://github.com/akashic-games/akashic-cli/pull/1199) fix(deps): update dependency @akashic/headless-driver to v2.5.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.16.9 (2023-01-20)

#### Other Change
* `akashic-cli-serve`
  * [#1189](https://github.com/akashic-games/akashic-cli/pull/1189) Mod local sendEvent in serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1196](https://github.com/akashic-games/akashic-cli/pull/1196) fix(deps): update dependency @akashic/headless-driver to v2.5.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.16.8 (2023-01-16)

#### Enhancement
* `akashic-cli-export`
  * [#1195](https://github.com/akashic-games/akashic-cli/pull/1195) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.6.0, engineFiles@2.2.2, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1193](https://github.com/akashic-games/akashic-cli/pull/1193) chore(deps): update akashic major/minor dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.7 (2023-01-12)

#### Bug Fix
* `akashic-cli-serve`
  * [#1191](https://github.com/akashic-games/akashic-cli/pull/1191) chore(serve): ゲームコンテンツ読み込み時のエラーを表示 ([@yu-ogi](https://github.com/yu-ogi))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1192](https://github.com/akashic-games/akashic-cli/pull/1192) fix(deps): update dependency @akashic/headless-driver to v2.4.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- [@yu-ogi](https://github.com/yu-ogi)


## 2.16.5 (2022-12-12)

#### Bug Fix
* `akashic-cli-serve`
  * [#1180](https://github.com/akashic-games/akashic-cli/pull/1180) Fix strict for serve client ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* `akashic-cli-serve`
  * [#1181](https://github.com/akashic-games/akashic-cli/pull/1181) Merge pull request #1172 from akashic-games/enable-strict-for-server-… ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#1172](https://github.com/akashic-games/akashic-cli/pull/1172) Enable strict for server side ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#1167](https://github.com/akashic-games/akashic-cli/pull/1167) Enable strict for akashic-cli-serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.16.4 (2022-12-09)

#### Enhancement
* `akashic-cli-export`
  * [#1186](https://github.com/akashic-games/akashic-cli/pull/1186) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.5.0, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-serve`
  * [#1184](https://github.com/akashic-games/akashic-cli/pull/1184) Update akashic major/minor dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.16.3 (2022-12-05)

#### Enhancement
* `akashic-cli-export`
  * [#1182](https://github.com/akashic-games/akashic-cli/pull/1182) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.4.0, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-lib-manage`
  * [#1177](https://github.com/akashic-games/akashic-cli/pull/1177) enable strict for akashic-lib-manage ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-serve`
  * [#1176](https://github.com/akashic-games/akashic-cli/pull/1176) Update akashic major/minor dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1174](https://github.com/akashic-games/akashic-cli/pull/1174) Update dependency @typescript-eslint/eslint-plugin to v5.43.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.16.2 (2022-11-11)

#### Other Change
* `akashic-cli-serve`
  * [#1173](https://github.com/akashic-games/akashic-cli/pull/1173) Revert serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.1 (2022-11-11)

#### Other Change
* `akashic-cli-serve`
  * [#1172](https://github.com/akashic-games/akashic-cli/pull/1172) Enable strict for server side ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#1167](https://github.com/akashic-games/akashic-cli/pull/1167) Enable strict for akashic-cli-serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1107](https://github.com/akashic-games/akashic-cli/pull/1107) Update akashic major/minor dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1171](https://github.com/akashic-games/akashic-cli/pull/1171) Update dependency eslint to v8.27.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1169](https://github.com/akashic-games/akashic-cli/pull/1169) Update dependency @typescript-eslint/eslint-plugin to v5.42.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-export`
  * [#1170](https://github.com/akashic-games/akashic-cli/pull/1170) Update all dependencies to v7.20.2 (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.16.0 (2022-11-01)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`
  * [#1166](https://github.com/akashic-games/akashic-cli/pull/1166) Update dependency mock-fs to v5.2.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1165](https://github.com/akashic-games/akashic-cli/pull/1165) Update dependency @akashic/eslint-config to v1.1.1 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1164](https://github.com/akashic-games/akashic-cli/pull/1164) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.15.85 (2022-10-24)

#### Enhancement
* `akashic-cli-serve`
  * [#1161](https://github.com/akashic-games/akashic-cli/pull/1161) Add send local events ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* `akashic-cli-serve`
  * [#1162](https://github.com/akashic-games/akashic-cli/pull/1162) Mod engine-files alias ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1163](https://github.com/akashic-games/akashic-cli/pull/1163) Update dependency eslint to v8.26.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.84 (2022-10-21)

#### Enhancement
* `akashic-cli-serve`
  * [#1160](https://github.com/akashic-games/akashic-cli/pull/1160) add button to send event for test in akashic-cli-serve ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.15.83 (2022-10-17)

#### Bug Fix
* `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1159](https://github.com/akashic-games/akashic-cli/pull/1159) Fix error when akashic.config.js has no commandOptions ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.82 (2022-10-14)

#### Enhancement
* `akashic-cli-serve`
  * [#1157](https://github.com/akashic-games/akashic-cli/pull/1157) Use sandboxConfig windowSize in Serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.81 (2022-10-12)

#### Bug Fix
* `akashic-cli-serve`
  * [#1158](https://github.com/akashic-games/akashic-cli/pull/1158) Bug fix for SandboxConfigs in serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.80 (2022-10-12)

#### Bug Fix
* `akashic-cli-serve`
  * [#1156](https://github.com/akashic-games/akashic-cli/pull/1156) Mod serve package.json ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.79 (2022-10-12)

#### Enhancement
* `akashic-cli-serve`
  * [#1147](https://github.com/akashic-games/akashic-cli/pull/1147) Use displayOption of sandbox.config.js with serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Bug Fix
* `akashic-cli-serve`
  * [#1154](https://github.com/akashic-games/akashic-cli/pull/1154) Fix serve display bug ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1155](https://github.com/akashic-games/akashic-cli/pull/1155) Update dependency @typescript-eslint/eslint-plugin to v5.40.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1153](https://github.com/akashic-games/akashic-cli/pull/1153) Update dependency eslint to v8.25.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.78 (2022-10-06)

#### Enhancement
* `akashic-cli-export`
  * [#1152](https://github.com/akashic-games/akashic-cli/pull/1152) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.3.4, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1151](https://github.com/akashic-games/akashic-cli/pull/1151) Update dependency @akashic/headless-driver to v2.2.3 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1148](https://github.com/akashic-games/akashic-cli/pull/1148) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.15.77 (2022-09-29)

#### Other Change
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1144](https://github.com/akashic-games/akashic-cli/pull/1144) Enable strict for cli commons ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-serve`
  * [#1146](https://github.com/akashic-games/akashic-cli/pull/1146) Update dependency @akashic/headless-driver to v2.2.2 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1145](https://github.com/akashic-games/akashic-cli/pull/1145) Update dependency vm2 to 3.9.11 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1142](https://github.com/akashic-games/akashic-cli/pull/1142) Update dependency eslint to v8.24.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1141](https://github.com/akashic-games/akashic-cli/pull/1141) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.76 (2022-09-21)

#### Enhancement
* `akashic-cli-serve`
  * [#1127](https://github.com/akashic-games/akashic-cli/pull/1127) Support math random warning ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* `akashic-cli-serve`
  * [#1129](https://github.com/akashic-games/akashic-cli/pull/1129) Remove engineFilesVx_x_x.js and engineFilesVersion.json ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* Other
  * [#1139](https://github.com/akashic-games/akashic-cli/pull/1139) Update dependency parse-url to 8.1.0 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-export`, `akashic-cli-serve`
  * [#1138](https://github.com/akashic-games/akashic-cli/pull/1138) Update dependency uglify-js to v3.17.1 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1137](https://github.com/akashic-games/akashic-cli/pull/1137) Update dependency @typescript-eslint/eslint-plugin to v5.38.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1134](https://github.com/akashic-games/akashic-cli/pull/1134) Update dependency @typescript-eslint/eslint-plugin to v5.37.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1133](https://github.com/akashic-games/akashic-cli/pull/1133) Update dependency eslint to v8.23.1 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1120](https://github.com/akashic-games/akashic-cli/pull/1120) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-scan`
  * [#1136](https://github.com/akashic-games/akashic-cli/pull/1136) Update dependency music-metadata to v7.13.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-serve`, `akashic-cli`
  * [#1135](https://github.com/akashic-games/akashic-cli/pull/1135) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1130](https://github.com/akashic-games/akashic-cli/pull/1130) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#1131](https://github.com/akashic-games/akashic-cli/pull/1131) Update dependency eslint-plugin-react to v7.31.8 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1125](https://github.com/akashic-games/akashic-cli/pull/1125) Update dependency eslint-plugin-react to v7.31.6 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1124](https://github.com/akashic-games/akashic-cli/pull/1124) Update dependency eslint-plugin-react to v7.31.5 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1123](https://github.com/akashic-games/akashic-cli/pull/1123) Update dependency @msgpack/msgpack to v2.8.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-export`
  * [#1128](https://github.com/akashic-games/akashic-cli/pull/1128) Update all dependencies to v7.19.0 (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1126](https://github.com/akashic-games/akashic-cli/pull/1126) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1119](https://github.com/akashic-games/akashic-cli/pull/1119) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.75 (2022-08-29)

#### Enhancement
* `akashic-cli-serve`
  * [#1114](https://github.com/akashic-games/akashic-cli/pull/1114) Support server.external in akashic-cli-serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1118](https://github.com/akashic-games/akashic-cli/pull/1118) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1116](https://github.com/akashic-games/akashic-cli/pull/1116) Update dependency @typescript-eslint/eslint-plugin to v5.34.0 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1111](https://github.com/akashic-games/akashic-cli/pull/1111) Update dependency eslint-plugin-jest to v26.8.5 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1110](https://github.com/akashic-games/akashic-cli/pull/1110) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#1117](https://github.com/akashic-games/akashic-cli/pull/1117) Update dependency @types/node to v16.11.56 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1109](https://github.com/akashic-games/akashic-cli/pull/1109) Update dependency @types/node to v16.11.50 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-serve`, `akashic-cli`
  * [#1115](https://github.com/akashic-games/akashic-cli/pull/1115) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1113](https://github.com/akashic-games/akashic-cli/pull/1113) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1106](https://github.com/akashic-games/akashic-cli/pull/1106) Update all dependencies to v3.17.0 (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`
  * [#1108](https://github.com/akashic-games/akashic-cli/pull/1108) Update dependency @types/eslint to v8.4.6 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.74 (2022-08-17)

#### Other Change
* `akashic-cli-serve`
  * [#1105](https://github.com/akashic-games/akashic-cli/pull/1105) Use sandbox configration ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1104](https://github.com/akashic-games/akashic-cli/pull/1104) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1098](https://github.com/akashic-games/akashic-cli/pull/1098) Update dependency eslint-plugin-jest to v26.8.2 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1103](https://github.com/akashic-games/akashic-cli/pull/1103) Update dependency eslint-plugin-jest to v26.8.3 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1102](https://github.com/akashic-games/akashic-cli/pull/1102) Update dependency eslint to v8.22.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#1101](https://github.com/akashic-games/akashic-cli/pull/1101) Update dependency material-icons to v1.11.10 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1100](https://github.com/akashic-games/akashic-cli/pull/1100) Update dependency @types/node to v16.11.48 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1099](https://github.com/akashic-games/akashic-cli/pull/1099) Update dependency material-icons to v1.11.9 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.73 (2022-08-09)

#### Enhancement
* `akashic-cli-export`
  * [#1097](https://github.com/akashic-games/akashic-cli/pull/1097) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.2.4, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1079](https://github.com/akashic-games/akashic-cli/pull/1079) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#1096](https://github.com/akashic-games/akashic-cli/pull/1096) Update dependency @akashic/headless-driver to v2.1.3 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1086](https://github.com/akashic-games/akashic-cli/pull/1086) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.72 (2022-08-08)

#### Enhancement
* `akashic-cli-serve`
  * [#1090](https://github.com/akashic-games/akashic-cli/pull/1090) fix false positive and add warn.drawOutOfCanvas on sandboxConfig ([@dera-](https://github.com/dera-))

#### Bug Fix
* `akashic-cli-serve`
  * [#1090](https://github.com/akashic-games/akashic-cli/pull/1090) fix false positive and add warn.drawOutOfCanvas on sandboxConfig ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-serve`
  * [#1089](https://github.com/akashic-games/akashic-cli/pull/1089) Use engine files alias for serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* Other
  * [#1091](https://github.com/akashic-games/akashic-cli/pull/1091) Mod renovate rule ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-scan`
  * [#1088](https://github.com/akashic-games/akashic-cli/pull/1088) Update dependency file-type to 16.5.4 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli`
  * [#1094](https://github.com/akashic-games/akashic-cli/pull/1094) Update dependency @akashic/game-configuration to v1.4.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@dera-](https://github.com/dera-)

## 2.15.71 (2022-07-27)

#### Enhancement
* `akashic-cli-serve`
  * [#1087](https://github.com/akashic-games/akashic-cli/pull/1087) feat(serve): イベント送信用のAPIを加える ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.70 (2022-07-15)

#### Enhancement
* `akashic-cli-serve`
  * [#1085](https://github.com/akashic-games/akashic-cli/pull/1085) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.2.3, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#1084](https://github.com/akashic-games/akashic-cli/pull/1084) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.2.3, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1081](https://github.com/akashic-games/akashic-cli/pull/1081) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.69 (2022-06-30)

#### Enhancement
* `akashic-cli-serve`
  * [#1083](https://github.com/akashic-games/akashic-cli/pull/1083) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.2.2, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#1082](https://github.com/akashic-games/akashic-cli/pull/1082) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.2.2, engineFiles@2.2.1, engineFiles@1.2.1) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1078](https://github.com/akashic-games/akashic-cli/pull/1078) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))


## 2.15.67 (2022-05-30)

#### Other Change
* `akashic-cli-scan`
  * [#1077](https://github.com/akashic-games/akashic-cli/pull/1077) akashic-cli-scanのテストが手元で落ちていたので通るように修正 ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.15.66 (2022-05-23)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#1071](https://github.com/akashic-games/akashic-cli/pull/1071) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1072](https://github.com/akashic-games/akashic-cli/pull/1072) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.15.65 (2022-04-28)

#### Bug Fix
* `akashic-cli-serve`
  * [#1073](https://github.com/akashic-games/akashic-cli/pull/1073) Fix duplicate scriptAssets for serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1063](https://github.com/akashic-games/akashic-cli/pull/1063) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1062](https://github.com/akashic-games/akashic-cli/pull/1062) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.15.64 (2022-04-21)

#### Enhancement
* `akashic-cli-serve`
  * [#1061](https://github.com/akashic-games/akashic-cli/pull/1061) Support local filepath for bgimage in serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#1070](https://github.com/akashic-games/akashic-cli/pull/1070) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.2.0, engineFiles@2.2.0, engineFiles@1.2.0) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#1069](https://github.com/akashic-games/akashic-cli/pull/1069) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.2.0, engineFiles@2.2.0, engineFiles@1.2.0) ([@xnv](https://github.com/xnv))
  * [#1068](https://github.com/akashic-games/akashic-cli/pull/1068) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.9, engineFiles@2.2.0, engineFiles@1.2.0) ([@xnv](https://github.com/xnv))
  * [#1067](https://github.com/akashic-games/akashic-cli/pull/1067) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.9, engineFiles@2.1.57, engineFiles@1.2.0) ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.15.63 (2022-04-20)

#### Enhancement
* `akashic-cli-serve`
  * [#1066](https://github.com/akashic-games/akashic-cli/pull/1066) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.9, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#1064](https://github.com/akashic-games/akashic-cli/pull/1064) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.9, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.62 (2022-04-14)

#### Enhancement
* `akashic-cli-serve`
  * [#1059](https://github.com/akashic-games/akashic-cli/pull/1059) Support for client external plugin with serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1031](https://github.com/akashic-games/akashic-cli/pull/1031) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#1054](https://github.com/akashic-games/akashic-cli/pull/1054) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.61 (2022-04-05)

#### Enhancement
* `akashic-cli-serve`
  * [#1058](https://github.com/akashic-games/akashic-cli/pull/1058) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.8, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#1057](https://github.com/akashic-games/akashic-cli/pull/1057) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.8, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#1056](https://github.com/akashic-games/akashic-cli/pull/1056) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.7, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.15.60 (2022-03-20)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1053](https://github.com/akashic-games/akashic-cli/pull/1053) Update dependency eslint-plugin-jest to v26.1.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.59 (2022-03-19)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli`
  * [#1052](https://github.com/akashic-games/akashic-cli/pull/1052) Update dependency @babel/core to v7.17.8 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.58 (2022-03-18)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1051](https://github.com/akashic-games/akashic-cli/pull/1051) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.57 (2022-03-11)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1049](https://github.com/akashic-games/akashic-cli/pull/1049) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0



## 2.15.55 (2022-03-08)

#### Enhancement
* `akashic-cli-serve`
  * [#1048](https://github.com/akashic-games/akashic-cli/pull/1048) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.54 (2022-03-08)

#### Enhancement
* `akashic-cli-serve`
  * [#1043](https://github.com/akashic-games/akashic-cli/pull/1043) エンティティの範囲外が描画されている時エラーを投げる処理を追加 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.15.53 (2022-03-05)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1045](https://github.com/akashic-games/akashic-cli/pull/1045) Update dependency eslint-plugin-react to v7.29.3 ([@renovate[bot]](https://github.com/apps/renovate))
* Other
  * [#1046](https://github.com/akashic-games/akashic-cli/pull/1046) Update actions/checkout action to v3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.52 (2022-03-03)

#### Enhancement
* `akashic-cli-serve`
  * [#1044](https://github.com/akashic-games/akashic-cli/pull/1044) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.51 (2022-03-03)

#### Other Change
* `akashic-cli-extra`
  * [#1041](https://github.com/akashic-games/akashic-cli/pull/1041) Update eslint-config of extra ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-scan`
  * [#1042](https://github.com/akashic-games/akashic-cli/pull/1042) Update eslint-config of scan ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-commons`, `akashic-cli-init`
  * [#1040](https://github.com/akashic-games/akashic-cli/pull/1040) Update eslint-config of init ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.50 (2022-03-02)

#### Other Change
* `akashic-cli-serve`
  * [#1039](https://github.com/akashic-games/akashic-cli/pull/1039) Update eslint-config of serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-lib-manage`
  * [#1038](https://github.com/akashic-games/akashic-cli/pull/1038) Update eslint-config of lib-manage ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-commons`
  * [#1035](https://github.com/akashic-games/akashic-cli/pull/1035) Update akashic/eslint-config ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.49 (2022-02-28)

#### Enhancement
* `akashic-cli-serve`
  * [#1037](https://github.com/akashic-games/akashic-cli/pull/1037) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.48 (2022-02-28)

#### Enhancement
* `akashic-cli-serve`
  * [#1036](https://github.com/akashic-games/akashic-cli/pull/1036) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.47 (2022-02-28)

#### Other Change
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-scan`
  * [#1028](https://github.com/akashic-games/akashic-cli/pull/1028) Use game configration ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.46 (2022-02-26)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1034](https://github.com/akashic-games/akashic-cli/pull/1034) Update dependency uglify-js to v3.15.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.45 (2022-02-26)

#### Enhancement
* `akashic-cli-serve`
  * [#1033](https://github.com/akashic-games/akashic-cli/pull/1033) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.44 (2022-02-26)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1030](https://github.com/akashic-games/akashic-cli/pull/1030) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* Other
  * [#1032](https://github.com/akashic-games/akashic-cli/pull/1032) Update actions/setup-node action to v3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.43 (2022-02-23)

#### Enhancement
* `akashic-cli-serve`
  * [#1029](https://github.com/akashic-games/akashic-cli/pull/1029) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.42 (2022-02-19)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1027](https://github.com/akashic-games/akashic-cli/pull/1027) Update dependency eslint-config-prettier to v8.4.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.41 (2022-02-19)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1024](https://github.com/akashic-games/akashic-cli/pull/1024) Pin dependencies ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.40 (2022-02-18)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1025](https://github.com/akashic-games/akashic-cli/pull/1025) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.39 (2022-02-18)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1026](https://github.com/akashic-games/akashic-cli/pull/1026) Update dependency @types/node-fetch to v2.6.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.38 (2022-02-16)

#### Other Change
* `akashic-cli-init`
  * [#999](https://github.com/akashic-games/akashic-cli/pull/999) Enable strict for init ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.37 (2022-02-16)

#### Other Change
* `akashic-cli-extra`
  * [#1000](https://github.com/akashic-games/akashic-cli/pull/1000) Enable strict for extra ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.36 (2022-02-16)

#### Other Change
* `akashic-cli-serve`
  * [#1022](https://github.com/akashic-games/akashic-cli/pull/1022) Use material icons with serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-commons`
  * [#1001](https://github.com/akashic-games/akashic-cli/pull/1001) Fix by akashic-init strict ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.35 (2022-02-15)

#### Enhancement
* `akashic-cli-serve`
  * [#1023](https://github.com/akashic-games/akashic-cli/pull/1023) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-commons`, `akashic-cli-export`
  * [#998](https://github.com/akashic-games/akashic-cli/pull/998) feat(export): add --pack-image option for export-zip ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-commons`
  * [#1002](https://github.com/akashic-games/akashic-cli/pull/1002) fix(common): fix overwritten virtualPath on Renamer ([@xnv](https://github.com/xnv))

#### Update Dependencies
* [#1021](https://github.com/akashic-games/akashic-cli/pull/1021) Update dependency tar [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.34 (2022-02-12)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1020](https://github.com/akashic-games/akashic-cli/pull/1020) Update dependency tar to 6.1.9 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.33 (2022-02-12)

#### Update Dependencies
* `akashic-cli-serve`
  * [#901](https://github.com/akashic-games/akashic-cli/pull/901) Update dependency tar [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.32 (2022-02-12)

#### Update Dependencies
* `akashic-cli-serve`
  * [#1017](https://github.com/akashic-games/akashic-cli/pull/1017) Update dependency webpack-cli to v4.9.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.31 (2022-02-12)

#### Enhancement
* `akashic-cli-serve`
  * [#1019](https://github.com/akashic-games/akashic-cli/pull/1019) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.30 (2022-02-12)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1016](https://github.com/akashic-games/akashic-cli/pull/1016) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.29 (2022-02-11)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1018](https://github.com/akashic-games/akashic-cli/pull/1018) Update dependency ajv to 6.12.3 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.28 (2022-02-10)

#### Enhancement
* `akashic-cli-serve`
  * [#1015](https://github.com/akashic-games/akashic-cli/pull/1015) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.27 (2022-02-10)

#### Enhancement
* `akashic-cli-serve`
  * [#1014](https://github.com/akashic-games/akashic-cli/pull/1014) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.26 (2022-02-10)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1007](https://github.com/akashic-games/akashic-cli/pull/1007) Update dependency ansi-regex to 5.0.1 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.25 (2022-02-10)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-serve`
  * [#1008](https://github.com/akashic-games/akashic-cli/pull/1008) Update dependency cached-path-relative to 1.1.0 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.24 (2022-02-10)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-lib-manage`, `akashic-cli-serve`
  * [#1009](https://github.com/akashic-games/akashic-cli/pull/1009) Update dependency hosted-git-info to 3.0.8 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.23 (2022-02-10)

#### Update Dependencies
* `akashic-cli-serve`
  * [#1010](https://github.com/akashic-games/akashic-cli/pull/1010) Update dependency simple-get to 3.1.1 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.22 (2022-02-09)

#### Update Dependencies
* `akashic-cli-serve`
  * [#1011](https://github.com/akashic-games/akashic-cli/pull/1011) Update dependency ssri to 7.1.1 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.21 (2022-02-09)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1012](https://github.com/akashic-games/akashic-cli/pull/1012) Update dependency trim to 0.0.3 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.20 (2022-02-09)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1013](https://github.com/akashic-games/akashic-cli/pull/1013) Update dependency trim-off-newlines to 1.0.3 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.19 (2022-02-05)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1006](https://github.com/akashic-games/akashic-cli/pull/1006) Update dependency jest to v27.5.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.18 (2022-02-05)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1003](https://github.com/akashic-games/akashic-cli/pull/1003) Pin dependencies ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.17 (2022-02-05)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1004](https://github.com/akashic-games/akashic-cli/pull/1004) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.16 (2022-02-04)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#1005](https://github.com/akashic-games/akashic-cli/pull/1005) Update dependency @babel/core to v7.17.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.15 (2022-02-01)

#### Enhancement
* `akashic-cli-serve`
  * [#997](https://github.com/akashic-games/akashic-cli/pull/997) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#996](https://github.com/akashic-games/akashic-cli/pull/996) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.6, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.14 (2022-01-29)

#### Update Dependencies
* `akashic-cli-serve`
  * [#992](https://github.com/akashic-games/akashic-cli/pull/992) Update dependency @types/react to v16.14.22 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.13 (2022-01-28)

#### Enhancement
* `akashic-cli-serve`
  * [#994](https://github.com/akashic-games/akashic-cli/pull/994) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.5, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.12 (2022-01-28)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#993](https://github.com/akashic-games/akashic-cli/pull/993) Update dependency uglify-js to v3.15.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.11 (2022-01-28)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-export`
  * [#983](https://github.com/akashic-games/akashic-cli/pull/983) Add --debug-override-engine-files option to export html ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.10 (2022-01-22)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#990](https://github.com/akashic-games/akashic-cli/pull/990) Update dependency @babel/core to v7.16.12 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.9 (2022-01-21)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#989](https://github.com/akashic-games/akashic-cli/pull/989) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.8 (2022-01-20)

#### Enhancement
* `akashic-cli-serve`
  * [#988](https://github.com/akashic-games/akashic-cli/pull/988) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.5, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.7 (2022-01-19)

#### Enhancement
* `akashic-cli-serve`
  * [#987](https://github.com/akashic-games/akashic-cli/pull/987) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.5, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-serve`
  * [#979](https://github.com/akashic-games/akashic-cli/pull/979) add serve option to README ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.15.6 (2022-01-18)

#### Enhancement
* `akashic-cli-serve`
  * [#986](https://github.com/akashic-games/akashic-cli/pull/986) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.5, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#985](https://github.com/akashic-games/akashic-cli/pull/985) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.5, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.5 (2022-01-17)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#984](https://github.com/akashic-games/akashic-cli/pull/984) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.4 (2022-01-11)

#### Bug Fix
* `akashic-cli-init`
  * [#977](https://github.com/akashic-games/akashic-cli/pull/977) fix behavior of template.json in init ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.15.3 (2022-01-10)

#### Enhancement
* `akashic-cli-serve`
  * [#982](https://github.com/akashic-games/akashic-cli/pull/982) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.2 (2022-01-07)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#980](https://github.com/akashic-games/akashic-cli/pull/980) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.15.1 (2022-01-05)

#### Enhancement
* `akashic-cli-serve`
  * [#978](https://github.com/akashic-games/akashic-cli/pull/978) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.15.0 (2022-01-04)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-serve`
  * [#918](https://github.com/akashic-games/akashic-cli/pull/918) feat(serve): akashic-cli-serveに外部から接続するための機能を追加 ([@dera-](https://github.com/dera-))
* `akashic-cli-serve`
  * [#960](https://github.com/akashic-games/akashic-cli/pull/960) feat(serve): playlogClientファイルを外部から指定できるようにする対応 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.14.38 (2022-01-04)

#### Enhancement
* `akashic-cli-serve`
  * [#976](https://github.com/akashic-games/akashic-cli/pull/976) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.37 (2022-01-03)

#### Enhancement
* `akashic-cli-serve`
  * [#975](https://github.com/akashic-games/akashic-cli/pull/975) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.36 (2022-01-02)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#974](https://github.com/akashic-games/akashic-cli/pull/974) Update dependency @types/jasmine to v3.10.3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.35 (2022-01-02)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#973](https://github.com/akashic-games/akashic-cli/pull/973) Update dependency jasmine to v3.99.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.34 (2022-01-01)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#972](https://github.com/akashic-games/akashic-cli/pull/972) Update dependency @types/node to v14.18.4 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.33 (2022-01-01)

#### Enhancement
* `akashic-cli-serve`
  * [#971](https://github.com/akashic-games/akashic-cli/pull/971) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.32 (2021-12-31)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#969](https://github.com/akashic-games/akashic-cli/pull/969) Update all dependencies to v7.16.7 (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.31 (2021-12-31)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#970](https://github.com/akashic-games/akashic-cli/pull/970) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.30 (2021-12-31)

#### Enhancement
* `akashic-cli-serve`
  * [#968](https://github.com/akashic-games/akashic-cli/pull/968) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.29 (2021-12-28)

#### Enhancement
* `akashic-cli-serve`
  * [#967](https://github.com/akashic-games/akashic-cli/pull/967) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.28 (2021-12-26)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#966](https://github.com/akashic-games/akashic-cli/pull/966) Update dependency @types/node to v14.18.3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.27 (2021-12-25)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-serve`, `akashic-cli`
  * [#963](https://github.com/akashic-games/akashic-cli/pull/963) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.26 (2021-12-24)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#964](https://github.com/akashic-games/akashic-cli/pull/964) Update dependency eslint-plugin-react to v7.28.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.25 (2021-12-24)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-init`
  * [#916](https://github.com/akashic-games/akashic-cli/pull/916) Mod akashic-init --registry option to --repository ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#953](https://github.com/akashic-games/akashic-cli/pull/953) Save allowed url to akashicrc ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#929](https://github.com/akashic-games/akashic-cli/pull/929) Add confirm of access to unofficial URL in akashic-init ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.14.24 (2021-12-21)

#### Enhancement
* `akashic-cli-serve`
  * [#961](https://github.com/akashic-games/akashic-cli/pull/961) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.14.23 (2021-12-21)

#### Bug Fix
* `akashic-cli-commons`, `akashic-cli-export`
  * [#954](https://github.com/akashic-games/akashic-cli/pull/954) Fix eslint in devdependencies of commons ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.14.22 (2021-12-18)

#### Enhancement
* `akashic-cli-serve`
  * [#959](https://github.com/akashic-games/akashic-cli/pull/959) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.21 (2021-12-17)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#958](https://github.com/akashic-games/akashic-cli/pull/958) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.20 (2021-12-17)

#### Enhancement
* `akashic-cli-serve`
  * [#957](https://github.com/akashic-games/akashic-cli/pull/957) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.19 (2021-12-14)

#### Enhancement
* `akashic-cli-serve`
  * [#955](https://github.com/akashic-games/akashic-cli/pull/955) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.18 (2021-12-11)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#950](https://github.com/akashic-games/akashic-cli/pull/950) Pin dependency @types/jest to 27.0.3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.17 (2021-12-11)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#949](https://github.com/akashic-games/akashic-cli/pull/949) Pin dependency @types/mock-fs to 4.13.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.16 (2021-12-11)

#### Enhancement
* `akashic-cli-init`
  * [#947](https://github.com/akashic-games/akashic-cli/pull/947) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#951](https://github.com/akashic-games/akashic-cli/pull/951) Update dependency typescript to v4.5.3 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#952](https://github.com/akashic-games/akashic-cli/pull/952) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.15 (2021-12-08)

#### Enhancement
* `akashic-cli-serve`
  * [#945](https://github.com/akashic-games/akashic-cli/pull/945) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#944](https://github.com/akashic-games/akashic-cli/pull/944) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-export`
  * [#939](https://github.com/akashic-games/akashic-cli/pull/939) Mock value of akashic-runtime-version-table in export html test ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.14.14 (2021-12-08)

#### Enhancement
* `akashic-cli-serve`
  * [#943](https://github.com/akashic-games/akashic-cli/pull/943) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#942](https://github.com/akashic-games/akashic-cli/pull/942) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#940](https://github.com/akashic-games/akashic-cli/pull/940) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.4, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-init`
  * [#926](https://github.com/akashic-games/akashic-cli/pull/926) Change akashic init test to ts ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.14.13 (2021-12-05)

#### Enhancement
* `akashic-cli-serve`
  * [#938](https://github.com/akashic-games/akashic-cli/pull/938) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.12 (2021-12-04)

#### Enhancement
* `akashic-cli-serve`
  * [#937](https://github.com/akashic-games/akashic-cli/pull/937) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.11 (2021-12-04)

#### Enhancement
* `akashic-cli-serve`
  * [#936](https://github.com/akashic-games/akashic-cli/pull/936) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#935](https://github.com/akashic-games/akashic-cli/pull/935) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.10 (2021-12-04)

#### Enhancement
* `akashic-cli-init`
  * [#934](https://github.com/akashic-games/akashic-cli/pull/934) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#930](https://github.com/akashic-games/akashic-cli/pull/930) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.9 (2021-12-03)

#### Enhancement
* `akashic-cli-init`
  * [#933](https://github.com/akashic-games/akashic-cli/pull/933) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#931](https://github.com/akashic-games/akashic-cli/pull/931) Update dependency @types/node to v14.18.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.8 (2021-12-03)

#### Enhancement
* `akashic-cli-serve`
  * [#932](https://github.com/akashic-games/akashic-cli/pull/932) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#928](https://github.com/akashic-games/akashic-cli/pull/928) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.14.7 (2021-11-29)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#927](https://github.com/akashic-games/akashic-cli/pull/927) Update dependency json-schema to 0.4.0 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.6 (2021-11-26)

#### Enhancement
* `akashic-cli-serve`
  * [#925](https://github.com/akashic-games/akashic-cli/pull/925) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.5 (2021-11-24)

#### Enhancement
* `akashic-cli-serve`
  * [#922](https://github.com/akashic-games/akashic-cli/pull/922) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#921](https://github.com/akashic-games/akashic-cli/pull/921) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.4 (2021-11-24)

#### Enhancement
* `akashic-cli-init`
  * [#920](https://github.com/akashic-games/akashic-cli/pull/920) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-serve`
  * [#895](https://github.com/akashic-games/akashic-cli/pull/895) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.3 (2021-11-24)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#914](https://github.com/akashic-games/akashic-cli/pull/914) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 2.14.2 (2021-11-24)

#### Enhancement
* `akashic-cli-serve`
  * [#919](https://github.com/akashic-games/akashic-cli/pull/919) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.1 (2021-11-24)

#### Enhancement
* `akashic-cli-serve`
  * [#917](https://github.com/akashic-games/akashic-cli/pull/917) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#913](https://github.com/akashic-games/akashic-cli/pull/913) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.14.0 (2021-11-19)

#### Enhancement
* `akashic-cli-init`
  * [#911](https://github.com/akashic-games/akashic-cli/pull/911) feat(init): introduce formatVersion to template.json and template-list.json ([@xnv](https://github.com/xnv))
  * [#910](https://github.com/akashic-games/akashic-cli/pull/910) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-commons`, `akashic-cli-init`
  * [#905](https://github.com/akashic-games/akashic-cli/pull/905) feat(init): overhaul init, remove factory templates and use the default template repository on Github ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-export`
  * [#912](https://github.com/akashic-games/akashic-cli/pull/912) fix(export): remove obsolete warning messages ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.13.1 (2021-11-16)

#### Enhancement
* `akashic-cli-serve`
  * [#909](https://github.com/akashic-games/akashic-cli/pull/909) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.3, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#908](https://github.com/akashic-games/akashic-cli/pull/908) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#907](https://github.com/akashic-games/akashic-cli/pull/907) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#893](https://github.com/akashic-games/akashic-cli/pull/893) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.2, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.13.0 (2021-11-16)

#### Enhancement
* `akashic-cli-serve`
  * [#899](https://github.com/akashic-games/akashic-cli/pull/899) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.2, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#904](https://github.com/akashic-games/akashic-cli/pull/904) feat(serve): add Playback devtool ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#896](https://github.com/akashic-games/akashic-cli/pull/896) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-commons`, `akashic-cli-scan`
  * [#900](https://github.com/akashic-games/akashic-cli/pull/900) refactor: move FileModule to commons, remove unused functions ([@xnv](https://github.com/xnv))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-lib-manage`, `akashic-cli-serve`
  * [#898](https://github.com/akashic-games/akashic-cli/pull/898) fix(test): fix broken coverages ([@xnv](https://github.com/xnv))
* `akashic-cli-commons`
  * [#897](https://github.com/akashic-games/akashic-cli/pull/897) test(commons): use TS in tests ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#903](https://github.com/akashic-games/akashic-cli/pull/903) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.12.1 (2021-11-04)

#### Enhancement
* `akashic-cli-serve`
  * [#888](https://github.com/akashic-games/akashic-cli/pull/888) feat(serve): akashic-cli-serve起動時にserveが持っているengine-filesのバージョン情報を表示するようにした ([@dera-](https://github.com/dera-))
* `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-serve`
  * [#774](https://github.com/akashic-games/akashic-cli/pull/774) add startpoint handler for serve ([@kamakiri01](https://github.com/kamakiri01))
* `akashic-cli-init`
  * [#883](https://github.com/akashic-games/akashic-cli/pull/883) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-export`
  * [#894](https://github.com/akashic-games/akashic-cli/pull/894) fix(export): fix package.json to able to build ([@dera-](https://github.com/dera-))
* `akashic-cli-serve`
  * [#891](https://github.com/akashic-games/akashic-cli/pull/891) fix(serve): akashic-cli-serve で「今までのプレイ情報を保存」を押した時ゲーム進行が止まる不具合の修正 ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-serve`
  * [#892](https://github.com/akashic-games/akashic-cli/pull/892) Support serve tsx eslint ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#765](https://github.com/akashic-games/akashic-cli/pull/765) Update dependency rxjs to v7 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#880](https://github.com/akashic-games/akashic-cli/pull/880) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#879](https://github.com/akashic-games/akashic-cli/pull/879) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`
  * [#754](https://github.com/akashic-games/akashic-cli/pull/754) Update dependency fs-extra to v10 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-scan`
  * [#746](https://github.com/akashic-games/akashic-cli/pull/746) Update dependency image-size to v1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 4
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@dera-](https://github.com/dera-)
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.12.0 (2021-10-19)

#### Enhancement
* `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`
  * [#881](https://github.com/akashic-games/akashic-cli/pull/881) feat(init): GitHub Enterprise でのテンプレート初期化に対応 ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-init`
  * [#874](https://github.com/akashic-games/akashic-cli/pull/874) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`
  * [#881](https://github.com/akashic-games/akashic-cli/pull/881) feat(init): GitHub Enterprise でのテンプレート初期化に対応 ([@yu-ogi](https://github.com/yu-ogi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#875](https://github.com/akashic-games/akashic-cli/pull/875) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#852](https://github.com/akashic-games/akashic-cli/pull/852) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 3
- [@yu-ogi](https://github.com/yu-ogi)
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.11.5 (2021-10-06)

#### Enhancement
* `akashic-cli-serve`
  * [#873](https://github.com/akashic-games/akashic-cli/pull/873) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.1, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#872](https://github.com/akashic-games/akashic-cli/pull/872) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#869](https://github.com/akashic-games/akashic-cli/pull/869) feat(init): support to initialize project from GitHub repo ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-export`
  * [#871](https://github.com/akashic-games/akashic-cli/pull/871) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.1, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.11.4 (2021-10-05)

#### Enhancement
* `akashic-cli-init`
  * [#867](https://github.com/akashic-games/akashic-cli/pull/867) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-serve`
  * [#868](https://github.com/akashic-games/akashic-cli/pull/868) fix(serve): fix --debug-playlog and accept absolute path ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.11.3 (2021-10-05)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-serve`
  * [#853](https://github.com/akashic-games/akashic-cli/pull/853) Support https serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#865](https://github.com/akashic-games/akashic-cli/pull/865) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#866](https://github.com/akashic-games/akashic-cli/pull/866) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.11.2 (2021-10-01)

#### Enhancement
* `akashic-cli-serve`
  * [#864](https://github.com/akashic-games/akashic-cli/pull/864) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.1.0, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#862](https://github.com/akashic-games/akashic-cli/pull/862) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.1.0, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#863](https://github.com/akashic-games/akashic-cli/pull/863) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#861](https://github.com/akashic-games/akashic-cli/pull/861) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.11.1 (2021-09-30)

#### Enhancement
* `akashic-cli-serve`
  * [#860](https://github.com/akashic-games/akashic-cli/pull/860) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.22, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#859](https://github.com/akashic-games/akashic-cli/pull/859) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#857](https://github.com/akashic-games/akashic-cli/pull/857) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#858](https://github.com/akashic-games/akashic-cli/pull/858) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.22, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.11.0 (2021-09-30)

#### Other Change
* `akashic-cli-init`
  * [#854](https://github.com/akashic-games/akashic-cli/pull/854) Modify akashic-cli-init template package.json ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-serve`, `akashic-cli`
  * [#848](https://github.com/akashic-games/akashic-cli/pull/848) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#849](https://github.com/akashic-games/akashic-cli/pull/849) Update dependency commander to v8.2.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 3
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@yu-ogi](https://github.com/yu-ogi)
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.10.26 (2021-09-10)

#### Enhancement
* `akashic-cli-serve`
  * [#847](https://github.com/akashic-games/akashic-cli/pull/847) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.21, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#845](https://github.com/akashic-games/akashic-cli/pull/845) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.25 (2021-09-08)

#### Enhancement
* `akashic-cli-serve`
  * [#844](https://github.com/akashic-games/akashic-cli/pull/844) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.21, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#843](https://github.com/akashic-games/akashic-cli/pull/843) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#842](https://github.com/akashic-games/akashic-cli/pull/842) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.24 (2021-09-01)

#### Enhancement
* `akashic-cli-serve`
  * [#841](https://github.com/akashic-games/akashic-cli/pull/841) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.21, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#840](https://github.com/akashic-games/akashic-cli/pull/840) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#838](https://github.com/akashic-games/akashic-cli/pull/838) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#839](https://github.com/akashic-games/akashic-cli/pull/839) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.21, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.23 (2021-09-01)

#### Enhancement
* `akashic-cli-serve`
  * [#837](https://github.com/akashic-games/akashic-cli/pull/837) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.20, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#836](https://github.com/akashic-games/akashic-cli/pull/836) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#830](https://github.com/akashic-games/akashic-cli/pull/830) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#835](https://github.com/akashic-games/akashic-cli/pull/835) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.20, engineFiles@2.1.57, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#832](https://github.com/akashic-games/akashic-cli/pull/832) Update dependency typescript to v4.4.2 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-serve`
  * [#831](https://github.com/akashic-games/akashic-cli/pull/831) Update dependency tar to v6.1.11 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#802](https://github.com/akashic-games/akashic-cli/pull/802) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#828](https://github.com/akashic-games/akashic-cli/pull/828) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.22 (2021-08-24)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-serve`
  * [#824](https://github.com/akashic-games/akashic-cli/pull/824) Extend serve --target-service option ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#829](https://github.com/akashic-games/akashic-cli/pull/829) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.10.21 (2021-08-24)

#### Enhancement
* `akashic-cli-serve`
  * [#827](https://github.com/akashic-games/akashic-cli/pull/827) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.20, engineFiles@2.1.56, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#821](https://github.com/akashic-games/akashic-cli/pull/821) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.19, engineFiles@2.1.56, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#826](https://github.com/akashic-games/akashic-cli/pull/826) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export`
  * [#825](https://github.com/akashic-games/akashic-cli/pull/825) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.20, engineFiles@2.1.56, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-init`
  * [#823](https://github.com/akashic-games/akashic-cli/pull/823) Fix akashic-init template spec ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#822](https://github.com/akashic-games/akashic-cli/pull/822) Update dependency path-parse to 1.0.7 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
  * [#801](https://github.com/akashic-games/akashic-cli/pull/801) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-lib-manage`
  * [#818](https://github.com/akashic-games/akashic-cli/pull/818) Update dependency tar to v6.1.2 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.10.20 (2021-08-04)

#### Enhancement
* `akashic-cli-serve`
  * [#820](https://github.com/akashic-games/akashic-cli/pull/820) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.19, engineFiles@2.1.56, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#819](https://github.com/akashic-games/akashic-cli/pull/819) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.19 (2021-08-04)

#### Enhancement
* `akashic-cli-init`
  * [#814](https://github.com/akashic-games/akashic-cli/pull/814) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-export`
  * [#815](https://github.com/akashic-games/akashic-cli/pull/815) fix(export): fix wrong bin name 'akashic-cli-zip' to 'akashic-cli-export-zip' ([@xnv](https://github.com/xnv))
  * [#816](https://github.com/akashic-games/akashic-cli/pull/816) fix(export): deprecate and always enable --no-omit-empty-js ([@xnv](https://github.com/xnv))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`
  * [#812](https://github.com/akashic-games/akashic-cli/pull/812) fix(test): fix for Windows, enable Windows tests in CI ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-export`
  * [#817](https://github.com/akashic-games/akashic-cli/pull/817) chore(export): restore removed bin name for compatiblity ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.18 (2021-07-21)

#### Enhancement
* `akashic-cli-init`
  * [#811](https://github.com/akashic-games/akashic-cli/pull/811) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-export`
  * [#813](https://github.com/akashic-games/akashic-cli/pull/813) Fix isEmptyScriptJs() in export-zip ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* `akashic-cli-init`
  * [#794](https://github.com/akashic-games/akashic-cli/pull/794) Add eslint config to init ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-scan`
  * [#796](https://github.com/akashic-games/akashic-cli/pull/796) Add eslint config to scan ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-export`, `akashic-cli-serve`
  * [#797](https://github.com/akashic-games/akashic-cli/pull/797) Add eslint to serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-lib-manage`
  * [#795](https://github.com/akashic-games/akashic-cli/pull/795) Add eslint config to lib manage ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-extra`
  * [#793](https://github.com/akashic-games/akashic-cli/pull/793) Add akashic/eslint-config to extra ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-export`
  * [#792](https://github.com/akashic-games/akashic-cli/pull/792) Add akashic-eslint-config to export ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-commons`, `akashic-cli-export`
  * [#791](https://github.com/akashic-games/akashic-cli/pull/791) Add akashic-eslint-config to commons ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli`
  * [#790](https://github.com/akashic-games/akashic-cli/pull/790) Add eslint config to akashic cli ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.10.17 (2021-07-16)

#### Other Change
* `akashic-cli-serve`
  * [#810](https://github.com/akashic-games/akashic-cli/pull/810) msgpack パーサーの追加 ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.10.16 (2021-07-12)

#### Enhancement
* `akashic-cli-export`
  * [#808](https://github.com/akashic-games/akashic-cli/pull/808) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.19, engineFiles@2.1.56, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.15 (2021-07-12)

#### Enhancement
* `akashic-cli-serve`
  * [#807](https://github.com/akashic-games/akashic-cli/pull/807) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.19, engineFiles@2.1.55, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#806](https://github.com/akashic-games/akashic-cli/pull/806) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.14 (2021-07-12)

#### Enhancement
* `akashic-cli-export`
  * [#805](https://github.com/akashic-games/akashic-cli/pull/805) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.19, engineFiles@2.1.55, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#803](https://github.com/akashic-games/akashic-cli/pull/803) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.18, engineFiles@2.1.55, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#804](https://github.com/akashic-games/akashic-cli/pull/804) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.13 (2021-07-09)

#### Enhancement
* `akashic-cli-serve`
  * [#800](https://github.com/akashic-games/akashic-cli/pull/800) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.18, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#799](https://github.com/akashic-games/akashic-cli/pull/799) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.12 (2021-07-09)

#### Enhancement
* `akashic-cli-export`
  * [#798](https://github.com/akashic-games/akashic-cli/pull/798) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.18, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-serve`
  * [#788](https://github.com/akashic-games/akashic-cli/pull/788) feat(serve): add service property to the session parameter ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-scan`
  * [#786](https://github.com/akashic-games/akashic-cli/pull/786) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#781](https://github.com/akashic-games/akashic-cli/pull/781) Update dependency commander to v8 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#780](https://github.com/akashic-games/akashic-cli/pull/780) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.11 (2021-07-05)

#### Enhancement
* `akashic-cli-serve`
  * [#787](https://github.com/akashic-games/akashic-cli/pull/787) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.17, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.10 (2021-07-05)

#### Bug Fix
* `akashic-cli-init`
  * [#785](https://github.com/akashic-games/akashic-cli/pull/785) Fix init generate template ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.10.9 (2021-07-01)

#### Enhancement
* `akashic-cli-serve`
  * [#784](https://github.com/akashic-games/akashic-cli/pull/784) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.17, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.8 (2021-07-01)

#### Enhancement
* `akashic-cli-init`
  * [#783](https://github.com/akashic-games/akashic-cli/pull/783) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-scan`
  * [#773](https://github.com/akashic-games/akashic-cli/pull/773) akashic-cli-scan のリファクタリング ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.10.7 (2021-07-01)

#### Enhancement
* `akashic-cli-export`
  * [#782](https://github.com/akashic-games/akashic-cli/pull/782) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.17, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#779](https://github.com/akashic-games/akashic-cli/pull/779) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.6 (2021-06-24)

#### Enhancement
* `akashic-cli-init`
  * [#772](https://github.com/akashic-games/akashic-cli/pull/772) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-serve`
  * [#778](https://github.com/akashic-games/akashic-cli/pull/778) Update typescript v4 of serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#777](https://github.com/akashic-games/akashic-cli/pull/777) Mod playerId of serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-init`
  * [#776](https://github.com/akashic-games/akashic-cli/pull/776) Update dependency eslint to v7.29.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#775](https://github.com/akashic-games/akashic-cli/pull/775) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.10.5 (2021-06-15)

#### Enhancement
* `akashic-cli-export`
  * [#767](https://github.com/akashic-games/akashic-cli/pull/767) Support compress if zip extension with -o option of export-html ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* Other
  * [#769](https://github.com/akashic-games/akashic-cli/pull/769) Update dependency glob-parent to 5.1.2 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
  * [#768](https://github.com/akashic-games/akashic-cli/pull/768) Update dependency trim-newlines to 3.0.1 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
  * [#770](https://github.com/akashic-games/akashic-cli/pull/770) Update dependency normalize-url to 4.5.1 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
  * [#755](https://github.com/akashic-games/akashic-cli/pull/755) Update dependency hosted-git-info to 2.8.9 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
  * [#753](https://github.com/akashic-games/akashic-cli/pull/753) Update dependency lodash to 4.17.21 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-export`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#752](https://github.com/akashic-games/akashic-cli/pull/752) Update dependency handlebars to 4.7.7 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#749](https://github.com/akashic-games/akashic-cli/pull/749) Update dependency ssri to 6.0.2 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-lib-manage`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli`
  * [#720](https://github.com/akashic-games/akashic-cli/pull/720) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#719](https://github.com/akashic-games/akashic-cli/pull/719) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#718](https://github.com/akashic-games/akashic-cli/pull/718) Pin dependencies ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.10.4 (2021-05-25)

#### Enhancement
* `akashic-cli-serve`
  * [#764](https://github.com/akashic-games/akashic-cli/pull/764) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.16, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#762](https://github.com/akashic-games/akashic-cli/pull/762) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.3 (2021-05-25)

#### Enhancement
* `akashic-cli-export`
  * [#761](https://github.com/akashic-games/akashic-cli/pull/761) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.16, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.2 (2021-05-25)

#### Enhancement
* `akashic-cli-export`
  * [#759](https://github.com/akashic-games/akashic-cli/pull/759) 【akashic-cli-export】内部コンポーネントの更新(engineFiles@3.0.15, engineFiles@2.1.54, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.10.1 (2021-05-24)

#### Enhancement
* `akashic-cli-serve`
  * [#758](https://github.com/akashic-games/akashic-cli/pull/758) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.15, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.10.0 (2021-05-20)

#### Update Dependencies
* `akashic-cli-serve`
  * [#757](https://github.com/akashic-games/akashic-cli/pull/757) headless-driver@1.7.0 を利用するように ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 2.9.2 (2021-05-12)

#### Enhancement
* `akashic-cli-init`
  * [#750](https://github.com/akashic-games/akashic-cli/pull/750) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-init`
  * [#756](https://github.com/akashic-games/akashic-cli/pull/756) Modify .gitignore of akashic-init template ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.9.1 (2021-04-28)

#### Bug Fix
* `akashic-cli-commons`, `akashic-cli-export`
  * [#717](https://github.com/akashic-games/akashic-cli/pull/717) save opreration plugin scripts when export ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.9.0 (2021-04-23)

#### Enhancement
* `akashic-cli-serve`
  * [#747](https://github.com/akashic-games/akashic-cli/pull/747) feat(serve): use headless-driver@1.6.0 ([@yu-ogi](https://github.com/yu-ogi))

#### Update Dependencies
* `akashic-cli-serve`
  * [#747](https://github.com/akashic-games/akashic-cli/pull/747) feat(serve): use headless-driver@1.6.0 ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.8.0 (2021-04-15)

#### Enhancement
* `akashic-cli-serve`
  * [#742](https://github.com/akashic-games/akashic-cli/pull/742) v3 系の engine-files を外部から指定できるように ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-init`
  * [#744](https://github.com/akashic-games/akashic-cli/pull/744) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.7.1 (2021-04-15)

#### Enhancement
* `akashic-cli-init`
  * [#734](https://github.com/akashic-games/akashic-cli/pull/734) Fix akashic-cli-init template spec files ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#743](https://github.com/akashic-games/akashic-cli/pull/743) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.7.0 (2021-04-13)

#### Breaking Change
* `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-export`, `akashic-cli`
  * [#697](https://github.com/akashic-games/akashic-cli/pull/697) akashic-cli-export-htmlとakashic-cli-export-zipを1つのパッケージ(akashic-cli-export)に統合 ([@dera-](https://github.com/dera-))
* `akashic-cli-config`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-modify`, `akashic-cli-stat`, `akashic-cli`
  * [#696](https://github.com/akashic-games/akashic-cli/pull/696) config, modify, statを１つのツール(akashic-cli-extra)としてまとめる対応 ([@dera-](https://github.com/dera-))

#### Enhancement
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-export`, `akashic-cli-extra`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-lib-manage`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#741](https://github.com/akashic-games/akashic-cli/pull/741) akashic-cliのpackages下のディレクトリを減らす対応 ([@dera-](https://github.com/dera-))
* `akashic-cli-install`, `akashic-cli-lib-manage`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#710](https://github.com/akashic-games/akashic-cli/pull/710) integrate akashic-cli-XXX about npm command ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.6.9 (2021-04-13)

#### Enhancement
* `akashic-cli-serve`
  * [#724](https://github.com/akashic-games/akashic-cli/pull/724) Add experimental-open to serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#740](https://github.com/akashic-games/akashic-cli/pull/740) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.6.8 (2021-04-13)

#### Enhancement
* `akashic-cli-commons`
  * [#722](https://github.com/akashic-games/akashic-cli/pull/722) Add experimentalOpen to CliConfigServe ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.6.7 (2021-04-09)

#### Enhancement
* `akashic-cli-serve`
  * [#739](https://github.com/akashic-games/akashic-cli/pull/739) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.14, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#737](https://github.com/akashic-games/akashic-cli/pull/737) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.6.6 (2021-04-08)

#### Enhancement
* `akashic-cli-serve`
  * [#738](https://github.com/akashic-games/akashic-cli/pull/738) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.13, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#736](https://github.com/akashic-games/akashic-cli/pull/736) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.6.5 (2021-04-08)

#### Enhancement
* `akashic-cli-export-html`
  * [#735](https://github.com/akashic-games/akashic-cli/pull/735) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.13, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.6.4 (2021-04-06)

#### Enhancement
* `akashic-cli-serve`
  * [#733](https://github.com/akashic-games/akashic-cli/pull/733) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.12, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#732](https://github.com/akashic-games/akashic-cli/pull/732) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.6.3 (2021-04-05)

#### Enhancement
* `akashic-cli-init`
  * [#731](https://github.com/akashic-games/akashic-cli/pull/731) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-init`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#726](https://github.com/akashic-games/akashic-cli/pull/726) change reference method of akashic-cli-commons in init, scan, serve ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.6.2 (2021-04-02)

#### Enhancement
* `akashic-cli-serve`
  * [#729](https://github.com/akashic-games/akashic-cli/pull/729) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.11, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#728](https://github.com/akashic-games/akashic-cli/pull/728) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#723](https://github.com/akashic-games/akashic-cli/pull/723) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#727](https://github.com/akashic-games/akashic-cli/pull/727) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.11, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Other Change
* [#730](https://github.com/akashic-games/akashic-cli/pull/730) fix broken CHANGELOG.md and make updateChangelog.js more robust ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.6.1 (2021-03-25)

#### Enhancement
* `akashic-cli-init`
  * [#715](https://github.com/akashic-games/akashic-cli/pull/715) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.6.0 (2021-03-19)

#### Breaking Change
* `akashic-cli-commons`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#640](https://github.com/akashic-games/akashic-cli/pull/640) add watch option in akashic-cli-serve ([@dera-](https://github.com/dera-))

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#640](https://github.com/akashic-games/akashic-cli/pull/640) add watch option in akashic-cli-serve ([@dera-](https://github.com/dera-))
* `akashic-cli-serve`
  * [#641](https://github.com/akashic-games/akashic-cli/pull/641) create new play by watch option in akashic-cli-serve ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.5.19 (2021-03-16)

#### Enhancement
* `akashic-cli-serve`
  * [#716](https://github.com/akashic-games/akashic-cli/pull/716) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.10, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#713](https://github.com/akashic-games/akashic-cli/pull/713) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.18 (2021-03-16)

#### Enhancement
* `akashic-cli-export-html`
  * [#714](https://github.com/akashic-games/akashic-cli/pull/714) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.10, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#712](https://github.com/akashic-games/akashic-cli/pull/712) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.17 (2021-03-16)

#### Enhancement
* `akashic-cli-export-html`
  * [#711](https://github.com/akashic-games/akashic-cli/pull/711) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.9, engineFiles@2.1.53, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#709](https://github.com/akashic-games/akashic-cli/pull/709) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.16 (2021-03-15)

#### Enhancement
* `akashic-cli-serve`
  * [#708](https://github.com/akashic-games/akashic-cli/pull/708) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.9, engineFiles@2.1.52, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-scan`
  * [#706](https://github.com/akashic-games/akashic-cli/pull/706) Fix akashic-scan error message ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#704](https://github.com/akashic-games/akashic-cli/pull/704) Fix renovate error ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-serve`
  * [#707](https://github.com/akashic-games/akashic-cli/pull/707) Update dependency socket.io to v4 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#703](https://github.com/akashic-games/akashic-cli/pull/703) Update dependency open to v8 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-serve`
  * [#702](https://github.com/akashic-games/akashic-cli/pull/702) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#701](https://github.com/akashic-games/akashic-cli/pull/701) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#699](https://github.com/akashic-games/akashic-cli/pull/699) Update dependency highlight.js to 10.4.1 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
  * [#650](https://github.com/akashic-games/akashic-cli/pull/650) Update dependency commander to v7 ([@renovate[bot]](https://github.com/apps/renovate))
* Other
  * [#700](https://github.com/akashic-games/akashic-cli/pull/700) Update dependency ini to 1.3.6 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.5.15 (2021-03-10)

#### Enhancement
* `akashic-cli-serve`
  * [#705](https://github.com/akashic-games/akashic-cli/pull/705) update player-info-resolver (add premium to userData) in akashic-cli-serve ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#698](https://github.com/akashic-games/akashic-cli/pull/698) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.5.14 (2021-03-01)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#647](https://github.com/akashic-games/akashic-cli/pull/647) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#646](https://github.com/akashic-games/akashic-cli/pull/646) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 2.5.13 (2021-02-18)

#### Bug Fix
* `akashic-cli-stat`
  * [#685](https://github.com/akashic-games/akashic-cli/pull/685) Fix warning message of akashic-cli-stat ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 2.5.12 (2021-02-16)

#### Enhancement
* `akashic-cli-serve`
  * [#695](https://github.com/akashic-games/akashic-cli/pull/695) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.9, engineFiles@2.1.52, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#694](https://github.com/akashic-games/akashic-cli/pull/694) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#692](https://github.com/akashic-games/akashic-cli/pull/692) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.11 (2021-02-16)

#### Enhancement
* `akashic-cli-export-html`
  * [#691](https://github.com/akashic-games/akashic-cli/pull/691) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.9, engineFiles@2.1.52, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.10 (2021-02-16)

#### Enhancement
* `akashic-cli-serve`
  * [#690](https://github.com/akashic-games/akashic-cli/pull/690) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.8, engineFiles@2.1.52, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#689](https://github.com/akashic-games/akashic-cli/pull/689) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#688](https://github.com/akashic-games/akashic-cli/pull/688) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.9 (2021-02-16)

#### Enhancement
* `akashic-cli-export-html`
  * [#687](https://github.com/akashic-games/akashic-cli/pull/687) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.8, engineFiles@2.1.52, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#686](https://github.com/akashic-games/akashic-cli/pull/686) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#684](https://github.com/akashic-games/akashic-cli/pull/684) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.8 (2021-02-12)

#### Other Change
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-init`, `akashic-cli-serve`
  * [#683](https://github.com/akashic-games/akashic-cli/pull/683) Rename RPG-Atsumaru -> GAME-atsumaru ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* Other
  * [#673](https://github.com/akashic-games/akashic-cli/pull/673) add publish script as npm-scripts ([@dera-](https://github.com/dera-))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@dera-](https://github.com/dera-)

## 2.5.7 (2021-02-05)

#### Enhancement
* `akashic-cli-serve`
  * [#682](https://github.com/akashic-games/akashic-cli/pull/682) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.8, engineFiles@2.1.51, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#681](https://github.com/akashic-games/akashic-cli/pull/681) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#680](https://github.com/akashic-games/akashic-cli/pull/680) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.6 (2021-02-05)

#### Enhancement
* `akashic-cli-export-html`
  * [#679](https://github.com/akashic-games/akashic-cli/pull/679) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.8, engineFiles@2.1.51, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.5 (2021-02-05)

#### Enhancement
* `akashic-cli-serve`
  * [#678](https://github.com/akashic-games/akashic-cli/pull/678) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.7, engineFiles@2.1.51, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#677](https://github.com/akashic-games/akashic-cli/pull/677) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.4 (2021-02-05)

#### Enhancement
* `akashic-cli-export-html`
  * [#674](https://github.com/akashic-games/akashic-cli/pull/674) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.51, engineFiles@2.1.51, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#676](https://github.com/akashic-games/akashic-cli/pull/676) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#675](https://github.com/akashic-games/akashic-cli/pull/675) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* [#656](https://github.com/akashic-games/akashic-cli/pull/656) add test of akashic-li-init template in test/e2e.js ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.5.3 (2021-01-29)

#### Enhancement
* `akashic-cli-serve`
  * [#670](https://github.com/akashic-games/akashic-cli/pull/670) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.7, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#669](https://github.com/akashic-games/akashic-cli/pull/669) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#668](https://github.com/akashic-games/akashic-cli/pull/668) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.2 (2021-01-29)

#### Enhancement
* `akashic-cli-export-html`
  * [#667](https://github.com/akashic-games/akashic-cli/pull/667) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.7, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#666](https://github.com/akashic-games/akashic-cli/pull/666) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.5.1 (2021-01-29)

#### Enhancement
* `akashic-cli-serve`
  * [#665](https://github.com/akashic-games/akashic-cli/pull/665) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.6, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#664](https://github.com/akashic-games/akashic-cli/pull/664) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#654](https://github.com/akashic-games/akashic-cli/pull/654) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#663](https://github.com/akashic-games/akashic-cli/pull/663) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.6, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#662](https://github.com/akashic-games/akashic-cli/pull/662) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.5, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#661](https://github.com/akashic-games/akashic-cli/pull/661) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.4, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-serve`
  * [#657](https://github.com/akashic-games/akashic-cli/pull/657) fix coeLimitedPlugin function to stop to display dialog ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.5.0 (2021-01-21)

#### Enhancement
* `akashic-cli-scan`
  * [#653](https://github.com/akashic-games/akashic-cli/pull/653) feat(scan): scan assets as array ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-init`
  * [#652](https://github.com/akashic-games/akashic-cli/pull/652) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.4.0 (2021-01-19)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-scan`
  * [#651](https://github.com/akashic-games/akashic-cli/pull/651) feat(scan): write asset config to the akashic-lib.json if exists ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-init`
  * [#649](https://github.com/akashic-games/akashic-cli/pull/649) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.3.0 (2021-01-12)

#### Enhancement
* `akashic-cli-serve`
  * [#622](https://github.com/akashic-games/akashic-cli/pull/622) add design guideline image in akashic-cli-serve ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 2.2.5 (2021-01-07)

#### Enhancement
* `akashic-cli-serve`
  * [#645](https://github.com/akashic-games/akashic-cli/pull/645) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.3, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#644](https://github.com/akashic-games/akashic-cli/pull/644) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.2.4 (2021-01-07)

#### Enhancement
* `akashic-cli-export-html`
  * [#643](https://github.com/akashic-games/akashic-cli/pull/643) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.3, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#639](https://github.com/akashic-games/akashic-cli/pull/639) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`
  * [#642](https://github.com/akashic-games/akashic-cli/pull/642) fix(deps): update dependency ini to v1.3.6 [security] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#570](https://github.com/akashic-games/akashic-cli/pull/570) fix(deps): update dependency socket.io to v3 ([@renovate[bot]](https://github.com/apps/renovate))
  * [#628](https://github.com/akashic-games/akashic-cli/pull/628) chore(deps): update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#631](https://github.com/akashic-games/akashic-cli/pull/631) chore(deps): update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* Other
  * [#629](https://github.com/akashic-games/akashic-cli/pull/629) chore(deps): update actions/setup-node action to v2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))



## 2.2.1 (2020-12-23)

#### Enhancement
* `akashic-cli-init`
  * [#634](https://github.com/akashic-games/akashic-cli/pull/634) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-init`
  * [#635](https://github.com/akashic-games/akashic-cli/pull/635) fix lint script in akashic-cli-init templates ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.2.0 (2020-12-22)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-install`, `akashic-cli-uninstall`
  * [#626](https://github.com/akashic-games/akashic-cli/pull/626) feat: add/remove assets when install/uninstall ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)


## 2.1.3 (2020-12-21)

#### Enhancement
* `akashic-cli-serve`
  * [#633](https://github.com/akashic-games/akashic-cli/pull/633) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.2, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#627](https://github.com/akashic-games/akashic-cli/pull/627) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.1.2 (2020-12-18)

#### Enhancement
* `akashic-cli-export-html`
  * [#624](https://github.com/akashic-games/akashic-cli/pull/624) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.2, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#625](https://github.com/akashic-games/akashic-cli/pull/625) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-init`
  * [#620](https://github.com/akashic-games/akashic-cli/pull/620) fix(init): revert to v2 tempaltes as default ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-html`, `akashic-cli-export-zip`
  * [#400](https://github.com/akashic-games/akashic-cli/pull/400) fix(deps): update dependency archiver to v5 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-serve`
  * [#603](https://github.com/akashic-games/akashic-cli/pull/603) chore(deps): update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#589](https://github.com/akashic-games/akashic-cli/pull/589) chore(deps): update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 2.1.1 (2020-12-09)

#### Enhancement
* `akashic-cli-init`
  * [#618](https://github.com/akashic-games/akashic-cli/pull/618) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-serve`
  * [#619](https://github.com/akashic-games/akashic-cli/pull/619) akashic-cli-serveのプロファイラ機能の修正 ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 2.1.0 (2020-12-08)

#### Enhancement
* `akashic-cli-serve`
  * [#565](https://github.com/akashic-games/akashic-cli/pull/565) add profiler screen in akashic-cli-serve ([@dera-](https://github.com/dera-))
* `akashic-cli-export-html`
  * [#609](https://github.com/akashic-games/akashic-cli/pull/609) feat(export-html): add GameExternalStorage impl ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-init`
  * [#617](https://github.com/akashic-games/akashic-cli/pull/617) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 3
- [@dera-](https://github.com/dera-)
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 2.0.3 (2020-12-04)

#### Bug Fix
* `akashic-cli-export-html`
  * [#607](https://github.com/akashic-games/akashic-cli/pull/607) fix dragging to outside of the screen on exported html ([@xnv](https://github.com/xnv))
* `akashic-cli-serve`
  * [#616](https://github.com/akashic-games/akashic-cli/pull/616) Move open module to dependencies ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#610](https://github.com/akashic-games/akashic-cli/pull/610) fix(akashic-cli-serve): deadlock for --debug-untrusted ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 2.0.2 (2020-12-02)

#### Enhancement
* `akashic-cli-serve`
  * [#615](https://github.com/akashic-games/akashic-cli/pull/615) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.1, engineFiles@2.1.50, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#614](https://github.com/akashic-games/akashic-cli/pull/614) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.0.1 (2020-12-02)

#### Enhancement
* `akashic-cli-export-html`
  * [#600](https://github.com/akashic-games/akashic-cli/pull/600) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.11, engineFiles@2.1.49, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#613](https://github.com/akashic-games/akashic-cli/pull/613) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#612](https://github.com/akashic-games/akashic-cli/pull/612) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 2.0.0 (2020-12-02)

#### Breaking Change
* `akashic-cli-export-html`, `akashic-cli-init`, `akashic-cli-serve`
  * [#611](https://github.com/akashic-games/akashic-cli/pull/611) engineFIles更新スクリプトをv3のリリースに合わせて修正+akashic-cli-initのテンプレートでakashic-engine v3を利用するようにしてv2を利用しないように修正 ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-export-html`, `akashic-cli-init`, `akashic-cli-serve`
  * [#611](https://github.com/akashic-games/akashic-cli/pull/611) engineFIles更新スクリプトをv3のリリースに合わせて修正+akashic-cli-initのテンプレートでakashic-engine v3を利用するようにしてv2を利用しないように修正 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.15.4 (2020-12-02)

#### Enhancement
* `akashic-cli-init`
  * [#608](https://github.com/akashic-games/akashic-cli/pull/608) feat(akashic-cli-init): add specs ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 1.15.3 (2020-12-01)

#### Enhancement
* `akashic-cli-serve`
  * [#606](https://github.com/akashic-games/akashic-cli/pull/606) Add serve startup options ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.15.2 (2020-12-01)

#### Enhancement
* `akashic-cli-commons`
  * [#605](https://github.com/akashic-games/akashic-cli/pull/605) Add property to commons CliConfigServe ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#604](https://github.com/akashic-games/akashic-cli/pull/604) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.15.1 (2020-11-24)

#### Enhancement
* `akashic-cli-serve`
  * [#598](https://github.com/akashic-games/akashic-cli/pull/598) reconnection when server restart ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#602](https://github.com/akashic-games/akashic-cli/pull/602) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#601](https://github.com/akashic-games/akashic-cli/pull/601) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-init`, `akashic-cli-scan`
  * [#590](https://github.com/akashic-games/akashic-cli/pull/590) Change game size in init template ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.15.0 (2020-11-19)

#### Breaking Change
* `akashic-cli-export-html`
  * [#592](https://github.com/akashic-games/akashic-cli/pull/592) stop to depend on game-storage ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-export-html`
  * [#592](https://github.com/akashic-games/akashic-cli/pull/592) stop to depend on game-storage ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.14.119 (2020-11-18)

#### Enhancement
* `akashic-cli-init`
  * [#595](https://github.com/akashic-games/akashic-cli/pull/595) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#597](https://github.com/akashic-games/akashic-cli/pull/597) feat(serve): update @akashic/headless-driver to 1.5.0 ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.118 (2020-11-13)

#### Enhancement
* `akashic-cli-serve`
  * [#588](https://github.com/akashic-games/akashic-cli/pull/588) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.11, engineFiles@2.1.48, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.117 (2020-11-12)

#### Enhancement
* `akashic-cli-init`
  * [#587](https://github.com/akashic-games/akashic-cli/pull/587) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-init`
  * [#582](https://github.com/akashic-games/akashic-cli/pull/582) fix npm-scripts about generating zips ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.116 (2020-11-12)

#### Enhancement
* `akashic-cli-export-html`
  * [#586](https://github.com/akashic-games/akashic-cli/pull/586) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.11, engineFiles@2.1.48, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#585](https://github.com/akashic-games/akashic-cli/pull/585) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.115 (2020-11-12)

#### Enhancement
* `akashic-cli-serve`
  * [#584](https://github.com/akashic-games/akashic-cli/pull/584) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.10, engineFiles@2.1.48, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#583](https://github.com/akashic-games/akashic-cli/pull/583) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.10, engineFiles@2.1.48, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#581](https://github.com/akashic-games/akashic-cli/pull/581) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.114 (2020-11-11)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-scan`
  * [#552](https://github.com/akashic-games/akashic-cli/pull/552) add watch option in akashic-cli-scan ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#579](https://github.com/akashic-games/akashic-cli/pull/579) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* [#580](https://github.com/akashic-games/akashic-cli/pull/580) fix: Invalid node version ([@yu-ogi](https://github.com/yu-ogi))
* [#574](https://github.com/akashic-games/akashic-cli/pull/574) test: replace travis-ci with github actions ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 4
- [@dera-](https://github.com/dera-)
- [@yu-ogi](https://github.com/yu-ogi)
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.113 (2020-11-10)

#### Other Change
* `akashic-cli-install`
  * [#575](https://github.com/akashic-games/akashic-cli/pull/575) Fix akashic-install does not warn moduleMainScripts in AEv3 ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-export-zip`
  * [#578](https://github.com/akashic-games/akashic-cli/pull/578) Fix deprecated in install ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.112 (2020-11-09)

#### Enhancement
* `akashic-cli-serve`
  * [#561](https://github.com/akashic-games/akashic-cli/pull/561) add save playlog button in akashic-cli-serve ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#577](https://github.com/akashic-games/akashic-cli/pull/577) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.111 (2020-11-09)

#### Update Dependencies
* `akashic-cli-init`
  * [#573](https://github.com/akashic-games/akashic-cli/pull/573) Update dependency ts-jest to v26.4.4 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-init`
  * [#571](https://github.com/akashic-games/akashic-cli/pull/571) Update dependency eslint to v7.13.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#572](https://github.com/akashic-games/akashic-cli/pull/572) Update dependency ts-loader to v8.0.10 ([@renovate[bot]](https://github.com/apps/renovate))

#### Republish
* [#576](https://github.com/akashic-games/akashic-cli/pull/576) Republish ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.110 (2020-11-07)

#### Enhancement
* `akashic-cli-init`
  * [#564](https://github.com/akashic-games/akashic-cli/pull/564) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#568](https://github.com/akashic-games/akashic-cli/pull/568) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#569](https://github.com/akashic-games/akashic-cli/pull/569) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.109 (2020-10-31)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#562](https://github.com/akashic-games/akashic-cli/pull/562) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.108 (2020-10-30)

#### Enhancement
* `akashic-cli-serve`
  * [#563](https://github.com/akashic-games/akashic-cli/pull/563) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.10, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#560](https://github.com/akashic-games/akashic-cli/pull/560) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.107 (2020-10-29)

#### Enhancement
* `akashic-cli-export-html`
  * [#559](https://github.com/akashic-games/akashic-cli/pull/559) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.10, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.106 (2020-10-27)

#### Enhancement
* `akashic-cli-serve`
  * [#558](https://github.com/akashic-games/akashic-cli/pull/558) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#557](https://github.com/akashic-games/akashic-cli/pull/557) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.105 (2020-10-26)

#### Enhancement
* `akashic-cli-init`
  * [#556](https://github.com/akashic-games/akashic-cli/pull/556) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#553](https://github.com/akashic-games/akashic-cli/pull/553) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.104 (2020-10-26)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#554](https://github.com/akashic-games/akashic-cli/pull/554) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.103 (2020-10-26)

#### Enhancement
* `akashic-cli-serve`
  * [#555](https://github.com/akashic-games/akashic-cli/pull/555) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.102 (2020-10-22)

#### Enhancement
* `akashic-cli-init`
  * [#550](https://github.com/akashic-games/akashic-cli/pull/550) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-serve`
  * [#551](https://github.com/akashic-games/akashic-cli/pull/551) Fix highlight in entityTree ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.101 (2020-10-17)

#### Enhancement
* `akashic-cli-init`
  * [#548](https://github.com/akashic-games/akashic-cli/pull/548) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#549](https://github.com/akashic-games/akashic-cli/pull/549) Update dependency query-string to v6.13.6 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.100 (2020-10-17)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#544](https://github.com/akashic-games/akashic-cli/pull/544) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.99 (2020-10-16)

#### Enhancement
* `akashic-cli-serve`
  * [#547](https://github.com/akashic-games/akashic-cli/pull/547) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#546](https://github.com/akashic-games/akashic-cli/pull/546) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.98 (2020-10-16)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#545](https://github.com/akashic-games/akashic-cli/pull/545) Update all dependencies to v16.14.0 (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.97 (2020-10-15)

#### Enhancement
* `akashic-cli-init`
  * [#532](https://github.com/akashic-games/akashic-cli/pull/532) add template zip in akashic-cli-init ([@dera-](https://github.com/dera-))
  * [#543](https://github.com/akashic-games/akashic-cli/pull/543) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.96 (2020-10-13)

#### Enhancement
* `akashic-cli-init`
  * [#542](https://github.com/akashic-games/akashic-cli/pull/542) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export-zip`
  * [#540](https://github.com/akashic-games/akashic-cli/pull/540) Update dependency browserify to v17 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.95 (2020-10-11)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#541](https://github.com/akashic-games/akashic-cli/pull/541) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.94 (2020-10-10)

#### Enhancement
* `akashic-cli-init`
  * [#539](https://github.com/akashic-games/akashic-cli/pull/539) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#533](https://github.com/akashic-games/akashic-cli/pull/533) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.93 (2020-10-10)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#537](https://github.com/akashic-games/akashic-cli/pull/537) Update dependency eslint to v7.11.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.92 (2020-10-09)

#### Enhancement
* `akashic-cli-serve`
  * [#538](https://github.com/akashic-games/akashic-cli/pull/538) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#536](https://github.com/akashic-games/akashic-cli/pull/536) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.91 (2020-10-09)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#534](https://github.com/akashic-games/akashic-cli/pull/534) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.90 (2020-10-09)

#### Enhancement
* `akashic-cli-serve`
  * [#535](https://github.com/akashic-games/akashic-cli/pull/535) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))


## 1.14.88 (2020-10-08)

#### Bug Fix
* `akashic-cli-serve`
  * [#530](https://github.com/akashic-games/akashic-cli/pull/530) Fix server-external-script option in serve ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.87 (2020-10-03)

#### Enhancement
* `akashic-cli-init`
  * [#527](https://github.com/akashic-games/akashic-cli/pull/527) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-init`, `akashic-cli-serve`
  * [#528](https://github.com/akashic-games/akashic-cli/pull/528) Update dependency style-loader to v1.3.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.86 (2020-10-03)

#### Enhancement
* `akashic-cli-init`
  * [#526](https://github.com/akashic-games/akashic-cli/pull/526) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#523](https://github.com/akashic-games/akashic-cli/pull/523) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.85 (2020-10-02)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#524](https://github.com/akashic-games/akashic-cli/pull/524) Update dependency @types/uglify-js to v3.11.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.84 (2020-10-02)

#### Enhancement
* `akashic-cli-serve`
  * [#525](https://github.com/akashic-games/akashic-cli/pull/525) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#522](https://github.com/akashic-games/akashic-cli/pull/522) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.83 (2020-09-30)

#### Enhancement
* `akashic-cli-export-html`
  * [#521](https://github.com/akashic-games/akashic-cli/pull/521) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#520](https://github.com/akashic-games/akashic-cli/pull/520) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.82 (2020-09-30)

#### Enhancement
* `akashic-cli-serve`
  * [#519](https://github.com/akashic-games/akashic-cli/pull/519) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.9, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.81 (2020-09-27)

#### Enhancement
* `akashic-cli-init`
  * [#518](https://github.com/akashic-games/akashic-cli/pull/518) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#516](https://github.com/akashic-games/akashic-cli/pull/516) Update dependency query-string to v6.13.3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.80 (2020-09-27)

#### Enhancement
* `akashic-cli-init`
  * [#515](https://github.com/akashic-games/akashic-cli/pull/515) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#517](https://github.com/akashic-games/akashic-cli/pull/517) Update dependency uglify-js to v3.11.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.79 (2020-09-27)

#### Enhancement
* `akashic-cli-init`
  * [#513](https://github.com/akashic-games/akashic-cli/pull/513) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#514](https://github.com/akashic-games/akashic-cli/pull/514) Update dependency eslint to v7.10.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.78 (2020-09-25)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#512](https://github.com/akashic-games/akashic-cli/pull/512) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.14.77 (2020-09-24)

#### Enhancement
* `akashic-cli-serve`
  * [#489](https://github.com/akashic-games/akashic-cli/pull/489) unify player id in akashic-cli-serve ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#511](https://github.com/akashic-games/akashic-cli/pull/511) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.76 (2020-09-20)

#### Update Dependencies
* `akashic-cli-export-zip`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#509](https://github.com/akashic-games/akashic-cli/pull/509) Update dependency music-metadata to v7.4.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.75 (2020-09-20)

#### Enhancement
* `akashic-cli-serve`
  * [#510](https://github.com/akashic-games/akashic-cli/pull/510) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.74 (2020-09-20)

#### Enhancement
* `akashic-cli-init`
  * [#507](https://github.com/akashic-games/akashic-cli/pull/507) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-init`
  * [#508](https://github.com/akashic-games/akashic-cli/pull/508) Update dependency ts-jest to v26.4.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.73 (2020-09-19)

#### Enhancement
* `akashic-cli-init`
  * [#505](https://github.com/akashic-games/akashic-cli/pull/505) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#506](https://github.com/akashic-games/akashic-cli/pull/506) Update dependency mobx to v5.15.7 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.72 (2020-09-19)

#### Enhancement
* `akashic-cli-init`
  * [#503](https://github.com/akashic-games/akashic-cli/pull/503) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-zip`, `akashic-cli-serve`
  * [#504](https://github.com/akashic-games/akashic-cli/pull/504) Update dependency ts-loader to v8.0.4 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.71 (2020-09-19)

#### Enhancement
* `akashic-cli-init`
  * [#502](https://github.com/akashic-games/akashic-cli/pull/502) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#499](https://github.com/akashic-games/akashic-cli/pull/499) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.70 (2020-09-18)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#500](https://github.com/akashic-games/akashic-cli/pull/500) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.69 (2020-09-18)

#### Enhancement
* `akashic-cli-serve`
  * [#501](https://github.com/akashic-games/akashic-cli/pull/501) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.68 (2020-09-18)

#### Enhancement
* `akashic-cli-init`
  * [#498](https://github.com/akashic-games/akashic-cli/pull/498) Add console.d.ts to TS template ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.67 (2020-09-15)

#### Enhancement
* `akashic-cli-init`
  * [#488](https://github.com/akashic-games/akashic-cli/pull/488) add sandbox.config.js to templates of akashic-cli-init ([@dera-](https://github.com/dera-))
  * [#497](https://github.com/akashic-games/akashic-cli/pull/497) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#496](https://github.com/akashic-games/akashic-cli/pull/496) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.66 (2020-09-12)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#490](https://github.com/akashic-games/akashic-cli/pull/490) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.65 (2020-09-12)

#### Enhancement
* `akashic-cli-serve`
  * [#495](https://github.com/akashic-games/akashic-cli/pull/495) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#494](https://github.com/akashic-games/akashic-cli/pull/494) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.64 (2020-09-12)

#### Enhancement
* `akashic-cli-init`
  * [#493](https://github.com/akashic-games/akashic-cli/pull/493) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#491](https://github.com/akashic-games/akashic-cli/pull/491) Update dependency music-metadata to v7.1.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.63 (2020-09-12)

#### Enhancement
* `akashic-cli-serve`
  * [#492](https://github.com/akashic-games/akashic-cli/pull/492) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#487](https://github.com/akashic-games/akashic-cli/pull/487) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-init`
  * [#482](https://github.com/akashic-games/akashic-cli/pull/482) Update dependency bestzip to v2.1.7 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#478](https://github.com/akashic-games/akashic-cli/pull/478) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#477](https://github.com/akashic-games/akashic-cli/pull/477) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.62 (2020-09-04)

#### Enhancement
* `akashic-cli-serve`
  * [#486](https://github.com/akashic-games/akashic-cli/pull/486) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* Other
  * [#485](https://github.com/akashic-games/akashic-cli/pull/485) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#484](https://github.com/akashic-games/akashic-cli/pull/484) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.61 (2020-09-04)

#### Enhancement
* `akashic-cli-export-html`
  * [#483](https://github.com/akashic-games/akashic-cli/pull/483) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.47, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-serve`
  * [#472](https://github.com/akashic-games/akashic-cli/pull/472) apply to storybook v6 in akashic-cli-serve ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.60 (2020-08-25)

#### Enhancement
* `akashic-cli-serve`
  * [#476](https://github.com/akashic-games/akashic-cli/pull/476) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.8, engineFiles@2.1.46, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#475](https://github.com/akashic-games/akashic-cli/pull/475) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.59 (2020-08-25)

#### Enhancement
* `akashic-cli-init`
  * [#474](https://github.com/akashic-games/akashic-cli/pull/474) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#464](https://github.com/akashic-games/akashic-cli/pull/464) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.58 (2020-08-25)

#### Enhancement
* `akashic-cli-init`
  * [#473](https://github.com/akashic-games/akashic-cli/pull/473) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#463](https://github.com/akashic-games/akashic-cli/pull/463) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.57 (2020-08-24)

#### Enhancement
* `akashic-cli-init`
  * [#468](https://github.com/akashic-games/akashic-cli/pull/468) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.56 (2020-08-17)

#### Bug Fix
* `akashic-cli-init`
  * [#466](https://github.com/akashic-games/akashic-cli/pull/466) fix to be able to build and test ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#460](https://github.com/akashic-games/akashic-cli/pull/460) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Republish
* [#467](https://github.com/akashic-games/akashic-cli/pull/467) Republish ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.55 (2020-08-14)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#459](https://github.com/akashic-games/akashic-cli/pull/459) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.54 (2020-08-14)

#### Enhancement
* `akashic-cli-init`
  * [#456](https://github.com/akashic-games/akashic-cli/pull/456) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-install`, `akashic-cli-uninstall`
  * [#457](https://github.com/akashic-games/akashic-cli/pull/457) Changed to use package-lock.json in install and uninstall ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.53 (2020-08-12)

#### Bug Fix
* `akashic-cli-export-zip`, `akashic-cli-serve`
  * [#455](https://github.com/akashic-games/akashic-cli/pull/455) adapt to uglify-js major version update ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.14.52 (2020-08-11)

#### Enhancement
* `akashic-cli-serve`
  * [#440](https://github.com/akashic-games/akashic-cli/pull/440) [akashic-cli-serve] Follow headless-driver@1.2.0 ([@yu-ogi](https://github.com/yu-ogi))
* `akashic-cli-init`
  * [#454](https://github.com/akashic-games/akashic-cli/pull/454) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#440](https://github.com/akashic-games/akashic-cli/pull/440) [akashic-cli-serve] Follow headless-driver@1.2.0 ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.51 (2020-08-09)

#### Enhancement
* `akashic-cli-init`
  * [#452](https://github.com/akashic-games/akashic-cli/pull/452) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#453](https://github.com/akashic-games/akashic-cli/pull/453) Update dependency music-metadata to v7.0.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.50 (2020-08-08)

#### Enhancement
* `akashic-cli-init`
  * [#450](https://github.com/akashic-games/akashic-cli/pull/450) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-zip`, `akashic-cli-serve`
  * [#451](https://github.com/akashic-games/akashic-cli/pull/451) Update dependency @types/react to v16.9.45 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.49 (2020-08-07)

#### Enhancement
* `akashic-cli-init`
  * [#448](https://github.com/akashic-games/akashic-cli/pull/448) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-init`, `akashic-cli-scan`, `akashic-cli-serve`
  * [#447](https://github.com/akashic-games/akashic-cli/pull/447) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.48 (2020-08-07)

#### Enhancement
* `akashic-cli-init`
  * [#445](https://github.com/akashic-games/akashic-cli/pull/445) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#446](https://github.com/akashic-games/akashic-cli/pull/446) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.47 (2020-08-07)

#### Bug Fix
* `akashic-cli-export-html`
  * [#444](https://github.com/akashic-games/akashic-cli/pull/444) fix akashic-export-html to run normally ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.14.46 (2020-08-07)

#### Enhancement
* `akashic-cli-init`
  * [#443](https://github.com/akashic-games/akashic-cli/pull/443) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-serve`
  * [#437](https://github.com/akashic-games/akashic-cli/pull/437) serve refactor ServiceType ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.45 (2020-08-07)

#### Enhancement
* `akashic-cli-init`
  * [#442](https://github.com/akashic-games/akashic-cli/pull/442) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-export-html`
  * [#436](https://github.com/akashic-games/akashic-cli/pull/436) export-html refactor ServiceType ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.44 (2020-08-07)

#### Enhancement
* `akashic-cli-init`
  * [#441](https://github.com/akashic-games/akashic-cli/pull/441) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-export-html`, `akashic-cli-export-zip`
  * [#435](https://github.com/akashic-games/akashic-cli/pull/435) export-zip refactor ServiceType ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.43 (2020-08-07)

#### Enhancement
* `akashic-cli-export-html`
  * [#439](https://github.com/akashic-games/akashic-cli/pull/439) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.7, engineFiles@2.1.46, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
  * [#438](https://github.com/akashic-games/akashic-cli/pull/438) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.7, engineFiles@2.1.45, engineFiles@1.1.16) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#433](https://github.com/akashic-games/akashic-cli/pull/433) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-commons`
  * [#434](https://github.com/akashic-games/akashic-cli/pull/434) Add ServiceType ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.42 (2020-08-04)

#### Enhancement
* `akashic-cli-export-html`
  * [#432](https://github.com/akashic-games/akashic-cli/pull/432) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.7, engineFiles@2.1.45, engineFiles@1.1.15) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#431](https://github.com/akashic-games/akashic-cli/pull/431) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.41 (2020-08-03)

#### Enhancement
* `akashic-cli-export-html`
  * [#430](https://github.com/akashic-games/akashic-cli/pull/430) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.7, engineFiles@2.1.44, engineFiles@1.1.15) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#429](https://github.com/akashic-games/akashic-cli/pull/429) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.40 (2020-08-03)

#### Enhancement
* `akashic-cli-export-html`
  * [#427](https://github.com/akashic-games/akashic-cli/pull/427) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.7, engineFiles@2.1.43, engineFiles@1.1.15) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#426](https://github.com/akashic-games/akashic-cli/pull/426) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.39 (2020-08-01)

#### Enhancement
* `akashic-cli-init`
  * [#424](https://github.com/akashic-games/akashic-cli/pull/424) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#425](https://github.com/akashic-games/akashic-cli/pull/425) Update dependency ts-loader to v8.0.2 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.38 (2020-08-01)

#### Enhancement
* `akashic-cli-init`
  * [#423](https://github.com/akashic-games/akashic-cli/pull/423) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#415](https://github.com/akashic-games/akashic-cli/pull/415) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.37 (2020-08-01)

#### Enhancement
* `akashic-cli-init`
  * [#421](https://github.com/akashic-games/akashic-cli/pull/421) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#416](https://github.com/akashic-games/akashic-cli/pull/416) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.36 (2020-07-31)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#419](https://github.com/akashic-games/akashic-cli/pull/419) Update dependency tslint to v6 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.35 (2020-07-31)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#417](https://github.com/akashic-games/akashic-cli/pull/417) Update dependency @types/eslint to v7 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.34 (2020-07-31)

#### Enhancement
* `akashic-cli-export-html`
  * [#405](https://github.com/akashic-games/akashic-cli/pull/405) Add targetService parameter to exportZip of atumaru ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.33 (2020-07-31)

#### Enhancement
* `akashic-cli-export-zip`
  * [#404](https://github.com/akashic-games/akashic-cli/pull/404) Add targetService Option ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.32 (2020-07-31)

#### Enhancement
* `akashic-cli-commons`
  * [#403](https://github.com/akashic-games/akashic-cli/pull/403) Add targetService to CliConfigExportZip ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.31 (2020-07-30)

#### Enhancement
* `akashic-cli-serve`
  * [#397](https://github.com/akashic-games/akashic-cli/pull/397) add class name to html dom in akashic-cli-serve ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.14.30 (2020-07-30)

#### Enhancement
* `akashic-cli-export-html`
  * [#408](https://github.com/akashic-games/akashic-cli/pull/408) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.7, engineFiles@2.1.42, engineFiles@1.1.15) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.29 (2020-07-30)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#398](https://github.com/akashic-games/akashic-cli/pull/398) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.28 (2020-07-29)

#### Enhancement
* `akashic-cli-serve`
  * [#362](https://github.com/akashic-games/akashic-cli/pull/362) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.6, engineFiles@2.1.41, engineFiles@1.1.15) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#402](https://github.com/akashic-games/akashic-cli/pull/402) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-serve`
  * [#386](https://github.com/akashic-games/akashic-cli/pull/386) Modify travis.yml, Fix serve spec ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#375](https://github.com/akashic-games/akashic-cli/pull/375) Update dev dependencies (major) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.27 (2020-07-24)

#### Enhancement
* `akashic-cli-init`
  * [#395](https://github.com/akashic-games/akashic-cli/pull/395) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#399](https://github.com/akashic-games/akashic-cli/pull/399) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.26 (2020-07-19)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-serve`
  * [#394](https://github.com/akashic-games/akashic-cli/pull/394) Update dependency eslint to v7.5.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.25 (2020-07-18)

#### Enhancement
* `akashic-cli-init`
  * [#391](https://github.com/akashic-games/akashic-cli/pull/391) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-init`
  * [#392](https://github.com/akashic-games/akashic-cli/pull/392) Update dependency @types/jest to v26.0.5 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.24 (2020-07-17)

#### Enhancement
* `akashic-cli-init`
  * [#384](https://github.com/akashic-games/akashic-cli/pull/384) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* [#380](https://github.com/akashic-games/akashic-cli/pull/380) prohibit major update of dependencies ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#387](https://github.com/akashic-games/akashic-cli/pull/387) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.23 (2020-07-14)

#### Enhancement
* `akashic-cli-init`
  * [#383](https://github.com/akashic-games/akashic-cli/pull/383) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#368](https://github.com/akashic-games/akashic-cli/pull/368) Update dependency commander to v5 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.22 (2020-07-14)

#### Enhancement
* `akashic-cli-init`
  * [#382](https://github.com/akashic-games/akashic-cli/pull/382) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#365](https://github.com/akashic-games/akashic-cli/pull/365) Update dependency archiver to v4 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.21 (2020-07-14)

#### Enhancement
* `akashic-cli-init`
  * [#381](https://github.com/akashic-games/akashic-cli/pull/381) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-serve`, `akashic-cli`
  * [#367](https://github.com/akashic-games/akashic-cli/pull/367) Update dependency chokidar to v3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.20 (2020-07-14)

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#366](https://github.com/akashic-games/akashic-cli/pull/366) Update dependency chalk to v4 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.19 (2020-07-13)

#### Enhancement
* `akashic-cli-init`
  * [#379](https://github.com/akashic-games/akashic-cli/pull/379) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#363](https://github.com/akashic-games/akashic-cli/pull/363) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.18 (2020-07-13)

#### Enhancement
* `akashic-cli-init`
  * [#378](https://github.com/akashic-games/akashic-cli/pull/378) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#369](https://github.com/akashic-games/akashic-cli/pull/369) Update dependency ejs to v3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.17 (2020-07-13)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#370](https://github.com/akashic-games/akashic-cli/pull/370) Update dependency eslint to v7 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.16 (2020-07-13)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#371](https://github.com/akashic-games/akashic-cli/pull/371) Update dependency fs-extra to v9 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.15 (2020-07-12)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#372](https://github.com/akashic-games/akashic-cli/pull/372) Update dependency fs-readdir-recursive to v1 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-scan`
  * [#373](https://github.com/akashic-games/akashic-cli/pull/373) Update dependency music-metadata to v7 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.14 (2020-07-11)

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#374](https://github.com/akashic-games/akashic-cli/pull/374) Update dependency uglify-js to v3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.13 (2020-07-11)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#364](https://github.com/akashic-games/akashic-cli/pull/364) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.12 (2020-07-07)

#### Enhancement
* `akashic-cli-init`
  * [#358](https://github.com/akashic-games/akashic-cli/pull/358) akashic-cli-initのテンプレートの依存モジュールを最新のものに更新 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.14.11 (2020-07-03)

#### Enhancement
* `akashic-cli-init`
  * [#361](https://github.com/akashic-games/akashic-cli/pull/361) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-serve`
  * [#360](https://github.com/akashic-games/akashic-cli/pull/360) Update dependency whatwg-fetch to v3.1.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.10 (2020-07-03)

#### Enhancement
* `akashic-cli-init`
  * [#357](https://github.com/akashic-games/akashic-cli/pull/357) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#359](https://github.com/akashic-games/akashic-cli/pull/359) Update dependency typescript to v3.9.6 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.9 (2020-07-03)

#### Enhancement
* `akashic-cli-export-html`
  * [#347](https://github.com/akashic-games/akashic-cli/pull/347) export-htmlに最新のengine-filesを導入した時にv3系のコンテンツを実行できなくなる不具合の修正 ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#354](https://github.com/akashic-games/akashic-cli/pull/354) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.8 (2020-07-01)

#### Enhancement
* `akashic-cli-export-html`
  * [#343](https://github.com/akashic-games/akashic-cli/pull/343) Support tree-shaking of export-html ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#353](https://github.com/akashic-games/akashic-cli/pull/353) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.7 (2020-07-01)

#### Enhancement
* `akashic-cli-export-zip`
  * [#342](https://github.com/akashic-games/akashic-cli/pull/342) Support tree-shaking of export-zip ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#352](https://github.com/akashic-games/akashic-cli/pull/352) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.6 (2020-06-30)

#### Enhancement
* `akashic-cli-commons`
  * [#341](https://github.com/akashic-games/akashic-cli/pull/341) Add omitUnbundledJs parameter of export ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.5 (2020-06-30)

#### Enhancement
* `akashic-cli-serve`
  * [#344](https://github.com/akashic-games/akashic-cli/pull/344) akashic-cli-serveで最新のengine-filesを導入した時にv3系のコンテンツを実行できなくなる不具合の修正 ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#351](https://github.com/akashic-games/akashic-cli/pull/351) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#350](https://github.com/akashic-games/akashic-cli/pull/350) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#348](https://github.com/akashic-games/akashic-cli/pull/348) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.14.4 (2020-06-27)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#345](https://github.com/akashic-games/akashic-cli/pull/345) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.14.3 (2020-06-26)

#### Enhancement
* `akashic-cli-scan`
  * [#334](https://github.com/akashic-games/akashic-cli/pull/334) Add specification of assets directory in scan ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.14.2 (2020-06-22)

#### Enhancement
* `akashic-cli-init`
  * [#339](https://github.com/akashic-games/akashic-cli/pull/339) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#337](https://github.com/akashic-games/akashic-cli/pull/337) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#338](https://github.com/akashic-games/akashic-cli/pull/338) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.41, engineFiles@1.1.15) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-zip`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#340](https://github.com/akashic-games/akashic-cli/pull/340) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.14.1 (2020-06-18)

#### Enhancement
* `akashic-cli-export-html`
  * [#336](https://github.com/akashic-games/akashic-cli/pull/336) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.41, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.14.0 (2020-06-15)

#### Enhancement
* `akashic-cli-serve`
  * [#321](https://github.com/akashic-games/akashic-cli/pull/321) akashic-cli-serveでユーザー名表示許諾ダイアログを表示する対応 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.13.29 (2020-06-12)

#### Enhancement
* `akashic-cli-serve`
  * [#333](https://github.com/akashic-games/akashic-cli/pull/333) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.28 (2020-06-12)

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#331](https://github.com/akashic-games/akashic-cli/pull/331) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.13.27 (2020-06-12)

#### Enhancement
* `akashic-cli-serve`
  * [#332](https://github.com/akashic-games/akashic-cli/pull/332) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.26 (2020-06-12)

#### Enhancement
* `akashic-cli-serve`
  * [#330](https://github.com/akashic-games/akashic-cli/pull/330) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Other Change
* [#326](https://github.com/akashic-games/akashic-cli/pull/326) publishスクリプトにタグ指定オプションを追加 ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.13.25 (2020-06-11)

#### Enhancement
* `akashic-cli-serve`
  * [#329](https://github.com/akashic-games/akashic-cli/pull/329) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#328](https://github.com/akashic-games/akashic-cli/pull/328) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.24 (2020-06-05)

#### Enhancement
* `akashic-cli-init`
  * [#325](https://github.com/akashic-games/akashic-cli/pull/325) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#327](https://github.com/akashic-games/akashic-cli/pull/327) Update dependency typescript to v3.9.5 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.23 (2020-06-03)

#### Enhancement
* `akashic-cli-serve`
  * [#324](https://github.com/akashic-games/akashic-cli/pull/324) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#323](https://github.com/akashic-games/akashic-cli/pull/323) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* [#322](https://github.com/akashic-games/akashic-cli/pull/322) 直下の.npmrcの削除 ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#319](https://github.com/akashic-games/akashic-cli/pull/319) Update dependency scroll-into-view-if-needed to v2.2.25 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.13.22 (2020-05-29)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#320](https://github.com/akashic-games/akashic-cli/pull/320) Update dependency lerna to v3.22.0 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.13.21 (2020-05-26)

#### Enhancement
* `akashic-cli-serve`
  * [#318](https://github.com/akashic-games/akashic-cli/pull/318) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.20 (2020-05-22)

#### Enhancement
* `akashic-cli-serve`
  * [#316](https://github.com/akashic-games/akashic-cli/pull/316) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#315](https://github.com/akashic-games/akashic-cli/pull/315) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.19 (2020-05-22)

#### Enhancement
* `akashic-cli-init`
  * [#313](https://github.com/akashic-games/akashic-cli/pull/313) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#314](https://github.com/akashic-games/akashic-cli/pull/314) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.18 (2020-05-21)

#### Enhancement
* `akashic-cli-serve`
  * [#312](https://github.com/akashic-games/akashic-cli/pull/312) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#311](https://github.com/akashic-games/akashic-cli/pull/311) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#309](https://github.com/akashic-games/akashic-cli/pull/309) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#310](https://github.com/akashic-games/akashic-cli/pull/310) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.40, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.17 (2020-05-18)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#308](https://github.com/akashic-games/akashic-cli/pull/308) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#297](https://github.com/akashic-games/akashic-cli/pull/297) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.13.16 (2020-05-13)

#### Enhancement
* `akashic-cli-serve`
  * [#307](https://github.com/akashic-games/akashic-cli/pull/307) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#306](https://github.com/akashic-games/akashic-cli/pull/306) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.15 (2020-05-13)

#### Enhancement
* `akashic-cli-export-html`
  * [#305](https://github.com/akashic-games/akashic-cli/pull/305) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.5, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
  * [#301](https://github.com/akashic-games/akashic-cli/pull/301) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.4, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-serve`
  * [#304](https://github.com/akashic-games/akashic-cli/pull/304) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.4, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.14 (2020-05-12)

#### Enhancement
* `akashic-cli-init`
  * [#299](https://github.com/akashic-games/akashic-cli/pull/299) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-install`
  * [#300](https://github.com/akashic-games/akashic-cli/pull/300) Add tar module to dependencies ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.13.13 (2020-05-12)

#### Bug Fix
* `akashic-cli-install`
  * [#298](https://github.com/akashic-games/akashic-cli/pull/298) fix tgz file installation ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#295](https://github.com/akashic-games/akashic-cli/pull/295) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.13.12 (2020-04-21)

#### Enhancement
* `akashic-cli-serve`
  * [#294](https://github.com/akashic-games/akashic-cli/pull/294) Add externalValue to the argument of RunnerManager#createRunner() ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.13.11 (2020-04-21)

#### Enhancement
* `akashic-cli-serve`
  * [#296](https://github.com/akashic-games/akashic-cli/pull/296) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.3, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.10 (2020-04-16)

#### Enhancement
* `akashic-cli-init`
  * [#292](https://github.com/akashic-games/akashic-cli/pull/292) Delete unnecessary lines from js template file ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#293](https://github.com/akashic-games/akashic-cli/pull/293) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- xnv ([@xnv](https://github.com/xnv))

## 1.13.9 (2020-04-14)

#### Enhancement
* `akashic-cli-serve`
  * [#287](https://github.com/akashic-games/akashic-cli/pull/287) アツマールAPIの更新に追従する対応 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.13.8 (2020-04-13)

#### Enhancement
* `akashic-cli-serve`
  * [#291](https://github.com/akashic-games/akashic-cli/pull/291) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.3, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#290](https://github.com/akashic-games/akashic-cli/pull/290) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.7 (2020-04-13)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#281](https://github.com/akashic-games/akashic-cli/pull/281) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.13.6 (2020-04-13)

#### Enhancement
* `akashic-cli-serve`
  * [#289](https://github.com/akashic-games/akashic-cli/pull/289) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.3, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#288](https://github.com/akashic-games/akashic-cli/pull/288) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.5 (2020-04-13)

#### Enhancement
* `akashic-cli-export-html`
  * [#286](https://github.com/akashic-games/akashic-cli/pull/286) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.3, engineFiles@2.1.39, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#285](https://github.com/akashic-games/akashic-cli/pull/285) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.4 (2020-04-10)

#### Enhancement
* `akashic-cli-export-html`
  * [#284](https://github.com/akashic-games/akashic-cli/pull/284) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.3, engineFiles@2.1.38, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#280](https://github.com/akashic-games/akashic-cli/pull/280) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.13.3 (2020-04-01)

#### Enhancement
* `akashic-cli-serve`
  * [#279](https://github.com/akashic-games/akashic-cli/pull/279) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.2, engineFiles@2.1.38, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#277](https://github.com/akashic-games/akashic-cli/pull/277) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-serve`
  * [#278](https://github.com/akashic-games/akashic-cli/pull/278) fix to work v1 content ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-export-zip`, `akashic-cli-init`
  * [#274](https://github.com/akashic-games/akashic-cli/pull/274) Set modulePathIgnorePatterns for jest.config.js ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 3
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.13.2 (2020-03-31)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#262](https://github.com/akashic-games/akashic-cli/pull/262) fix akashicConfig.json to akashic.config.js ([@kamakiri01](https://github.com/kamakiri01))
* `akashic-cli-init`
  * [#276](https://github.com/akashic-games/akashic-cli/pull/276) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.13.1 (2020-03-31)

#### Enhancement
* `akashic-cli-serve`
  * [#275](https://github.com/akashic-games/akashic-cli/pull/275) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.2, engineFiles@2.1.38, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#273](https://github.com/akashic-games/akashic-cli/pull/273) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-init`
  * [#272](https://github.com/akashic-games/akashic-cli/pull/272) Update dependency npm-check-updates to v4.1.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#270](https://github.com/akashic-games/akashic-cli/pull/270) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))



## 1.12.2 (2020-03-17)

#### Other Change
* `akashic-cli-init`
  * [#269](https://github.com/akashic-games/akashic-cli/pull/269) Add moduleMainScripts to template game.json ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.12.1 (2020-03-16)

#### Enhancement
* `akashic-cli-serve`
  * [#258](https://github.com/akashic-games/akashic-cli/pull/258) Add devTool niconico ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
  * [#260](https://github.com/akashic-games/akashic-cli/pull/260) Add niconico to devTool ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.12.0 (2020-03-13)

#### Enhancement
* `akashic-cli-init`
  * [#267](https://github.com/akashic-games/akashic-cli/pull/267) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.11.4 (2020-03-12)

#### Enhancement
* `akashic-cli-serve`
  * [#266](https://github.com/akashic-games/akashic-cli/pull/266) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.2, engineFiles@2.1.38, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#265](https://github.com/akashic-games/akashic-cli/pull/265) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#259](https://github.com/akashic-games/akashic-cli/pull/259) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#264](https://github.com/akashic-games/akashic-cli/pull/264) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.2, engineFiles@2.1.38, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#261](https://github.com/akashic-games/akashic-cli/pull/261) Update dependency npm-check-updates to v4.0.4 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#255](https://github.com/akashic-games/akashic-cli/pull/255) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#254](https://github.com/akashic-games/akashic-cli/pull/254) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-init`
  * [#253](https://github.com/akashic-games/akashic-cli/pull/253) Pin dependency typescript to 3.8.3 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.11.3 (2020-02-28)

#### Other Change
* `akashic-cli-export-html`
  * [#257](https://github.com/akashic-games/akashic-cli/pull/257) atsumaruオプションでexport html実行時に、対象のruntime-versionがpreleaseバージョンの時警告を出す対応 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.11.2 (2020-02-26)

#### Enhancement
* `akashic-cli-serve`
  * [#256](https://github.com/akashic-games/akashic-cli/pull/256) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@3.0.0-beta.2, engineFiles@2.1.37, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#252](https://github.com/akashic-games/akashic-cli/pull/252) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-serve`
  * [#248](https://github.com/akashic-games/akashic-cli/pull/248) display called atsumaru-api on console ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.11.1 (2020-02-21)

#### Enhancement
* `akashic-cli-export-html`
  * [#251](https://github.com/akashic-games/akashic-cli/pull/251) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.2, engineFiles@2.1.37, engineFiles@1.1.14) ([@xnv](https://github.com/xnv))
  * [#249](https://github.com/akashic-games/akashic-cli/pull/249) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@3.0.0-beta.1, engineFiles@2.1.36, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))
* `akashic-cli-init`
  * [#250](https://github.com/akashic-games/akashic-cli/pull/250) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))
  * [#247](https://github.com/akashic-games/akashic-cli/pull/247) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.11.0 (2020-02-19)

#### Enhancement
* `akashic-cli-init`
  * [#244](https://github.com/akashic-games/akashic-cli/pull/244) akashic-cli-initにv3用のテンプレートを追加 ([@dera-](https://github.com/dera-))
  * [#243](https://github.com/akashic-games/akashic-cli/pull/243) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#246](https://github.com/akashic-games/akashic-cli/pull/246) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#242](https://github.com/akashic-games/akashic-cli/pull/242) Pin dependency typescript to 3.7.5 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.10.0 (2020-02-10)

#### Enhancement
* `akashic-cli-serve`
  * [#227](https://github.com/akashic-games/akashic-cli/pull/227) akashic-cli-serveの --target-service オプションに atsumaru を追加 ([@dera-](https://github.com/dera-))
  * [#234](https://github.com/akashic-games/akashic-cli/pull/234) RPGアツマールのマスターボリュームAPIモック機能を作成 ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#241](https://github.com/akashic-games/akashic-cli/pull/241) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.9.0 (2020-02-06)

#### Enhancement
* `akashic-cli-export-html`, `akashic-cli-serve`
  * [#232](https://github.com/akashic-games/akashic-cli/pull/232) v3系のengineを利用しているコンテンツも動かせるよう対応(akashic-cli-serve, akashic-cli-export-html) ([@dera-](https://github.com/dera-))
* `akashic-cli-init`
  * [#240](https://github.com/akashic-games/akashic-cli/pull/240) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.8.36 (2020-02-06)

#### Enhancement
* `akashic-cli-init`
  * [#237](https://github.com/akashic-games/akashic-cli/pull/237) akashic-cli-initのテンプレート中の内部モジュール更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.8.35 (2020-01-31)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#233](https://github.com/akashic-games/akashic-cli/pull/233) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.8.34 (2020-01-30)

#### Bug Fix
* `akashic-cli-serve`
  * [#223](https://github.com/akashic-games/akashic-cli/pull/223) fix: loading timing of sandboxConfig ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Other Change
* [#231](https://github.com/akashic-games/akashic-cli/pull/231) Remove node-v8 from travis.yml and add node-v12 ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#230](https://github.com/akashic-games/akashic-cli/pull/230) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#229](https://github.com/akashic-games/akashic-cli/pull/229) Pin dependency npm-check-updates to 4.0.1 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.8.33 (2020-01-17)

#### Other Change
* `akashic-cli-serve`
  * [#225](https://github.com/akashic-games/akashic-cli/pull/225) fix: sandbox.config.js in autoSendEvents is deprecated ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-init`
  * [#220](https://github.com/akashic-games/akashic-cli/pull/220) akashic-cli-initのテンプレートディレクトリが依存するakashicモジュールを最新に更新するスクリプトの作成 ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#216](https://github.com/akashic-games/akashic-cli/pull/216) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#215](https://github.com/akashic-games/akashic-cli/pull/215) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
- [@dera-](https://github.com/dera-)

## 1.8.32 (2020-01-07)

#### Enhancement
* `akashic-cli-serve`
  * [#222](https://github.com/akashic-games/akashic-cli/pull/222) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.35, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))



## 1.8.30 (2019-12-18)

#### Enhancement
* `akashic-cli-serve`
  * [#210](https://github.com/akashic-games/akashic-cli/pull/210) Add Playlog dump function ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.8.29 (2019-12-17)

#### Enhancement
* `akashic-cli-serve`
  * [#203](https://github.com/akashic-games/akashic-cli/pull/203) akashic-cli-serveでplaylogを予め読み込んだplayを作成できるようにした ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#212](https://github.com/akashic-games/akashic-cli/pull/212) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.8.28 (2019-12-16)

#### Enhancement
* `akashic-cli-serve`
  * [#214](https://github.com/akashic-games/akashic-cli/pull/214) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.35, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.27 (2019-12-16)

#### Enhancement
* `akashic-cli-export-html`
  * [#213](https://github.com/akashic-games/akashic-cli/pull/213) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.35, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.26 (2019-12-13)

#### Enhancement
* `akashic-cli-serve`
  * [#202](https://github.com/akashic-games/akashic-cli/pull/202) Add allow-external option ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.8.25 (2019-12-13)

#### Enhancement
* `akashic-cli-serve`
  * [#211](https://github.com/akashic-games/akashic-cli/pull/211) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.34, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.24 (2019-12-10)

#### Enhancement
* `akashic-cli-serve`
  * [#209](https://github.com/akashic-games/akashic-cli/pull/209) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.34, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.23 (2019-12-10)

#### Enhancement
* `akashic-cli-export-html`
  * [#208](https://github.com/akashic-games/akashic-cli/pull/208) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.34, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#207](https://github.com/akashic-games/akashic-cli/pull/207) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.22 (2019-12-06)

#### Enhancement
* `akashic-cli-export-html`
  * [#206](https://github.com/akashic-games/akashic-cli/pull/206) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.33, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.8.21 (2019-12-05)

#### Enhancement
* `akashic-cli-serve`
  * [#204](https://github.com/akashic-games/akashic-cli/pull/204) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.33、engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#201](https://github.com/akashic-games/akashic-cli/pull/201) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#200](https://github.com/akashic-games/akashic-cli/pull/200) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.20 (2019-11-27)

#### Bug Fix
* `akashic-cli-init`
  * [#199](https://github.com/akashic-games/akashic-cli/pull/199) fix init --yes option ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.8.19 (2019-11-27)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#172](https://github.com/akashic-games/akashic-cli/pull/172) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#175](https://github.com/akashic-games/akashic-cli/pull/175) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#180](https://github.com/akashic-games/akashic-cli/pull/180) Pin dependencies ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 0


## 1.8.18 (2019-11-22)

#### Bug Fix
* `akashic-cli-export-html`
  * [#198](https://github.com/akashic-games/akashic-cli/pull/198) eslint js files ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.8.17 (2019-11-21)

#### Enhancement
* `akashic-cli-scan`
  * [#197](https://github.com/akashic-games/akashic-cli/pull/197) Add a command to scan assets with the file extensions ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 1.8.16 (2019-11-20)

#### Enhancement
* `akashic-cli-scan`
  * [#195](https://github.com/akashic-games/akashic-cli/pull/195) Add a command to rescan Asset IDs ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.8.15 (2019-11-19)

#### Enhancement
* `akashic-cli-scan`
  * [#183](https://github.com/akashic-games/akashic-cli/pull/183) specify scan dirs, asset extension ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.8.14 (2019-11-14)

#### Other Change
* `akashic-cli-scan`
  * [#189](https://github.com/akashic-games/akashic-cli/pull/189) other: replace musicmetadata to music-metadata ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))
* `akashic-cli-export-html`
  * [#190](https://github.com/akashic-games/akashic-cli/pull/190) other: replace deprecated module ect to ejs ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.8.13 (2019-11-12)

#### Bug Fix
* `akashic-cli-serve`
  * [#186](https://github.com/akashic-games/akashic-cli/pull/186) fix: server stopped to contents error ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.8.12 (2019-11-07)

#### Enhancement
* `akashic-cli-serve`
  * [#192](https://github.com/akashic-games/akashic-cli/pull/192) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.32、engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.11 (2019-11-07)

#### Enhancement
* `akashic-cli-export-html`
  * [#191](https://github.com/akashic-games/akashic-cli/pull/191) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.32, engineFiles@1.1.13) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.10 (2019-11-06)

#### Enhancement
* `akashic-cli-serve`
  * [#188](https://github.com/akashic-games/akashic-cli/pull/188) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.32、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.9 (2019-11-06)

#### Enhancement
* `akashic-cli-export-html`
  * [#187](https://github.com/akashic-games/akashic-cli/pull/187) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.32, engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.8 (2019-11-06)

#### Other Change
* `akashic-cli-serve`
  * [#182](https://github.com/akashic-games/akashic-cli/pull/182) refactor: Refactor functions with names toggle ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.8.7 (2019-11-05)

#### Enhancement
* `akashic-cli-serve`
  * [#185](https://github.com/akashic-games/akashic-cli/pull/185) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.31、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.6 (2019-11-05)

#### Enhancement
* `akashic-cli-export-html`
  * [#184](https://github.com/akashic-games/akashic-cli/pull/184) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.31, engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.5 (2019-10-31)

#### Enhancement
* `akashic-cli-serve`
  * [#181](https://github.com/akashic-games/akashic-cli/pull/181) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.30、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))



## 1.8.3 (2019-10-16)

#### Enhancement
* `akashic-cli-serve`
  * [#177](https://github.com/akashic-games/akashic-cli/pull/177) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.30、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.2 (2019-10-16)

#### Enhancement
* `akashic-cli-export-html`
  * [#176](https://github.com/akashic-games/akashic-cli/pull/176) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.30, engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.8.1 (2019-10-15)

#### Other Change
* `akashic-cli-install`
  * [#174](https://github.com/akashic-games/akashic-cli/pull/174) akashic-cli-installのテストフレームワークをjestに変更 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.8.0 (2019-10-10)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#171](https://github.com/akashic-games/akashic-cli/pull/171) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- [@yu-ogi](https://github.com/yu-ogi)

## 1.7.35 (2019-10-08)

#### Enhancement
* `akashic-cli-export-html`
  * [#146](https://github.com/akashic-games/akashic-cli/pull/146) enable sandbox.config.js, send autoSendEvents for export-html ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.7.34 (2019-10-04)

#### Enhancement
* `akashic-cli-serve`
  * [#147](https://github.com/akashic-games/akashic-cli/pull/147) akashic-cli-serveにグリッド描画機能の追加 ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.7.33 (2019-10-02)

#### Republish
* [#169](https://github.com/akashic-games/akashic-cli/pull/169) Republish ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.32 (2019-10-02)

#### Enhancement
* `akashic-cli-serve`
  * [#168](https://github.com/akashic-games/akashic-cli/pull/168) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.29、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.31 (2019-10-02)

#### Enhancement
* `akashic-cli-export-html`
  * [#167](https://github.com/akashic-games/akashic-cli/pull/167) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.29, engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.30 (2019-10-01)

#### Enhancement
* `akashic-cli-serve`
  * [#165](https://github.com/akashic-games/akashic-cli/pull/165) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.28、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))
* `akashic-cli-export-html`
  * [#164](https://github.com/akashic-games/akashic-cli/pull/164) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.28, engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-export-zip`, `akashic-cli-serve`
  * [#163](https://github.com/akashic-games/akashic-cli/pull/163) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#162](https://github.com/akashic-games/akashic-cli/pull/162) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.29 (2019-09-25)

#### Enhancement
* `akashic-cli-serve`
  * [#160](https://github.com/akashic-games/akashic-cli/pull/160) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.27、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.28 (2019-09-25)

#### Enhancement
* `akashic-cli-export-html`
  * [#159](https://github.com/akashic-games/akashic-cli/pull/159) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.27、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.27 (2019-09-24)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`
  * [#157](https://github.com/akashic-games/akashic-cli/pull/157) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#156](https://github.com/akashic-games/akashic-cli/pull/156) Update dependency webpack-cli to v3.3.9 ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.26 (2019-09-20)

#### Enhancement
* `akashic-cli-serve`
  * [#155](https://github.com/akashic-games/akashic-cli/pull/155) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.26、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.25 (2019-09-20)

#### Enhancement
* `akashic-cli-export-html`
  * [#154](https://github.com/akashic-games/akashic-cli/pull/154) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.26、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.24 (2019-09-20)

#### Enhancement
* `akashic-cli-serve`
  * [#153](https://github.com/akashic-games/akashic-cli/pull/153) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.25、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.23 (2019-09-20)

#### Enhancement
* `akashic-cli-export-html`
  * [#152](https://github.com/akashic-games/akashic-cli/pull/152) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.25、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#151](https://github.com/akashic-games/akashic-cli/pull/151) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#150](https://github.com/akashic-games/akashic-cli/pull/150) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.22 (2019-09-13)

#### Enhancement
* `akashic-cli-serve`
  * [#149](https://github.com/akashic-games/akashic-cli/pull/149) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.24、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.21 (2019-09-13)

#### Enhancement
* `akashic-cli-export-html`
  * [#148](https://github.com/akashic-games/akashic-cli/pull/148) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.24、engineFiles@1.1.12) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.20 (2019-09-09)

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#145](https://github.com/akashic-games/akashic-cli/pull/145) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.19 (2019-09-06)

#### Enhancement
* `akashic-cli-serve`
  * [#144](https://github.com/akashic-games/akashic-cli/pull/144) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.24、engineFiles@1.1.11) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.18 (2019-09-06)

#### Enhancement
* `akashic-cli-export-html`
  * [#143](https://github.com/akashic-games/akashic-cli/pull/143) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.24、engineFiles@1.1.11) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#138](https://github.com/akashic-games/akashic-cli/pull/138) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#141](https://github.com/akashic-games/akashic-cli/pull/141) Pin dependency jest to 24.8.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#137](https://github.com/akashic-games/akashic-cli/pull/137) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.17 (2019-08-30)

#### Enhancement
* `akashic-cli-serve`
  * [#140](https://github.com/akashic-games/akashic-cli/pull/140) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.23、engineFiles@1.1.11) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.16 (2019-08-30)

#### Enhancement
* `akashic-cli-export-html`
  * [#139](https://github.com/akashic-games/akashic-cli/pull/139) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.23、engineFiles@1.1.11) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.15 (2019-08-30)

#### Enhancement
* `akashic-cli-init`
  * [#124](https://github.com/akashic-games/akashic-cli/pull/124) akashic-cli-initのランキング対応新市場コンテンツテンプレートの修正 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.7.14 (2019-08-28)

#### Other Change
* `akashic-cli-export-zip`, `akashic-cli-modify`, `akashic-cli-serve`, `akashic-cli-uninstall`
  * [#129](https://github.com/akashic-games/akashic-cli/pull/129) akashic-cli-xxxモジュールのテストフレームワークをjestに変更 その3 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.7.13 (2019-08-28)

#### Enhancement
* `akashic-cli-serve`
  * [#125](https://github.com/akashic-games/akashic-cli/pull/125) --target-serviceオプション機能の追加 ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

#### Committers: 1
- ShinobuTakahashi ([@ShinobuTakahashi](https://github.com/ShinobuTakahashi))

## 1.7.12 (2019-08-22)

#### Enhancement
* `akashic-cli-serve`
  * [#136](https://github.com/akashic-games/akashic-cli/pull/136) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.22、engineFiles@1.1.11) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.11 (2019-08-22)

#### Enhancement
* `akashic-cli-export-html`
  * [#135](https://github.com/akashic-games/akashic-cli/pull/135) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.22、engineFiles@1.1.11) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-update`
  * [#132](https://github.com/akashic-games/akashic-cli/pull/132) Update dependency jest to v24.9.0 ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#133](https://github.com/akashic-games/akashic-cli/pull/133) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.10 (2019-08-16)

#### Enhancement
* `akashic-cli-serve`
  * [#130](https://github.com/akashic-games/akashic-cli/pull/130) add autoSendEvent for serve ([@kamakiri01](https://github.com/kamakiri01))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#117](https://github.com/akashic-games/akashic-cli/pull/117) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#116](https://github.com/akashic-games/akashic-cli/pull/116) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.7.9 (2019-08-09)

#### Enhancement
* `akashic-cli-serve`
  * [#128](https://github.com/akashic-games/akashic-cli/pull/128) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.22、engineFiles@1.1.10)  ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.8 (2019-08-09)

#### Enhancement
* `akashic-cli-export-html`
  * [#127](https://github.com/akashic-games/akashic-cli/pull/127) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.22、engineFiles@1.1.10) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.7 (2019-08-01)

#### Enhancement
* `akashic-cli-serve`
  * [#118](https://github.com/akashic-games/akashic-cli/pull/118) add game.external.send nico to serve ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.7.6 (2019-07-31)

#### Enhancement
* `akashic-cli-export-html`
  * [#123](https://github.com/akashic-games/akashic-cli/pull/123) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.21、engineFiles@1.1.10) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.5 (2019-07-30)

#### Enhancement
* `akashic-cli-serve`
  * [#120](https://github.com/akashic-games/akashic-cli/pull/120) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.21、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Bug Fix
* `akashic-cli-serve`
  * [#121](https://github.com/akashic-games/akashic-cli/pull/121) akashic-cli-serveに依存しているamflowとplaylogのバージョンを前のものに戻す対応 ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-serve`
  * [#121](https://github.com/akashic-games/akashic-cli/pull/121) akashic-cli-serveに依存しているamflowとplaylogのバージョンを前のものに戻す対応 ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.7.4 (2019-07-30)

#### Enhancement
* `akashic-cli-export-html`
  * [#119](https://github.com/akashic-games/akashic-cli/pull/119) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.21、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-update`
  * [#115](https://github.com/akashic-games/akashic-cli/pull/115) Update dependency lodash to v4.17.13 [SECURITY] ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-update`
  * [#114](https://github.com/akashic-games/akashic-cli/pull/114) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#113](https://github.com/akashic-games/akashic-cli/pull/113) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))
  * [#112](https://github.com/akashic-games/akashic-cli/pull/112) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.7.3 (2019-07-08)

#### Enhancement
* `akashic-cli-init`, `akashic-cli-serve`
  * [#101](https://github.com/akashic-games/akashic-cli/pull/101) akashic-cli-initにユーザー入力をスキップするオプションを追加+publish後に動作確認するためのスクリプトを作成 ([@dera-](https://github.com/dera-))
* `akashic-cli-serve`
  * [#108](https://github.com/akashic-games/akashic-cli/pull/108) Introduce ContentStore ([@xnv](https://github.com/xnv))

#### Other Change
* `akashic-cli-init`, `akashic-cli-serve`
  * [#101](https://github.com/akashic-games/akashic-cli/pull/101) akashic-cli-initにユーザー入力をスキップするオプションを追加+publish後に動作確認するためのスクリプトを作成 ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#107](https://github.com/akashic-games/akashic-cli/pull/107) Update all dependencies (minor) ([@renovate[bot]](https://github.com/apps/renovate))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.7.2 (2019-07-02)

#### Other Change
* [#94](https://github.com/akashic-games/akashic-cli/pull/94) 何も変更を加えずにpublishするnpm-scriptを追加 ([@dera-](https://github.com/dera-))

#### Update Dependencies
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#106](https://github.com/akashic-games/akashic-cli/pull/106) Update all dependencies (patch) ([@renovate[bot]](https://github.com/apps/renovate))

#### Republish
* [#111](https://github.com/akashic-games/akashic-cli/pull/111) Republish ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.7.1 (2019-06-28)

#### Enhancement
* `akashic-cli-serve`
  * [#110](https://github.com/akashic-games/akashic-cli/pull/110) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.19、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))
* `akashic-cli-export-zip`
  * [#109](https://github.com/akashic-games/akashic-cli/pull/109) export-htmlでatsumaruオプション実行時もgame.jsonにexport-zip実行時の情報が出力されるようにする ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.7.0 (2019-06-24)

#### Breaking Change
* `akashic-cli-serve`
  * [#102](https://github.com/akashic-games/akashic-cli/pull/102) Enable "use strict" and Add Notification component ([@yu-ogi](https://github.com/yu-ogi))

#### Enhancement
* `akashic-cli-serve`
  * [#102](https://github.com/akashic-games/akashic-cli/pull/102) Enable "use strict" and Add Notification component ([@yu-ogi](https://github.com/yu-ogi))

#### Other Change
* Other
  * [#104](https://github.com/akashic-games/akashic-cli/pull/104) majorバージョンアップをrenovateの対象外にする対応 ([@dera-](https://github.com/dera-))
  * [#103](https://github.com/akashic-games/akashic-cli/pull/103) Configure Renovate ([@renovate[bot]](https://github.com/apps/renovate))
* `akashic-cli-serve`
  * [#100](https://github.com/akashic-games/akashic-cli/pull/100) refactor: introduce ContentLocator ([@xnv](https://github.com/xnv))

#### Committers: 3
- [@dera-](https://github.com/dera-)
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 1.6.9 (2019-06-20)

#### Enhancement
* `akashic-cli-init`
  * [#96](https://github.com/akashic-games/akashic-cli/pull/96) akashic-cli-initのjavascriptテンプレートの.eslintrc.jsonの修正 ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-commons`, `akashic-cli-config`
  * [#91](https://github.com/akashic-games/akashic-cli/pull/91) akashic-cli-commonsとakashic-cli-configのテストフレームワークをjestに変更 ([@dera-](https://github.com/dera-))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.6.8 (2019-06-11)

#### Enhancement
* `akashic-cli-serve`
  * [#98](https://github.com/akashic-games/akashic-cli/pull/98) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.19、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.6.7 (2019-06-11)

#### Enhancement
* `akashic-cli-serve`
  * [#97](https://github.com/akashic-games/akashic-cli/pull/97) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.19、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.6.6 (2019-06-11)

#### Enhancement
* `akashic-cli-serve`
  * [#95](https://github.com/akashic-games/akashic-cli/pull/95) 【akashic-cli-serve】内部コンポーネントの更新(engineFiles@2.1.19、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.6.5 (2019-06-11)

#### Enhancement
* `akashic-cli-export-html`
  * [#93](https://github.com/akashic-games/akashic-cli/pull/93) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.19、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))
* `akashic-cli-serve`
  * [#92](https://github.com/akashic-games/akashic-cli/pull/92) Follow headless-driver@0.4.3 ([@yu-ogi](https://github.com/yu-ogi))

#### Committers: 2
- [@yu-ogi](https://github.com/yu-ogi)
- xnv ([@xnv](https://github.com/xnv))

## 1.6.4 (2019-06-11)

#### Bug Fix
* `akashic-cli-export-zip`, `akashic-cli-init`
  * [#87](https://github.com/akashic-games/akashic-cli/pull/87) akashic-cliのpublish処理が遅い問題への対応 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.6.3 (2019-06-06)

#### Bug Fix
* `akashic-cli-init`
  * [#86](https://github.com/akashic-games/akashic-cli/pull/86) initのnode12対応 ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))

## 1.6.2 (2019-06-05)

#### Enhancement
* `akashic-cli-export-html`
  * [#90](https://github.com/akashic-games/akashic-cli/pull/90) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.18、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.6.1 (2019-06-05)

#### Enhancement
* `akashic-cli-export-html`
  * [#89](https://github.com/akashic-games/akashic-cli/pull/89) 【akashic-cli-export-html】内部コンポーネントの更新(engineFiles@2.1.17、engineFiles@1.1.9) ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.6.0 (2019-06-03)

#### Breaking Change
* `akashic-cli-init`
  * [#84](https://github.com/akashic-games/akashic-cli/pull/84) akashic-cli-initのテンプレートディレクトリを生成できるようにした ([@dera-](https://github.com/dera-))
  * [#79](https://github.com/akashic-games/akashic-cli/pull/79) akashic-cli-initのテンプレートディレクトリを生成できるようにした ([@dera-](https://github.com/dera-))

#### Enhancement
* `akashic-cli-init`
  * [#84](https://github.com/akashic-games/akashic-cli/pull/84) akashic-cli-initのテンプレートディレクトリを生成できるようにした ([@dera-](https://github.com/dera-))
  * [#79](https://github.com/akashic-games/akashic-cli/pull/79) akashic-cli-initのテンプレートディレクトリを生成できるようにした ([@dera-](https://github.com/dera-))

#### Documentation
* `akashic-cli-init`
  * [#84](https://github.com/akashic-games/akashic-cli/pull/84) akashic-cli-initのテンプレートディレクトリを生成できるようにした ([@dera-](https://github.com/dera-))
  * [#79](https://github.com/akashic-games/akashic-cli/pull/79) akashic-cli-initのテンプレートディレクトリを生成できるようにした ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)



## 1.5.32 (2019-05-30)

#### Other Change
* `akashic-cli-export-html`, `akashic-cli-init`, `akashic-cli-stat`, `akashic-cli-update`, `akashic-cli`
  * [#85](https://github.com/akashic-games/akashic-cli/pull/85) Fix broken publish v1.5.31 (with ignorable changes) ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.5.31 (2019-05-29)

#### Other Change
* `akashic-cli-export-html`, `akashic-cli-init`, `akashic-cli-stat`, `akashic-cli-update`, `akashic-cli`
  * [#82](https://github.com/akashic-games/akashic-cli/pull/82) akashic-cli-xxxモジュールのテストフレームワークをjestに変更 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.5.30 (2019-05-23)

#### Enhancement
* `akashic-cli-init`
  * [#77](https://github.com/akashic-games/akashic-cli/pull/77) 新市場コンテンツ用のテンプレートを新規作成+akashic init実行時に一部ファイルを取得できない不具合の修正 ([@dera-](https://github.com/dera-))

#### Bug Fix
* `akashic-cli-init`
  * [#77](https://github.com/akashic-games/akashic-cli/pull/77) 新市場コンテンツ用のテンプレートを新規作成+akashic init実行時に一部ファイルを取得できない不具合の修正 ([@dera-](https://github.com/dera-))

#### Documentation
* `akashic-cli-init`
  * [#77](https://github.com/akashic-games/akashic-cli/pull/77) 新市場コンテンツ用のテンプレートを新規作成+akashic init実行時に一部ファイルを取得できない不具合の修正 ([@dera-](https://github.com/dera-))

#### Other Change
* `akashic-cli-commons`, `akashic-cli-config`, `akashic-cli-export-html`, `akashic-cli-export-zip`, `akashic-cli-init`, `akashic-cli-install`, `akashic-cli-modify`, `akashic-cli-scan`, `akashic-cli-serve`, `akashic-cli-stat`, `akashic-cli-uninstall`, `akashic-cli-update`, `akashic-cli`
  * [#81](https://github.com/akashic-games/akashic-cli/pull/81) remarkのプリセットとして@akashic/remark-preset-lintを使うよう変更 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.5.29 (2019-05-22)

#### Enhancement
* `akashic-cli-commons`, `akashic-cli-export-html`, `akashic-cli-export-zip`
  * [#80](https://github.com/akashic-games/akashic-cli/pull/80) exportを行ったツールのexport実行時のバージョンとオプションが表示されるようにする対応 ([@dera-](https://github.com/dera-))

#### Committers: 1
- [@dera-](https://github.com/dera-)

## 1.5.28 (2019-05-07)

#### Enhancement
* `akashic-cli-serve`
  * [#76](https://github.com/akashic-games/akashic-cli/pull/76) akashic-cli-serveで背景画像を表示する機能を追加 ([@kamakiri01](https://github.com/kamakiri01))

#### Committers: 1
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))





## 1.5.25 (2019-04-17)

#### Bug Fix
* `akashic-cli-config`
  * [#68](https://github.com/akashic-games/akashic-cli/pull/68) fix cli init help message show config help ([@kamakiri01](https://github.com/kamakiri01))
* `akashic-cli-scan`
  * [#67](https://github.com/akashic-games/akashic-cli/pull/67) scanで一部のメッセージがおかしい問題を修正 ([@xnv](https://github.com/xnv))

#### Committers: 2
- kamakiri_ys ([@kamakiri01](https://github.com/kamakiri01))
- xnv ([@xnv](https://github.com/xnv))

## 1.5.24 (2019-04-09)

#### Enhancement
* `akashic-cli-serve`
  * [#65](https://github.com/akashic-games/akashic-cli/pull/65) 内部コンポーネントの更新 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

## 1.5.23 (2019-04-09)

#### Enhancement
* `akashic-cli-export-html`
  * [#64](https://github.com/akashic-games/akashic-cli/pull/64) 内部コンポーネントの更新 ([@xnv](https://github.com/xnv))

#### Committers: 1
- xnv ([@xnv](https://github.com/xnv))

## 1.5.22 (2019-04-08)

#### Enhancement
* [#52](https://github.com/akashic-games/akashic-cli/pull/52) CHANGELOGの生成方法の変更 ([@dera-](https://github.com/dera-))

#### Bug Fix
* `akashic-cli-serve`
  * [#63](https://github.com/akashic-games/akashic-cli/pull/63) arguments のないコンテンツを `-A` オプションで起動するとエラーになる問題を修正 ([@xnv](https://github.com/xnv))

#### Committers: 2
- [@dera-](https://github.com/dera-)
- xnv ([@xnv](https://github.com/xnv))

