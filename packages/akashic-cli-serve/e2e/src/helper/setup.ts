import {exec} from "child_process";

module.exports = function() {
	// コンテンツテスト用
	exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5000");
	exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5001");

	// serveテスト用
	exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5010");
	exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5011");
	exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5012");
	exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5013");
};
