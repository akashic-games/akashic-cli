import * as cmn from "@akashic/akashic-cli-commons";

export class Configuration extends cmn.Configuration {
	addOperationPlugin(code: number, moduleName: string): void {
		if (! this._content.operationPlugins)
			this._content.operationPlugins = [];
		const existingIndex = this.findExistingOperationPluginIndex(code);
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
				return (this._content.globalScripts!.indexOf(filePath) === -1);
			});
			this._content.globalScripts = this._content.globalScripts.concat(filepaths);
		}
	}

	addToModuleMainScripts(packageJsonFiles: string[]): void {
		this._logger.info("Adding file paths to moduleMainScripts...");
		const moduleMainScripts = cmn.NodeModules.listModuleMainScripts(packageJsonFiles);
		if (moduleMainScripts && Object.keys(moduleMainScripts).length > 0) {
			this._content.moduleMainScripts = Object.assign(this._content.moduleMainScripts || {}, moduleMainScripts);
		}
	}

	addModuleMainPaths(packageJsonFiles: string[]): void {
		this._logger.info("Adding file paths to moduleMainPaths...");
		const moduleMainPaths = cmn.NodeModules.listModuleMainPaths(packageJsonFiles);
		if (moduleMainPaths && Object.keys(moduleMainPaths).length > 0) {
			this._content.moduleMainPaths = Object.assign(this._content.moduleMainPaths || {}, moduleMainPaths);
		}
	}

	addExternal(name: string, value: string): void {
		if (!this._content.environment) this._content.environment = {};
		if (!this._content.environment.external) this._content.environment.external = {};
		this._content.environment.external[name] = value;
	}
}
