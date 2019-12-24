import { CliConfigExportHtml } from "./CliConfigExportHtml";
import { CliConfigExportZip } from "./CliconfigExportZip";
import { CliConfigInit } from "./CliConfigInit";
import { CliConfigInstall } from "./CliConfigInstall";
import { CliConfigModify } from "./CliConfigModify";
import { CliConfigScanAsset, CliConfigScanGlobalScripts } from "./CliConfigScan";
import { CliConfigServe } from "./CliConfigServe";
import { CliConfigStat } from "./CliConfigStat";
import { CliConfigUninstall } from "./CliConfigUninstall";
import { CliConfigUpdate } from "./CliConfigUpdate";

/**
 * AkashicConfig.json の型。
 */
export interface CliConfiguration {
	commandOptions: {
		exportHtml?: CliConfigExportHtml;
		exportZip?: CliConfigExportZip;
		init?: CliConfigInit;
		install?: CliConfigInstall;
		modify?: CliConfigModify;
		scan?: {
			asset?: CliConfigScanAsset;
			globalSCripts?: CliConfigScanGlobalScripts;
		};
		serve?: CliConfigServe;
		stat?: CliConfigStat;
		uninstall?: CliConfigUninstall;
		update?: CliConfigUpdate;
	};
}
