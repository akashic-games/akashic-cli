export interface CliConfigInstall {
	args?: string[];
	cwd?: string;
	link?: boolean;
	quiet?: boolean;
	plugin?: number;
	omitPackagejson?: boolean;
	useMmp?: boolean;
	// useMms?: boolean;
}
