// 各パッケージの依存関係のバージョンを固定するために `npm-shrinkwrap.json` を追加するスクリプト。(packages/*/ でのみ実行する想定)
// モノレポであることや、直前に akashic-cli の publish が行われた場合、akashic-cli-xxxxx が `npm i --before <date>` でエラーとなるため、下記の手順で `npm-shrinkwrap.json` を作成する。
// 1. ルートの `package.json`, `package-lock.json` をリネーム
// 2. 依存モジュールが publish 済みかポーリングして確認
// 3. ロックファイルを作成。ロックファイルが作成済みの場合はポーリングで待つ
// 4. 各パッケージの `package.json` の dependencies/devDependencies から `@akashic/xxxxx` を削除し `npm i --before <実行日の七日前>` を実行
// 5. 4 で削除した `@akashic/xxxxx` を npm インストール
// 6. `npm shrinkwarp` を実行
// 7. 1 でリネームした `package.json`, `package-lock.json` を戻し、ロックファイルを削除

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const POLLING_MAX_RETRY_COUNT = 180; // polling 最大試行回数(要調整)
const POLLING_WAIT_TIME = 10 * 1000; // ms, retry * time で 30min(要調整)
const BEFORE_DAYS = 7;

const rootPackageJsonPath = path.resolve(process.cwd(), "..", "..", "package.json");
const rootRenamePackageJsonPath = path.resolve(process.cwd(), "..", "..", "_package.json");
const rootPackageLockPath = path.resolve(process.cwd(), "..", "..", "package-lock.json");
const rootRenamePackageLockPath = path.resolve(process.cwd(), "..", "..", "_package-lock.json");
const packageJsonPath = path.resolve(process.cwd(), "package.json");
const lockFilePath = path.resolve(process.cwd(), "..", "..", "publish.lock");
const cliPackageJsonPath = path.resolve(process.cwd(), "..", "akashic-cli", "package.json");

let fd; // filedescriptor
let isError = false;

/**
 * 各パッケージの package.json の dependencies/devDependencies から akashic 系を削除する
 */
