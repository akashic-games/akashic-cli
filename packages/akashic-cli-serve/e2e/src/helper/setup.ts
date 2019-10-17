import { execSync, exec } from "child_process";

module.exports = function () {
	const result = execSync("ps -e -o args | grep -e bin/run -e 'akashic serve'").toString();
	// serve起動に使われている全てのポート番号を取得
	const usedPorts = result.split("\n").filter(str => str !== "" && !str.match(/grep/)).map(cmd => {
		const matches = cmd.match(/(\-p|\-\-port)\s+(\d+)/);
		if (matches) {
			return parseInt(matches[2]);
		} else {
			return 3300; // ポートが指定されていなければデフォルト値の3300が使われるので
		}
	});
	const firstPort = 5000;
	const limit = 10;
	let i: number;
	for (i = 0; i < limit; i++) {
		const targetPort = firstPort + i;
		if (!usedPorts.some(p => p === targetPort)) {
			exec("cd e2e/fixtures/speed-jigsaw && ../../../bin/run -p " + targetPort);
			process.env.SERVE_PORT = "" + targetPort;
			console.log("process.env.SERVE_PORT:" + process.env.SERVE_PORT);
			break;
		}
	}
	if (i === limit) {
		console.error("サーバーの起動に失敗しました");
		process.exit(1);
	}
};
