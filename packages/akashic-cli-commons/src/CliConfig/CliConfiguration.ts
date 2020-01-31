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
		export?: {
			html?: Partial<CliConfigExportHtml>;
			zip?: Partial<CliConfigExportZip>;
		}
		init?: Partial<CliConfigInit>;
		install?: Partial<CliConfigInstall>;
		modify?: Partial<CliConfigModify>;
		scan?: {
			asset?: Partial<CliConfigScanAsset>;
			globalSCripts?: Partial<CliConfigScanGlobalScripts>;
		};
		serve?: Partial<CliConfigServe>;
		stat?: Partial<CliConfigStat>;
		uninstall?: Partial<CliConfigUninstall>;
		update?: Partial<CliConfigUpdate>;
	};
}