function removeAkashicDependencies(pkgJsonPath) {
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const akashicDependencies = [];
  const devAkashicDependencies = [];

  if (pkgJson.dependencies) {
    for (const module of Object.keys(pkgJson.dependencies)) {
      if (/^@akashic\//.test(module)) {
        akashicDependencies.push({ name: module, ver: pkgJson.dependencies[module] });
        delete pkgJson.dependencies[module];
      }
    }
  }
  if (pkgJson.devDependencies) {
    for (const module of Object.keys(pkgJson.devDependencies)) {
      if (/^@akashic\//.test(module)) {
        devAkashicDependencies.push({ name: module, ver: pkgJson.devDependencies[module] });
        delete pkgJson.devDependencies[module];
      }
    }
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
  return { dependencies: akashicDependencies, devDependencies: devAkashicDependencies };
}

/**
 * 日付を "yyyy-mm-dd" 形式の文字列へ変換し返す。
 */
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const formatted = new Intl.DateTimeFormat("ja-JP", options).format(date);
  return formatted.replace(/\//g, "-");
}

/**
 * ロックファイルが作成可能となるまでポーリングする
 * ロックファイルを flag: "wx" で open() して成功ならポーリング終了、もしくは最大回数試行でエラー
 */
async function pollingLockFile() {
  let count = 0;
  while (count < POLLING_MAX_RETRY_COUNT) {
    try {
      return fs.openSync(lockFilePath, "wx");
    } catch (_error) {
      if (count < POLLING_MAX_RETRY_COUNT) {
        count++;
        await new Promise(resolve => setTimeout(resolve, POLLING_WAIT_TIME));
      }
    }
  }
  throw new Error("pollingLockFile(): The maximum number of times has been reached.");
}

/**
 * npm view で指定したパッケージのバージョンが取得できるまでポーリングする
 */
async function pollingPublish(pkgName, version) {
  let count = 0;
  const npmViewCmd = `npm view ${pkgName}@${version}`;
  console.log(`- exec: "${npmViewCmd}"`);

  while (count < POLLING_MAX_RETRY_COUNT) {
    try {
      execSync(npmViewCmd);
      return true;

    } catch (_error) {
      if (count < POLLING_MAX_RETRY_COUNT) {
        count++;
        await new Promise(resolve => setTimeout(resolve, POLLING_WAIT_TIME));
      }
    }
  }
  throw new Error("pollingPublish(): The maximum number of times has been reached.");
}

/**
 * akashic-cli 以外の各 package 配下に shrinkwrap.json を生成する。
 */
async function generateShrinkwrapJson() {
  let pkgName = "";

  try {
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    pkgName = pkgJson.name;
    console.log(`--------------- ${pkgName} generateShrinkwrapJson start ---`);

    // バージョン取得用
    const cliPkgJson = JSON.parse(fs.readFileSync(cliPackageJsonPath, "utf-8"));
    // 依存モジュールが publish 済みかポーリングして確認
    if (pkgName !== "@akashic/akashic-cli-commons") {
      // commons 依存
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-commons"];
      await pollingPublish("@akashic/akashic-cli-commons", version);
    }
    if (pkgName === "@akashic/akashic-cli-export") {
      // extra 依存
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-extra"];
      await pollingPublish("@akashic/akashic-cli-extra", version);
    }
    if (pkgName === "@akashic/akashic-cli-serve") {
      // scan 依存: [serve]
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-scan"];
      await pollingPublish("@akashic/akashic-cli-scan", version);
    }
    if (pkgName === "@akashic/akashic-cli-init") {
      // extra 依存: [init]
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-extra"];
      await pollingPublish("@akashic/akashic-cli-extra", version);
    }

    fd = await pollingLockFile();

    // モノレポの制御を外すため package.json, package-lock.json をリネーム
    fs.renameSync(rootPackageJsonPath, rootRenamePackageJsonPath);
    fs.renameSync(rootPackageLockPath, rootRenamePackageLockPath);

    const dt = new Date();
    dt.setDate(dt.getDate() - BEFORE_DAYS);
    const formattedDate = formatDate(dt);
    // akashic-cli-xxxxx は publish 日付が直前の可能性があり、--before <date> で引っかかるため package.json から削除し後でインストールする
    const akashicModules = removeAkashicDependencies(packageJsonPath);

    if (pkgName == "@akashic/akashic-cli-serve") {
      // serve で @akashic 系を削除してインストールした場合、`npm run setup` の処理で落ちる。環境変数の値を設定し処理をスキップさせる。 
      process.env.SKIP_SERVE_SETUP = true;
    }

    const npmInstallCmd = `npm i --before ${formattedDate}`;
    console.log(`- exec: "${npmInstallCmd}"`);
    execSync(npmInstallCmd, { stdio: "inherit" });

    if (akashicModules.dependencies.length) {
      const installList = [];
      for (const module of akashicModules.dependencies) {
        const target = `${module.name}@${module.ver}`;
        installList.push(target);
      }
      const akashicInstallCmd = `npm i --save-exact ${installList.join(" ")}`;
      console.log(`- exec: "${akashicInstallCmd}"`);
      execSync(akashicInstallCmd, { stdio: "inherit" });
    }

    if (akashicModules.devDependencies.length) {
      const installList = [];
      for (const module of akashicModules.devDependencies) {
        const target = `${module.name}@${module.ver}`;
        installList.push(target);
      }
      const akashicInstallCmd = `npm i --save-dev --save-exact ${installList.join(" ")}`;
      console.log(`- exec: "${akashicInstallCmd}"`);
      execSync(akashicInstallCmd);
    }

    const npmShrinkwrapCmd = "npm shrinkwrap";
    console.log(`- exec: "${npmShrinkwrapCmd}"`);
    execSync(npmShrinkwrapCmd, { stdio: "inherit" });

  } catch (err) {
    console.error("*** err:", err);
    isError = true;
  } finally {
    if (fs.existsSync(rootRenamePackageJsonPath)) fs.renameSync(rootRenamePackageJsonPath, rootPackageJsonPath);
    if (fs.existsSync(rootRenamePackageLockPath)) fs.renameSync(rootRenamePackageLockPath, rootPackageLockPath);

    console.log(`------------ ${pkgName}  end ------------`);
  }
}

process.on("beforeExit", () => {
  if (fd != null) {
    fs.closeSync(fd);
    fs.rmSync(lockFilePath);
  }
  if (isError) process.exit(1);
});

generateShrinkwrapJson();
