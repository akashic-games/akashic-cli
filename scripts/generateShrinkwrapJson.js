// 各パッケージの依存関係のバージョンを固定するために `npm-shrinkwrap.json` を追加するスクリプト。(packages/*/ でのみ実行する想定)
// モノレポであることや、直前に akashic-cli の publish が行われた場合、akashic-cli-xxxxx が `npm i --before <date>` でエラーとなるため、下記の手順で `npm-shrinkwrap.json` を作成する。
// 1. ルートの `package.json` から workspaces プロパティを削除
// 2. 各パッケージの `package.json` の dependencies/devDependencies から `@akashic/xxxxx` を削除し `npm i --before <実行日の七日前>` を実行
// 3. 2 で削除した `@akashic/xxxxx` を npm インストール
// 4. `npm shrinkwarp` を実行

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const POLLING_MAX_RETRY_COUNT = 10;
const POLLING_WAIT_TIME = 3000; // ms
const BEFORE_DAYS = 7;
const rootPackageJsonPath = path.resolve(process.cwd(), "..", "..", "package.json");
const packageJsonPath = path.resolve(process.cwd(), "package.json");

// const commonsPackageJsonPath = path.resolve(process.cwd(), "..", "akashic-cli-commons", "package.json");
const cliPackageJsonPath = path.resolve(process.cwd(), "..", "akashic-cli", "package.json");

/**
 * ルートの package.json の workspaces プロパティを削除し保存し、元の package.json の内容を返す。
 */
function removeWorkspacesField() {
  const orgContent = fs.readFileSync(rootPackageJsonPath, "utf-8");
  const newContent = { ...JSON.parse(orgContent) };
  
  if (newContent.workspaces) {
    delete newContent.workspaces;
  } else {
    return null;
  }

  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(newContent, null, 2) + "\n");
  return orgContent;
}

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
        akashicDependencies.push({name: module, ver: pkgJson.dependencies[module]});
        delete pkgJson.dependencies[module];
      }
    }
  }
  if (pkgJson.name !== "@akashic/akashic-cli-serve") { // debug, TODO: serve でdevDpendencies を除去すると copy:agv でこける
  if (pkgJson.devDependencies) {
    for (const module of Object.keys(pkgJson.devDependencies)) {
      if (/^@akashic\//.test(module)) {
        devAkashicDependencies.push({name: module, ver: pkgJson.devDependencies[module]});
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


async function polling(pkgName, version) {
  // 試行回数に達するまでループ
  let count = 0;
  let npmViewCmd = `npm view ${pkgName}@${version}`;
  console.log(`- exec: "${npmViewCmd}"`);

  while (count < POLLING_MAX_RETRY_COUNT) {
    
    try {
      // --- debug
      // if (count !== 3) { 
      //   npmViewCmd = "npm view @akashic/akashic-cli-commons@1.0.3-test-dontuse.16";
      // } else { 
      //  npmViewCmd = `npm view ${pkgName}@${version}`;
      // }
      // --- debug end

      execSync(npmViewCmd);
      console.log(`- success: npm view. count=${count}`);
      return true;
      
    } catch (error) {
      console.error(`- warn:  count=${count}: Not found`);
    }

    if (count < POLLING_MAX_RETRY_COUNT) {
      count++;
      await new Promise(resolve => setTimeout(resolve, POLLING_WAIT_TIME));
    }
  }
  console.log(`--- error: The maximum number of times has been reached.`);
  return false;
}

/**
 * akashic-cli 以外の各 package 配下に shrinkwrap.json を生成する。
 */
async function generateShrinkwrapJson() {
  console.log(`--------------------- generateShrinkwrapJson ------------------`);
  let orgRootPackageJson = null;
  let pkgName = "";
  let isError = false;

  try {
    orgRootPackageJson = removeWorkspacesField();
    // if (!orgRootPackageJson) {
    //     console.log("root package.json is missing workspaces field.");
    //     process.exit(1);
    // }
    
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    pkgName = pkgJson.name;
    console.log(`--- ${pkgName} generateShrinkwrapJson start ---`);

    // バージョン取得用
    const cliPkgJson = JSON.parse(fs.readFileSync(cliPackageJsonPath, "utf8"));

    // changeset の publish は並列処理のため、npm view <pkgName> で publish されるまで待つ
    if (pkgName !== "@akashic/akashic-cli-commons" && pkgName !== "@akashic/akashic-cli-export") {
        // commons 依存:[extra, init, lib-manage, sandbox, scan, serve]
        const version = cliPkgJson.dependencies["@akashic/akashic-cli-commons"];
        const isSuccess = await polling("@akashic/akashic-cli-commons", version);
        console.log(`- commons, isSuccess: "${isSuccess}"`);
    }

    if (pkgName === "@akashic/akashic-cli-serve") {
      // scan 依存: [serve]
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-scan"];
      const isSuccess = await polling("@akashic/akashic-cli-scan", version);
      console.log(`- scan, isSuccess: "${isSuccess}"`);
    }
    
    if (pkgName === "@akashic/akashic-cli-init") {
      // extra 依存: [init]
      const version = cliPkgJson.dependencies["@akashic/akashic-cli-extra"];
      const isSuccess = await polling("@akashic/akashic-cli-extra", version);
      console.log(`- extra, isSuccess: "${isSuccess}"`);
    }
    
    const dt = new Date();
    dt.setDate(dt.getDate() - BEFORE_DAYS);
    const formattedDate = formatDate(dt);
    // akashic-cli-xxxxx は publish 日付が直前の可能性があり、--before <date> で引っかかるため package.json から削除し後でインストールする
    const akashicModules = removeAkashicDependencies(packageJsonPath);

    const npmInstallCmd = `npm i --before ${formattedDate}`;
    console.log(`- exec: "${npmInstallCmd}"`);
    execSync(npmInstallCmd);

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
    console.error("Error:", err);
    isError = true;
  } finally {
    if (orgRootPackageJson) {
      fs.writeFileSync(rootPackageJsonPath, orgRootPackageJson);
    }
    console.log(`--- ${pkgName} generateShrinkwrapJson end ---`);
    if (isError) process.exit(1);
  }
}

generateShrinkwrapJson();
