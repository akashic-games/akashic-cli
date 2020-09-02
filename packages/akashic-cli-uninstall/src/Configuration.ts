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

	// externalの要素名とライブラリは、ユースケース実態として1:1対応しているため、removeは要素を消すだけの実装としている
	// 同じ要素名を使うライブラリをサポートする場合などには、必要な要素のみを正しくremoveするよう修正する必要がある
	removeExternal(name: string) {
		if (!this._content.environment || !this._content.environment.external) return;
		delete this._content.environment.external[name];
	}
}
