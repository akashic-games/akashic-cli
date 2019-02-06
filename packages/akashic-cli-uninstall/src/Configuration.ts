import * as cmn from "@akashic/akashic-cli-commons";

export class Configuration extends cmn.Configuration {
	removeOperationPlugin(moduleName: string): void {
		if (! this._content.operationPlugins)
			this._content.operationPlugins = [];
		var moduleNameNoVer = cmn.Util.makeModuleNameNoVer(moduleName);
		var operationPlugins: cmn.OperationPluginDeclaration[] = this._content.operationPlugins;
		operationPlugins = operationPlugins.filter((e) => e.script !== moduleNameNoVer);
		if (operationPlugins.length === this._content.operationPlugins.length)
			this._logger.info("No entry for " + moduleName + " in operationPlugins.");
		this._content.operationPlugins = operationPlugins;
	}
}
