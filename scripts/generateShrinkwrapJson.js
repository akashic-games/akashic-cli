import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const BEFORE_DAYS = 3;
const packageJsonPath = path.resolve(process.cwd(), "package.json");

/**
 * package.json の workspaces プロパティを削除し保存し、元の packate.json の内容を返す。
 */
function removeWorkspacesField() {
  const orgContent = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const newContent = { ...orgContent };

  if (newContent.workspaces) {
    delete newContent.workspaces;
  } else {
    return null;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(newContent, null, 2) + "\n");
  return orgContent;
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
 * packages/akashic-cli 配下に shrinkwrap.json を生成する。
 */
async function generateShrinkwrapJson() {
  let orgPackageJson = null;
  const cwd = process.cwd();

  try {
    orgPackageJson = removeWorkspacesField();
    if (!orgPackageJson) {
        console.log("package.json is missing workspaces field.");
        return;
    }

    const dt = new Date();
    dt.setDate(dt.getDate() - BEFORE_DAYS);
    const formattedDate = formatDate(dt);

    const npmInstallCmd = `npm i --before ${formattedDate}`;
    const npmShrinkwrapCmd = "npm shrinkwrap";

    process.chdir("packages/akashic-cli");
    console.log(`- exec: "${npmInstallCmd}"`);
    execSync(npmInstallCmd);

    console.log(`- exec: "${npmShrinkwrapCmd}"`);
    execSync(npmShrinkwrapCmd);

  } catch (err) {
    console.error("error:", err);
  } finally {
    process.chdir(cwd);
    if (orgPackageJson) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(orgPackageJson, null, 2) + "\n");
    }
    console.log("- generateShrinkwrapJson end");
  }
}

generateShrinkwrapJson();
