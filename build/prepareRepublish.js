const execSync = require("child_process").execSync;

const apiBaseUrl = "https://api.github.com/repos/akashic-games/akashic-cli";
const pullRequestTitle = "Republish";
const pullRequestBody = "再publishを行うためにラベルのみ付与したPullRequestです。何も変更はありません。";
const pullRequestLabel = "republish";

// PRの作成・マージを行うために環境変数GITHUB_AUTHにgithubへのアクセストークンを与える必要がある。
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
	// ブランチ削除とmasterの更新
	execSync("git checkout master");
	execSync(`git branch -D ${branchName}`);
	execSync(`git push origin :${branchName}`);
	execSync("git pull origin master");
	console.log("end to merge PR");
} catch (e) {
	console.error(e);
	process.exit(1);
}
