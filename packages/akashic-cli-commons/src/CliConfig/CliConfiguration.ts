import type { CliConfigExportHtml } from "./CliConfigExportHtml";
import type { CliConfigExportZip } from "./CliConfigExportZip";
import type { CliConfigInit } from "./CliConfigInit";
import type { CliConfigInstall } from "./CliConfigInstall";
import type { CliConfigModify } from "./CliConfigModify";
import type { CliConfigScanAsset, CliConfigScanGlobalScripts } from "./CliConfigScan";
import type { CliConfigServe } from "./CliConfigServe";
import type { CliConfigStat } from "./CliConfigStat";
import type { CliConfigUninstall } from "./CliConfigUninstall";
import type { CliConfigUpdate } from "./CliConfigUpdate";

/**
 * akashic.config.js の型。
 */
export interface CliConfiguration {
	commandOptions: {
		export?: {
			html?: Partial<CliConfigExportHtml>;
			zip?: Partial<CliConfigExportZip>;
		};
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
