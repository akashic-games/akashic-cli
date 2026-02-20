/**
 * lib/pdi から lib/template/v1~v3/js/pdi へのコピーに用いるスクリプト
 * export した html を安定して実行できるよう、 .cjs の場合は .js への拡張子変更を行う
 *
 * Usage: node scripts/copyPdiWithJsExt.js <destDir>
 *   e.g. node scripts/copyPdiWithJsExt.js lib/template/v1/js/pdi
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
