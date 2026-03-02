/**
 * lib/pdi から lib/template/v1~v3/js/pdi へコピーする
 * .cjs の場合は .js への拡張子変更を行う
 */
import fs from "fs";
import path from "path";

const [, , destDir] = process.argv;
if (!destDir) {
  console.error("Usage: node scripts/copyPdiWithJsExt.js <destDir>");
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    let destName = entry.name;
    if (entry.isFile() && destName.endsWith(".cjs")) {
      destName = destName.slice(0, -4) + ".js";
    }
    const destPath = path.join(dest, destName);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir("lib/pdi", destDir);
