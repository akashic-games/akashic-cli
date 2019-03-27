// ※このスクリプトを実行するためには環境変数GITHUB_AUTHにgithubへのアクセストークンを与える必要があります
const path = require("path");
const fs = require("fs");
const semver = require("semver");
const execSync = require("child_process").execSync;

if (process.argv.length < 3) {
	console.error("Please enter command as follows: node updateChangelog.js [patch|minor|major]");
	process.exit(1);
}

// どのバージョンを上げるのかを取得
var target = process.argv[2];
if (! /^patch|minor|major$/.test(target)) {
	console.error("please specify patch or minor or major");
	process.exit(1);
}

// 全akashic-cli-xxxに依存するakashic-cliモジュールの次のバージョン番号を取得
const packageJson = require(path.join(__dirname, "..", "packages", "akashic-cli", "package.json"));
const currentVersion = packageJson["version"];
const nextVersion = semver.inc(currentVersion, target);

// 現在のCHANGELOGに次バージョンのログを追加
const currentChangeLog = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
const addedLog = execSync(`${path.join(__dirname, "..", "node_modules", ".bin", "lerna-changelog")}`).toString().replace("Unreleased", nextVersion);
const nextChangeLog = currentChangeLog.replace("# CHANGELOG\n\n", "# CHANGELOG\n" + addedLog + "\n");
fs.writeFileSync(path.join(__dirname, "..", "CHANGELOG.md"), nextChangeLog);
