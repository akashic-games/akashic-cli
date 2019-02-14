import * as cmn from "@akashic/akashic-cli-commons";

export class Configuration extends cmn.Configuration {
	addOperationPlugin(code: number, moduleName: string): void {
		if (! this._content.operationPlugins)
			this._content.operationPlugins = [];
		var existingIndex = this.findExistingOperationPluginIndex(code);
		if (existingIndex !== -1) {
			throw new Error("Conflicted code for operation plugins. Code " + code + " is already used");
		}
		this._content.operationPlugins.push({
			code: code,
			script: cmn.Util.makeModuleNameNoVer(moduleName)
		});
	}

	findExistingOperationPluginIndex(code: number): number {
		return (this._content.operationPlugins || []).findIndex((p) => (p.code === code));
	}

	addToGlobalScripts(filepaths: string[]): void {
		this._logger.info("Adding file paths to globalScripts...");
		if (!this._content.globalScripts) {
			this._content.globalScripts = filepaths;
		} else {
			filepaths = filepaths.filter((filePath: string) => {
				return (this._content.globalScripts.indexOf(filePath) === -1);
			});
			this._content.globalScripts = this._content.globalScripts.concat(filepaths);
		}
	}

	addToModuleMainScripts(packageJsonFiles: string[]): void {
		this._logger.info("Adding file paths to moduleMainScripts...");
		var moduleMainScripts = cmn.NodeModules.listModuleMainScripts(packageJsonFiles);
		if (moduleMainScripts && Object.keys(moduleMainScripts).length > 0) {
			if (! this._content.moduleMainScripts) {
				this._logger.warn(
					"Newly added the moduleMainScripts property to game.json." +
					"This property, introduced by akashic-cli@>=1.12.2, is NOT supported by older versions of Akashic Engine." +
					"Please ensure that you are using akashic-engine@>=2.0.2, >=1.12.7."
				);
			}
			this._content.moduleMainScripts = Object.assign(this._content.moduleMainScripts || {}, moduleMainScripts);
		}
	}
}
