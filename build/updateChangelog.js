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
	console.error("Please specify patch, minor or major.");
	process.exit(1);
}

const lernaPath = path.join(__dirname, "..", "node_modules", ".bin", "lerna");
// 更新するモジュールが無ければChangelog更新処理を行わず終了する(ただし強制publishの場合は例外とする)
if (process.env.PUBLISH_MODE !== "force" && parseInt(execSync(`${lernaPath} changed | wc -l`).toString(), 10) === 0) {
	console.error("No modules to update version.");
	process.exit(1);
}

// lerna-changelogコマンドを実行するために環境変数GITHUB_AUTHにgithubへのアクセストークンを与える必要がある。
// しかし、与えられていなくてもコマンド実行時にエラーは発生しないのでここで事前にチェックする。
if (process.env.GITHUB_AUTH == null) {
	console.error("Must provide GITHUB_AUTH.");
	process.exit(1);
}

try {
	// 現在のCHANGELOGに次バージョンのログを追加
	console.log("start to update changelog");
	// 全akashic-cli-xxxに依存するakashic-cliモジュールの次のバージョン番号を取得
	const packageJson = require(path.join(__dirname, "..", "packages", "akashic-cli", "package.json"));
	const nextVersion = semver.inc(packageJson["version"], target);
	// 現在のCHANGELOGに次バージョンのログを追加
	const lernaChangeLogPath = path.join(__dirname, "..", "node_modules", ".bin", "lerna-changelog");
	const addedLog = execSync(`${lernaChangeLogPath} --next-version ${nextVersion}`, { encoding: "utf-8" }).toString().trimLeft();
	const currentChangeLog = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
	const nextChangeLog = currentChangeLog.replace("# CHANGELOG\n\n", "# CHANGELOG\n\n" + addedLog + "\n");
	fs.writeFileSync(path.join(__dirname, "..", "CHANGELOG.md"), nextChangeLog);
} catch (e) {
	console.error(e);
	process.exit(1);
}
