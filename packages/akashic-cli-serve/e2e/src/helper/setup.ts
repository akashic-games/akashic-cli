import {execSync} from "child_process";
import * as path from "path";

module.exports = function() {
	execSync(`${path.join(__dirname, "..", "..", "..", "node_modules", ".bin", "forever")} start ${path.join(__dirname, "..", "helper", "runSampleContent.js")}`);

	// // コンテンツテスト用
	// exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5000");
	// exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5001");
	//
	// // serveテスト用
	// exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5010");
	// exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5011");
	// exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5012");
	// exec("cd e2e/fixtures/sample_content && ../../../bin/run -p 5013");
};
