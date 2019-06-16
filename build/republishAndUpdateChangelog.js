const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;

// lerna-changelogコマンドを実行するために環境変数GITHUB_AUTHにgithubへのアクセストークンを与える必要がある。
// しかし、与えられていなくてもコマンド実行時にエラーは発生しないのでここで事前にチェックする。
if (process.env.GITHUB_AUTH == null) {
	console.error("Must provide GITHUB_AUTH.");
	process.exit(1);
}

// versionのbump
console.log("start to bump version");
const branchName = Date.now();
const lernaPath = path.join(__dirname, "..", "node_modules", ".bin", "lerna");
execSync(`git fetch && git checkout origin/master && git checkout -b ${branchName} && git commit --allow-empty -m "empty" && git push origin ${branchName}`);
execSync(`${lernaPath} version patch --allow-branch=* --force-publish=* --yes`);
// PRの作成とマージ
const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "packages", "akashic-cli", "package.json")).toString()).version;
const pullReqDataString = execSync(`curl --fail -H "Authorization: token ${process.env.GITHUB_AUTH}" -X POST -d '{"title":"v${currentVersion}", "body":"※自動作成されたPRです", "head":"akashic-games:${branchName}", "base":"master"}' https://api.github.com/repos/akashic-games/akashic-cli/pulls`).toString();
const pullReqData = JSON.parse(pullReqDataString);
// issue(PR)にラベル付ける
execSync(`curl --fail -H "Authorization: token ${process.env.GITHUB_AUTH}" -X POST -d '{"labels": ["republish"]}' https://api.github.com/repos/akashic-games/akashic-cli/issues/${pullReqData["number"]}/labels`);
// PRのマージ
execSync(`curl --fail -H "Authorization: token ${process.env.GITHUB_AUTH}" -X PUT https://api.github.com/repos/akashic-games/akashic-cli/pulls/${pullReqData["number"]}/merge`);
// ブランチ削除
execSync(`git checkout origin/master && git branch -D ${branchName} && git push origin :${branchName}`);
console.log("end to bump version");

// 現在のCHANGELOGに次バージョンのログを追加
console.log("start to update changelog");
execSync(`git checkout master && git pull origin master`);
const lernaChangeLogPath = path.join(__dirname, "..", "node_modules", ".bin", "lerna-changelog");
const addedLog = execSync(`${lernaChangeLogPath} --next-version v${currentVersion}`).toString();
const currentChangeLog = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
const nextChangeLog = currentChangeLog.replace("# CHANGELOG\n\n", "# CHANGELOG\n" + addedLog + "\n");
fs.writeFileSync(path.join(__dirname, "..", "CHANGELOG.md"), nextChangeLog);
execSync("git add ./CHANGELOG.md && git commit -m 'Update Changelog' && git push origin master");
console.log("end to update changelog");
