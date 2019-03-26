const path = require("path");
const fs = require("fs");
const semver = require("semver");
const execSync = require("child_process").execSync;

if (process.argv.length < 3) {
	console.error("Please enter command as follows: node updateChangelog.js [patch|minor|major]");
	process.exit(1);
}

// 対象のバージョンナンバー名を取得
var target = process.argv[2];
if (! /^patch|minor|major$/.test(target)) {
	console.error("please specify patch or minor or major");
	process.exit(1);
}

const modules = JSON.parse(execSync(`${path.join(__dirname, "..", "node_modules", ".bin", "lerna")} ls --toposort --json`).toString().replace("\n", ""));
const currentVersion = modules[modules.length - 1]["version"];
const nextVersion = semver.inc(currentVersion, target);
const currentChangeLog = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
const addedLog = execSync(`${path.join(__dirname, "..", "node_modules", ".bin", "lerna-changelog")}`).toString().replace("Unreleased", nextVersion);
const nextChangeLog = currentChangeLog.replace("# CHANGELOG\n\n", "# CHANGELOG\n" + addedLog + "\n");
fs.writeFileSync(path.join(__dirname, "..", "CHANGELOG.md"), nextChangeLog);
