# @akashic/akashic-cli-export

## 2.0.8

### Patch Changes

- Updated dependencies [[`ce1f14a`](https://github.com/akashic-games/akashic-cli/commit/ce1f14a914464bff1bc3f67913a2096bb0125843)]:
  - @akashic/akashic-cli-commons@1.0.1
  - @akashic/akashic-cli-extra@2.0.1

## 2.0.7

### Patch Changes

- [#1588](https://github.com/akashic-games/akashic-cli/pull/1588) [`955e105`](https://github.com/akashic-games/akashic-cli/commit/955e10510fe6f961c7a47a3425c45574b2e4ca94) Thanks [@dera-](https://github.com/dera-)! - change runtime-version-table url

## 2.0.6

### Patch Changes

- [#1563](https://github.com/akashic-games/akashic-cli/pull/1563) [`baada51`](https://github.com/akashic-games/akashic-cli/commit/baada5144717ac40c74d01eceb7cf62837204079) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.17.5`.

## 2.0.5

### Patch Changes

- [#1553](https://github.com/akashic-games/akashic-cli/pull/1553) [`1165411`](https://github.com/akashic-games/akashic-cli/commit/1165411463a9567bc853a2e0c93b4a69f6f1ae62) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.17.4`.

## 2.0.4

### Patch Changes

- [#1483](https://github.com/akashic-games/akashic-cli/pull/1483) [`c0fdad7`](https://github.com/akashic-games/akashic-cli/commit/c0fdad7105d41ebf6ce8d9b1ffab13f91df54260) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.17.3`.

## 2.0.3

### Patch Changes

- [#1546](https://github.com/akashic-games/akashic-cli/pull/1546) [`50e76c1`](https://github.com/akashic-games/akashic-cli/commit/50e76c18698d40f65aca5c422f0e1732b42dc8b6) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Remove imageAsset hint.untainted in export-html

## 2.0.2

### Patch Changes

- [#1544](https://github.com/akashic-games/akashic-cli/pull/1544) [`bcc0ed7`](https://github.com/akashic-games/akashic-cli/commit/bcc0ed71a7bfd8fbdeebdc5c37a17e4f06ac383e) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Fix crash on v1 games and crash for directory output

## 2.0.1

### Patch Changes

- [#1539](https://github.com/akashic-games/akashic-cli/pull/1539) [`d7f8ee8`](https://github.com/akashic-games/akashic-cli/commit/d7f8ee8822ae36c0aac106d4c740e93d1f87a262) Thanks [@yu-ogi](https://github.com/yu-ogi)! - prevent error when both `--nicolive` and `--force` options are passed

## 2.0.0

### Major Changes

- [#1440](https://github.com/akashic-games/akashic-cli/pull/1440) [`54c2a58`](https://github.com/akashic-games/akashic-cli/commit/54c2a5836194fc7f74a2c2ef869ccfa47a044765) Thanks [@yu-ogi](https://github.com/yu-ogi)! - - [#1494](https://github.com/akashic-games/akashic-cli/pull/1494) feat(sandbox): support custom font
  - [#1492](https://github.com/akashic-games/akashic-cli/pull/1492) feat(serve): support custom fonts
  - [#1490](https://github.com/akashic-games/akashic-cli/pull/1490) Support akashic config js in scan
  - [#1489](https://github.com/akashic-games/akashic-cli/pull/1489) Use debug engineFiles in serve
  - [#1487](https://github.com/akashic-games/akashic-cli/pull/1487) Support es-downpile in export-html
  - [#1486](https://github.com/akashic-games/akashic-cli/pull/1486) feat(export): support text asset bundle
  - [#1480](https://github.com/akashic-games/akashic-cli/pull/1480) chore(serve): remove broken/unused test
  - [#1479](https://github.com/akashic-games/akashic-cli/pull/1479) feat(serve): migrate to esm
  - [#1472](https://github.com/akashic-games/akashic-cli/pull/1472) Fix export downpile
  - [#1469](https://github.com/akashic-games/akashic-cli/pull/1469) feat: support akashic.config.cjs, akashic.config.mjs
  - [#1467](https://github.com/akashic-games/akashic-cli/pull/1467) Add license file validation to export
  - [#1465](https://github.com/akashic-games/akashic-cli/pull/1465) feat(export): bundle script assets as an assetBundle
  - [#1460](https://github.com/akashic-games/akashic-cli/pull/1460) Remove cliconfig and configfile from commons
  - [#1455](https://github.com/akashic-games/akashic-cli/pull/1455) Add licene file to export zip
  - [#1450](https://github.com/akashic-games/akashic-cli/pull/1450) Fix storybook style
  - [#1447](https://github.com/akashic-games/akashic-cli/pull/1447) feat(export): use terser to minify
  - [#1445](https://github.com/akashic-games/akashic-cli/pull/1445) build(serve): introduce Vite instead of webpack
  - [#1444](https://github.com/akashic-games/akashic-cli/pull/1444) fix(export): fix exporting issue
  - [#1443](https://github.com/akashic-games/akashic-cli/pull/1443) refactor(serve): rename .css to .module.css
  - [#1441](https://github.com/akashic-games/akashic-cli/pull/1441) chore: add tsconfig.test.json
  - [#1439](https://github.com/akashic-games/akashic-cli/pull/1439) chore(extra): fix eol
  - [#1437](https://github.com/akashic-games/akashic-cli/pull/1437) feat(cli): migrate to esm
  - [#1430](https://github.com/akashic-games/akashic-cli/pull/1430) feat(init): migrate to esm
  - [#1422](https://github.com/akashic-games/akashic-cli/pull/1422) feat(sandbox): migrate to esm
  - [#1421](https://github.com/akashic-games/akashic-cli/pull/1421) feat(lib-manage): migrate to esm

### Patch Changes

- [#1506](https://github.com/akashic-games/akashic-cli/pull/1506) [`d66e322`](https://github.com/akashic-games/akashic-cli/commit/d66e3224a90203b431f7d4dd0306dad32fa9f19a) Thanks [@xnv](https://github.com/xnv)! - Fix export-zip's `--bundle` breaks games including audio

- [#1503](https://github.com/akashic-games/akashic-cli/pull/1503) [`2428caf`](https://github.com/akashic-games/akashic-cli/commit/2428cafb6af5547b91f35832602b2b4d15e9f6ad) Thanks [@xnv](https://github.com/xnv)! - fix commands broken on early versions of Node.js v18, v20 and v21

- [#1522](https://github.com/akashic-games/akashic-cli/pull/1522) [`ef1b096`](https://github.com/akashic-games/akashic-cli/commit/ef1b096297a35f2f16d2fe037a5b23c59eb9943b) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Reduce usage of fs-extra from commons and export

- [#1493](https://github.com/akashic-games/akashic-cli/pull/1493) [`1896f73`](https://github.com/akashic-games/akashic-cli/commit/1896f731ed18dac261ad54834d5d6bd6e0321618) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Support library license in export-html

- [#1507](https://github.com/akashic-games/akashic-cli/pull/1507) [`b075741`](https://github.com/akashic-games/akashic-cli/commit/b0757417b225982dbde05b44d260f66f59574873) Thanks [@xnv](https://github.com/xnv)! - Fix export-html crash when the output path ends with `.zip`

- Updated dependencies [[`2428caf`](https://github.com/akashic-games/akashic-cli/commit/2428cafb6af5547b91f35832602b2b4d15e9f6ad), [`b347942`](https://github.com/akashic-games/akashic-cli/commit/b3479426e1a1fbf3b2badef5f04a862943c3206e), [`ef1b096`](https://github.com/akashic-games/akashic-cli/commit/ef1b096297a35f2f16d2fe037a5b23c59eb9943b), [`54c2a58`](https://github.com/akashic-games/akashic-cli/commit/54c2a5836194fc7f74a2c2ef869ccfa47a044765), [`b075741`](https://github.com/akashic-games/akashic-cli/commit/b0757417b225982dbde05b44d260f66f59574873)]:
  - @akashic/akashic-cli-extra@2.0.0
  - @akashic/akashic-cli-commons@1.0.0

## 2.0.0-next.4

### Patch Changes

- [#1522](https://github.com/akashic-games/akashic-cli/pull/1522) [`ef1b096`](https://github.com/akashic-games/akashic-cli/commit/ef1b096297a35f2f16d2fe037a5b23c59eb9943b) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Reduce usage of fs-extra from commons and export

- Updated dependencies [[`ef1b096`](https://github.com/akashic-games/akashic-cli/commit/ef1b096297a35f2f16d2fe037a5b23c59eb9943b)]:
  - @akashic/akashic-cli-commons@1.0.0-next.3
  - @akashic/akashic-cli-extra@2.0.0-next.3

## 2.0.0-next.3

### Patch Changes

- Updated dependencies [[`b347942`](https://github.com/akashic-games/akashic-cli/commit/b3479426e1a1fbf3b2badef5f04a862943c3206e)]:
  - @akashic/akashic-cli-commons@1.0.0-next.2
  - @akashic/akashic-cli-extra@2.0.0-next.2

## 2.0.0-next.2

### Patch Changes

- [#1506](https://github.com/akashic-games/akashic-cli/pull/1506) [`d66e322`](https://github.com/akashic-games/akashic-cli/commit/d66e3224a90203b431f7d4dd0306dad32fa9f19a) Thanks [@xnv](https://github.com/xnv)! - Fix export-zip's `--bundle` breaks games including audio

- [#1503](https://github.com/akashic-games/akashic-cli/pull/1503) [`2428caf`](https://github.com/akashic-games/akashic-cli/commit/2428cafb6af5547b91f35832602b2b4d15e9f6ad) Thanks [@xnv](https://github.com/xnv)! - fix commands broken on early versions of Node.js v18, v20 and v21

- [#1507](https://github.com/akashic-games/akashic-cli/pull/1507) [`b075741`](https://github.com/akashic-games/akashic-cli/commit/b0757417b225982dbde05b44d260f66f59574873) Thanks [@xnv](https://github.com/xnv)! - Fix export-html crash when the output path ends with `.zip`

- Updated dependencies [[`2428caf`](https://github.com/akashic-games/akashic-cli/commit/2428cafb6af5547b91f35832602b2b4d15e9f6ad), [`b075741`](https://github.com/akashic-games/akashic-cli/commit/b0757417b225982dbde05b44d260f66f59574873)]:
  - @akashic/akashic-cli-extra@2.0.0-next.1
  - @akashic/akashic-cli-commons@1.0.0-next.1

## 2.0.0-next.1

### Patch Changes

- [#1493](https://github.com/akashic-games/akashic-cli/pull/1493) [`1896f73`](https://github.com/akashic-games/akashic-cli/commit/1896f731ed18dac261ad54834d5d6bd6e0321618) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Support library license in export-html

## 2.0.0-next.0

### Major Changes

- [#1440](https://github.com/akashic-games/akashic-cli/pull/1440) [`54c2a58`](https://github.com/akashic-games/akashic-cli/commit/54c2a5836194fc7f74a2c2ef869ccfa47a044765) Thanks [@yu-ogi](https://github.com/yu-ogi)! - - [#1494](https://github.com/akashic-games/akashic-cli/pull/1494) feat(sandbox): support custom font
  - [#1492](https://github.com/akashic-games/akashic-cli/pull/1492) feat(serve): support custom fonts
  - [#1490](https://github.com/akashic-games/akashic-cli/pull/1490) Support akashic config js in scan
  - [#1489](https://github.com/akashic-games/akashic-cli/pull/1489) Use debug engineFiles in serve
  - [#1487](https://github.com/akashic-games/akashic-cli/pull/1487) Support es-downpile in export-html
  - [#1486](https://github.com/akashic-games/akashic-cli/pull/1486) feat(export): support text asset bundle
  - [#1480](https://github.com/akashic-games/akashic-cli/pull/1480) chore(serve): remove broken/unused test
  - [#1479](https://github.com/akashic-games/akashic-cli/pull/1479) feat(serve): migrate to esm
  - [#1472](https://github.com/akashic-games/akashic-cli/pull/1472) Fix export downpile
  - [#1469](https://github.com/akashic-games/akashic-cli/pull/1469) feat: support akashic.config.cjs, akashic.config.mjs
  - [#1467](https://github.com/akashic-games/akashic-cli/pull/1467) Add license file validation to export
  - [#1465](https://github.com/akashic-games/akashic-cli/pull/1465) feat(export): bundle script assets as an assetBundle
  - [#1460](https://github.com/akashic-games/akashic-cli/pull/1460) Remove cliconfig and configfile from commons
  - [#1455](https://github.com/akashic-games/akashic-cli/pull/1455) Add licene file to export zip
  - [#1450](https://github.com/akashic-games/akashic-cli/pull/1450) Fix storybook style
  - [#1447](https://github.com/akashic-games/akashic-cli/pull/1447) feat(export): use terser to minify
  - [#1445](https://github.com/akashic-games/akashic-cli/pull/1445) build(serve): introduce Vite instead of webpack
  - [#1444](https://github.com/akashic-games/akashic-cli/pull/1444) fix(export): fix exporting issue
  - [#1443](https://github.com/akashic-games/akashic-cli/pull/1443) refactor(serve): rename .css to .module.css
  - [#1441](https://github.com/akashic-games/akashic-cli/pull/1441) chore: add tsconfig.test.json
  - [#1439](https://github.com/akashic-games/akashic-cli/pull/1439) chore(extra): fix eol
  - [#1437](https://github.com/akashic-games/akashic-cli/pull/1437) feat(cli): migrate to esm
  - [#1430](https://github.com/akashic-games/akashic-cli/pull/1430) feat(init): migrate to esm
  - [#1422](https://github.com/akashic-games/akashic-cli/pull/1422) feat(sandbox): migrate to esm
  - [#1421](https://github.com/akashic-games/akashic-cli/pull/1421) feat(lib-manage): migrate to esm

### Patch Changes

- Updated dependencies [[`54c2a58`](https://github.com/akashic-games/akashic-cli/commit/54c2a5836194fc7f74a2c2ef869ccfa47a044765)]:
  - @akashic/akashic-cli-commons@1.0.0-next.0
  - @akashic/akashic-cli-extra@2.0.0-next.0

## 1.9.21

### Patch Changes

- [#1474](https://github.com/akashic-games/akashic-cli/pull/1474) [`1311473`](https://github.com/akashic-games/akashic-cli/commit/1311473108bce006942724f3c9972db0fcfd029b) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.11`.

## 1.9.20

### Patch Changes

- [#1462](https://github.com/akashic-games/akashic-cli/pull/1462) [`e9c6526`](https://github.com/akashic-games/akashic-cli/commit/e9c65268bf413525fe23093611a3b1f06ee362fe) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.10`.

## 1.9.19

### Patch Changes

- [#1448](https://github.com/akashic-games/akashic-cli/pull/1448) [`7043a1f`](https://github.com/akashic-games/akashic-cli/commit/7043a1fa6b687d7b8364f505f44df4443c88c1e4) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.9`.

## 1.9.18

### Patch Changes

- Updated dependencies [[`49d02f3`](https://github.com/akashic-games/akashic-cli/commit/49d02f3e1115192c3650bc0886fcc250ba9e838c)]:
  - @akashic/akashic-cli-extra@1.7.8

## 1.9.17

### Patch Changes

- [#1410](https://github.com/akashic-games/akashic-cli/pull/1410) [`50050de`](https://github.com/akashic-games/akashic-cli/commit/50050deb431275365eb0bd43e934b66923d98ce3) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.8`.

## 1.9.16

### Patch Changes

- [#1384](https://github.com/akashic-games/akashic-cli/pull/1384) [`2d513f5`](https://github.com/akashic-games/akashic-cli/commit/2d513f5140544aca31be44a611effa2387e2e024) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Update eslint-config

- Updated dependencies [[`2d513f5`](https://github.com/akashic-games/akashic-cli/commit/2d513f5140544aca31be44a611effa2387e2e024)]:
  - @akashic/akashic-cli-extra@1.7.7

## 1.9.15

### Patch Changes

- [#1399](https://github.com/akashic-games/akashic-cli/pull/1399) [`f581cb9`](https://github.com/akashic-games/akashic-cli/commit/f581cb92fa71194656d72eb85ef72783cf7a0861) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.7`.

## 1.9.14

### Patch Changes

- [#1397](https://github.com/akashic-games/akashic-cli/pull/1397) [`2cb34ff`](https://github.com/akashic-games/akashic-cli/commit/2cb34ffb559fa09ad337212b24216af498533941) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.6`.

## 1.9.13

### Patch Changes

- [#1395](https://github.com/akashic-games/akashic-cli/pull/1395) [`31396d1`](https://github.com/akashic-games/akashic-cli/commit/31396d1633416b8127edf134416972e1d7b5619e) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Modify export package.json

## 1.9.12

### Patch Changes

- [#1391](https://github.com/akashic-games/akashic-cli/pull/1391) [`42b8347`](https://github.com/akashic-games/akashic-cli/commit/42b8347907b4fcd1213c2c88b1b3ac6eeeb97ee6) Thanks [@ShinobuTakahashi](https://github.com/ShinobuTakahashi)! - Change browserify to rollup in export

## 1.9.11

### Patch Changes

- [#1379](https://github.com/akashic-games/akashic-cli/pull/1379) [`f05ed1d`](https://github.com/akashic-games/akashic-cli/commit/f05ed1da2a204f816f446d8f57b83011aea8f05b) Thanks [@yu-ogi](https://github.com/yu-ogi)! - Update internal modules

- Updated dependencies [[`f05ed1d`](https://github.com/akashic-games/akashic-cli/commit/f05ed1da2a204f816f446d8f57b83011aea8f05b)]:
  - @akashic/akashic-cli-extra@1.7.6

## 1.9.10

### Patch Changes

- [#1377](https://github.com/akashic-games/akashic-cli/pull/1377) [`c72eb4f`](https://github.com/akashic-games/akashic-cli/commit/c72eb4fada26352acec1fe31900551a03cd16cbd) Thanks [@xnv](https://github.com/xnv)! - - Updated dependency `jest` to `29.7.0`
  - Updated dependency `archiver` to `7.0.1`
  - Updated dependency `component-emitter` to `2.0.0`
  - Updated dependency `commander` to `12.1.0`
- Updated dependencies [[`c72eb4f`](https://github.com/akashic-games/akashic-cli/commit/c72eb4fada26352acec1fe31900551a03cd16cbd)]:
  - @akashic/akashic-cli-extra@1.7.5

## 1.9.9

### Patch Changes

- [#1371](https://github.com/akashic-games/akashic-cli/pull/1371) [`e0f9c9d`](https://github.com/akashic-games/akashic-cli/commit/e0f9c9dd50dad00fbf5aa8c521f0546279aa8150) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `@akashic/headless-driver` to `2.15.5`.

## 1.9.8

### Patch Changes

- [#1373](https://github.com/akashic-games/akashic-cli/pull/1373) [`b45578c`](https://github.com/akashic-games/akashic-cli/commit/b45578c0735804dde99fd5aa08d19bdf2873b3d2) Thanks [@yu-ogi](https://github.com/yu-ogi)! - fix to resolve the engine-files aliases
