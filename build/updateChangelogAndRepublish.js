const path = require("path");
const semver = require("semver");
const execSync = require("child_process").execSync;
const updateChangelog = require("./parts/updateChangelog");

const apiBaseUrl = "https://api.github.com/repos/akashic-games/akashic-cli";
const pullRequestTitle = "Republish";
const pullRequestBody = "再publishを行うためにラベルのみ付与したPullRequestです。何も変更はありません。";
const pullRequestLabel = "republish";

if (process.argv.length < 3) {
	console.error("Please enter command as follows: node republishAndUpdateChangelog.js [patch|minor|major]");
	process.exit(1);
}

// どのバージョンを上げるのかを取得
const target = process.argv[2];
if (! /^patch|minor|major$/.test(target)) {
	console.error("Please specify patch, minor or major.");
	process.exit(1);
}

// lerna-changelogコマンドを実行するために環境変数GITHUB_AUTHにgithubへのアクセストークンを与える必要がある。
// しかし、与えられていなくてもコマンド実行時にエラーは発生しないのでここで事前にチェックする。
if (process.env.GITHUB_AUTH == null) {
	console.error("Must provide GITHUB_AUTH.");
	process.exit(1);
}

try {
	// PRのマージ元ブランチを作成しておく
	console.log("start to create branch");
	const branchName = "tmp_" + Date.now();
	// versionのbumpを行う前の準備作業
	execSync("git fetch");
	execSync("git checkout origin/master");
	execSync(`git checkout -b ${branchName}`);
	// PRを作るためだけに空コミットをしておく。PRはlerna-changelogでCHANGELOGを更新するために必要。
	execSync("git commit --allow-empty -m 'empty'");
	execSync(`git push origin ${branchName}`);
	console.log("end to create branch");

	// PRの作成とマージ処理
	console.log("start to create PR");
	// PRを作成する
	const pullReqDataString = execSync(`curl --fail -H "Authorization: token ${process.env.GITHUB_AUTH}" -X POST -d '{"title":"${pullRequestTitle}", "body":"${pullRequestBody}", "head":"akashic-games:${branchName}", "base":"master"}' ${apiBaseUrl}/pulls`).toString();
	const pullReqData = JSON.parse(pullReqDataString);
	// issue(PR)にラベル付ける
	execSync(`curl --fail -H "Authorization: token ${process.env.GITHUB_AUTH}" -X POST -d '{"labels": ["${pullRequestLabel}"]}' ${apiBaseUrl}/issues/${pullReqData["number"]}/labels`);
	// PRのマージ
	execSync(`curl --fail -H "Authorization: token ${process.env.GITHUB_AUTH}" -X PUT ${apiBaseUrl}/pulls/${pullReqData["number"]}/merge`);
	// ブランチ削除
	execSync("git checkout origin/master");
	execSync(`git branch -D ${branchName}`);
	execSync(`git push origin :${branchName}`);
	console.log("end to merge PR");

	// 現在のCHANGELOGに次バージョンのログを追加
	console.log("start to update changelog");
	execSync("git checkout master");
	execSync("git pull origin master");
	// 全akashic-cli-xxxに依存するakashic-cliモジュールの次のバージョン番号を取得
	const packageJson = require(path.join(__dirname, "..", "packages", "akashic-cli", "package.json"));
	const nextVersion = semver.inc(packageJson["version"], target);
	updateChangelog(nextVersion);
	execSync("git add ./CHANGELOG.md");
	execSync("git commit -m 'Update Changelog'");
	execSync("git push origin master");
	console.log("end to publish");

	// publish処理
	console.log("start to publish");
	execSync(`${path.join(__dirname, "..", "node_modules", ".bin", "lerna")} publish ${target} --force-publish=* --yes`);
	console.log("end to publish");
} catch (e) {
	console.error(e);
	process.exit(1);
}
