// 各パッケージの依存関係のバージョンを固定するために `npm-shrinkwrap.json` を追加するスクリプト。(packages/*/ でのみ実行する想定)
// モノレポであることや、直前に akashic-cli の publish が行われた場合、akashic-cli-xxxxx が `npm i --before <date>` でエラーとなるため、下記の手順で `npm-shrinkwrap.json` を作成する。
// 1. ルートの `package.json` から workspaces プロパティを削除
// 2. 各パッケージの `package.json` の dependencies/devDependencies から `@akashic/xxxxx` を削除し `npm i --before <実行日の七日前>` を実行
// 3. 2 で削除した `@akashic/xxxxx` を npm インストール
// 4. `npm shrinkwarp` を実行

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const POLLING_MAX_RETRY_COUNT = 180;  // polling 最大試行回数 
const POLLING_WAIT_TIME = 10 * 1000; // ms 要時間調整 retry * time で 30 min
const BEFORE_DAYS = 7;

const rootPackageJsonPath = path.resolve(process.cwd(), "..", "..", "package.json");
const rootRenamePackageJsonPath = path.resolve(process.cwd(), "..", "..", "_package.json");
const rootPackageLockPath = path.resolve(process.cwd(), "..", "..", "package-lock.json");
const rootRenamePackageLockPath = path.resolve(process.cwd(), "..", "..", "_package-lock.json");
const packageJsonPath = path.resolve(process.cwd(), "package.json");
const lockFilePath = path.resolve(process.cwd(), "..", "..", "publish.lock");
const cliPackageJsonPath = path.resolve(process.cwd(), "..", "akashic-cli", "package.json");
const lockFileDirPath = path.resolve(process.cwd(), "..", "..", "lockDir");

let fd; // filedescriptor

// debug
// if (fs.existsSync(lockFilePath)) fs.rmSync(lockFilePath);

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
  if (pkgJson.name !== "@akashic/akashic-cli-serve") { // debug, TODO: serve でdevDpendencies を除去すると copy:agv でこける
    if (pkgJson.devDependencies) {
      for (const module of Object.keys(pkgJson.devDependencies)) {
        if (/^@akashic\//.test(module)) {
          devAkashicDependencies.push({ name: module, ver: pkgJson.devDependencies[module] });
          delete pkgJson.devDependencies[module];
        }
      }
    }
  }

  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
  // return akashicDependencies;
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

async function pollingLockFile(pkgName) {
  let count = 0;
  while (count < POLLING_MAX_RETRY_COUNT) {
    try {
      if (!fs.existsSync(lockFilePath)) {

        console.log(`--- lockFile: ${pkgName}:  count=${count}`);
        return fs.openSync(lockFilePath, "wx");
        // const fd2 = fs.openSync(lockFilePath, "wx");
        // fs.appendFileSync(fd2, pkgName, "utf-8");
        // return fd2;
      }
    } catch (error) {
      console.warn(`- warn:  count=${count}: LockFile exists`);
    }

    if (count < POLLING_MAX_RETRY_COUNT) {
      count++;
      await new Promise(resolve => setTimeout(resolve, POLLING_WAIT_TIME));
    }
  }
  // console.error(`--- error: pollingLockFile(), The maximum number of times has been reached.`);
  throw new Error("pollingLockFile(): The maximum number of times has been reached.");
  // return null;
}

async function pollingPublish(pkgName, version) {
  // 試行回数に達するまでループ
  let count = 0;
  const npmViewCmd = `npm view ${pkgName}@${version}`;
  console.log(`- exec: "${npmViewCmd}"`);

  while (count < POLLING_MAX_RETRY_COUNT) {
    try {
      // --- debug
      // npmViewCmd = count !== 3 ? "npm view @akashic/akashic-cli-commons@1.0.3-test-dontuse.16" : `npm view ${pkgName}@${version}`;
      // npmViewCmd = "npm view @akashic/akashic-cli-commons@1.0.3-test-dontuse.99";

      execSync(npmViewCmd);
      // console.log(`- success: npm view. count=${count}`);
      return true;

    } catch (error) {
      console.error(`- warn:  count=${count}: Not found`);
    }

    if (count < POLLING_MAX_RETRY_COUNT) {
      count++;
      await new Promise(resolve => setTimeout(resolve, POLLING_WAIT_TIME));
    }
  }
  // console.log(`--- error: pollingPublish() The maximum number of times has been reached.`);
  // return false;
  throw new Error("pollingLockFile(): The maximum number of times has been reached.");

}


const sleep = time => new Promise(resolve => setTimeout(resolve, time));
let isError = false;


