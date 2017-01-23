import * as commander from "commander";
import * as fs from "fs";
import * as path from "path";
var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

commander
	.version(ver)
	.command("init", "Initialize game.json and make asset directories")
	.command("scan", "Update asset and globalScripts properties of game.json")
	.command("modify", "Update meta data of game.json")
	.command("update", "Update installed npm packages")
	.command("install", "Install a node module and update globalScripts")
	.command("uninstall", "Uninstall a node module and update globalScripts")
	.command("config", "List and edit configurations")
	.command("link", "Link a node module and update globalScripts")
	.command("unlink", "Unlink a node module and update globalScripts")
	.command("export", "Export a directory as a specified format")
	.command("stat", "Show statistics information")
	.parse(process.argv);

if (!commander.runningCommand) {
	console.log("Unknown command : " + process.argv[2]);
	commander.help();
}
