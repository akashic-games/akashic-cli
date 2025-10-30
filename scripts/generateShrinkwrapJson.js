import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const BEFORE_DAYS = 7;
const rootPackageJsonPath = path.resolve(process.cwd(), "..", "..", "package.json");
const packageJsonPath = path.resolve(process.cwd(), "package.json");

/**
 * ルートの package.json の workspaces プロパティを削除し保存し、元の package.json の内容を返す。
 */
function removeWorkspacesField() {
  const orgContent = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf8"));
  const newContent = { ...orgContent };
  
  if (newContent.workspaces) {
    delete newContent.workspaces;
  } else {
    return null;
  }

  fs.writeFileSync(rootPackageJsonPath, JSON.stringify(newContent, null, 2) + "\n");
  return orgContent;
}

/**
 * 各パッケージの package.json の dependencies から akashic 系を削除する
 */
function removeAkashicDependencies(pkgJsonPath) {
  const orgContent = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const newContent = { ...orgContent };
  const akshicDependencies = [];

  if (newContent.dependencies) {
    for (const module of Object.keys(newContent.dependencies)) {
      if (/^@akashic\//.test(module)) {
        akshicDependencies.push({name: module, ver: newContent.dependencies[module]});
        delete newContent.dependencies[module];
      }
    }
  } else {
    return null;
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify(newContent, null, 2) + "\n");
  return akshicDependencies;
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
 * akashic-cli 以外の各 package 配下に shrinkwrap.json を生成する。
 */
async function generateShrinkwrapJson() {
  let orgRootPackageJson = null;
  let pkgName = "";
  let isError = false;

  try {
    orgRootPackageJson = removeWorkspacesField();
    if (!orgRootPackageJson) {
        console.log("root package.json is missing workspaces field.");
        process.exit(1);
    }
    const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    pkgName = pkgJson.name;
    console.log(`--- ${pkgName} generateShrinkwrapJson start ---`);
  
    const dt = new Date();
    dt.setDate(dt.getDate() - BEFORE_DAYS);
    const formattedDate = formatDate(dt);
    // akashic-cli-xxxxx は publish 日付が直前の可能性があり、--before <date> で引っかかるため package.json から削除し後でインストールする
    const akashicModules = removeAkashicDependencies(packageJsonPath);

    const npmInstallCmd = `npm i --before ${formattedDate}`;
    console.log(`- exec: "${npmInstallCmd}"`);
    execSync(npmInstallCmd);

    if (akashicModules) { 
      const installList = [];
      for (const module of akashicModules) {
        const target = `${module.name}@${module.ver}`;
        installList.push(target);
      }
      const akashicInstallCmd = `npm i --save-exact ${installList.join(" ")}`;
      console.log(`- exec: "${akashicInstallCmd}"`);
      execSync(akashicInstallCmd);
    }

    const npmShrinkwrapCmd = "npm shrinkwrap";
    console.log(`- exec: "${npmShrinkwrapCmd}"`);
    execSync(npmShrinkwrapCmd);

  } catch (err) {
    console.error("Error:", err);
    isError = true;
  } finally {
    if (orgRootPackageJson) {
      fs.writeFileSync(rootPackageJsonPath, JSON.stringify(orgRootPackageJson, null, 2) + "\n");
    }
    console.log(`--- ${pkgName} generateShrinkwrapJson end ---`);
    if (isError) process.exit(1);
  }
}

generateShrinkwrapJson();
