import type { CliConfigExportHtml } from "./CliConfigExportHtml.js";
import type { CliConfigExportZip } from "./CliConfigExportZip.js";
import type { CliConfigInit } from "./CliConfigInit.js";
import type { CliConfigInstall } from "./CliConfigInstall.js";
import type { CliConfigModify } from "./CliConfigModify.js";
import type { CliConfigScanAsset, CliConfigScanGlobalScripts } from "./CliConfigScan.js";
import type { CliConfigServe } from "./CliConfigServe.js";
import type { CliConfigStat } from "./CliConfigStat.js";
import type { CliConfigUninstall } from "./CliConfigUninstall.js";
import type { CliConfigUpdate } from "./CliConfigUpdate.js";

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