/**
 * akashic-cli 以外の各 package 配下に shrinkwrap.json を生成する。
 */
async function generateShrinkwrapJson() {
  // console.log(`--------------------- generateShrinkwrapJson ------------------`);

  let pkgName = "";
  // let isError = false;

  try {
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    pkgName = pkgJson.name;
    console.log(`--------------- ${pkgName} generateShrinkwrapJson start ---`);

    // バージョン取得用
    const cliPkgJson = JSON.parse(fs.readFileSync(cliPackageJsonPath, "utf-8"));

    // let isSuccess = false;
    // 依存モジュールが publish 済みか確認
    if (pkgName !== "@akashic/akashic-cli-commons") {
      // commons 依存
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-commons"];
      const isSuccess = await pollingPublish("@akashic/akashic-cli-commons", version);
      console.log(`- npm info view commons, isSuccess: "${isSuccess}"`);
    }
    if (pkgName === "@akashic/akashic-cli-serve") {
      // scan 依存: [serve]
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-scan"];
      const isSuccess = await pollingPublish("@akashic/akashic-cli-scan", version);
      console.log(`- npm info view scan, isSuccess: "${isSuccess}"`);
    }
    if (pkgName === "@akashic/akashic-cli-init") {
      // extra 依存: [init]
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-extra"];
      const isSuccess = await pollingPublish("@akashic/akashic-cli-extra", version);
      console.log(`- npm info view extra, isSuccess: "${isSuccess}"`);
    }

    // ロックファイルを flag: "wx" で open() して成功なら処理続行
    fd = await pollingLockFile(pkgName);

    // root package.json の rename
    console.log(`--- pkgjson rename start ${pkgName}`, fs.existsSync(rootPackageJsonPath), new Date().toLocaleTimeString());
    fs.renameSync(rootPackageJsonPath, rootRenamePackageJsonPath);
    fs.renameSync(rootPackageLockPath, rootRenamePackageLockPath);
    // ++++++ debug ++++++++++++    
    // if (pkgName == "@akashic/akashic-cli-commons") await sleep(15000);
    // if (pkgName == "@akashic/akashic-cli-scan") await sleep(7000);
    // if (pkgName == "@akashic/akashic-cli-extra") await sleep(4000);
    // ++++++ debug ++++++++++++    

    const dt = new Date();
    dt.setDate(dt.getDate() - BEFORE_DAYS);
    const formattedDate = formatDate(dt);
    // akashic-cli-xxxxx は publish 日付が直前の可能性があり、--before <date> で引っかかるため package.json から削除し後でインストールする
    const akashicModules = removeAkashicDependencies(packageJsonPath);

    const npmInstallCmd = `npm i --before ${formattedDate}`;
    console.log(`- exec: "${npmInstallCmd}"`);
    execSync(npmInstallCmd);
    
    // if (pkgName == "@akashic/akashic-cli-serve") {
      // dependencies/debDependencies で @akashic 系を削除しインストールするため、prepare の処理で落ちる。環境変数の値を設定し prepare をスキップさせる。 
    //   process.env.SKIP_SERVE_PREPARE = true;
    //   console.log("****** env:", process.env.SKIP_SERVE_PREPARE);
    // }

    if (akashicModules.dependencies.length) {
      const installList = [];
      for (const module of akashicModules.dependencies) {
        const target = `${module.name}@${module.ver}`;
        installList.push(target);
      }
      const akashicInstallCmd = `npm i --save-exact ${installList.join(" ")}`;
      console.log(`- exec: "${akashicInstallCmd}"`);
      execSync(akashicInstallCmd);
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
    execSync(npmShrinkwrapCmd);
    /*
    */
  } catch (err) {
    console.error("*** err:", err);
    isError = true;
  } finally {
    // package.json を戻す
    console.log(`--- pkgjson rename end ${pkgName}`, fs.existsSync(rootRenamePackageJsonPath), new Date().toLocaleTimeString());
    if (fs.existsSync(rootRenamePackageJsonPath)) fs.renameSync(rootRenamePackageJsonPath, rootPackageJsonPath);
    if (fs.existsSync(rootRenamePackageLockPath)) fs.renameSync(rootRenamePackageLockPath, rootPackageLockPath);

    console.log(`------------ ${pkgName}  end ------------`, new Date().toLocaleTimeString());
    // if (isError) process.exit(1);
  }
}

process.on("beforeExit", () => {
  // console.log("+++++++++++++ process beforeExit");
  // lockfile 削除
  if (fd != null) {
    fs.closeSync(fd);
    fs.rmSync(lockFilePath);
  }
  if (isError) process.exit(1);
});

generateShrinkwrapJson();
