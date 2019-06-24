const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;

module.exports = function (nextVersion) {
	const lernaChangeLogPath = path.join(__dirname, "..", "..", "node_modules", ".bin", "lerna-changelog");
	const addedLog = execSync(`${lernaChangeLogPath} --next-version ${nextVersion}`).toString();
	const currentChangeLog = fs.readFileSync(path.join(__dirname, ".." , "..", "CHANGELOG.md")).toString();
	const nextChangeLog = currentChangeLog.replace("# CHANGELOG\n\n", "# CHANGELOG\n" + addedLog + "\n");
	fs.writeFileSync(path.join(__dirname, "..", "..", "CHANGELOG.md"), nextChangeLog);
};
