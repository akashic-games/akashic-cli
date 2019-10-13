import { execSync } from "child_process";

module.exports = function() {
	// serve実行プロセスを全て拾ってきて削除
	const result = execSync("ps -e -o pid,args | grep bin/run | grep -v grep | awk '{ print $1 }'").toString();
	const pids = result.split("\n");
	pids.forEach(pid => {
		if (pid) {
			execSync(`kill -9 ${pid}`);
		}
	});
};
