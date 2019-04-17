import {execSync} from "child_process";
import * as path from "path";

module.exports = function() {
	//execSync(`${path.join(__dirname, "..", "..", "..", "node_modules", ".bin", "forever")} stopall`);
	// serve実行プロセスを全て拾ってきて削除
	const result = execSync("ps -e -o pid,cmd | grep bin/run | grep -v grep | awk '{ print $1 }'").toString();
	const pids = result.split("\n");
	pids.forEach(pid => {
		if (pid) {
			execSync(`kill -9 ${pid}`);
		}
	});
};
