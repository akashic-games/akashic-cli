export interface CliConfigScanAsset {
	cwd?: string;
	quiet?: boolean;
	watch?: boolean;
	force?: boolean;
	usePathAssetId?: boolean;
	updateAssetId?: boolean;
	includeExtensionToAssetId?: boolean;
	imageAssetDir?: string[];
	audioAssetDir?: string[];
	scriptAssetDir?: string[];
	textAssetDir?: string[];
	textAssetExtension?: string[];
}

export interface CliConfigScanGlobalScripts {
	cwd?: string;
	quiet?: boolean;
	force?: boolean;
	fromEntryPoint?: boolean;
	omitPackagejson?: boolean;
	useMmp?: boolean;
	useMms?: boolean;
}
