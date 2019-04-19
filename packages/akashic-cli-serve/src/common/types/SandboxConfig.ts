export interface SandboxConfig {
	autoSendEvents?: string;
	backGroundImage?: string;
	showMenu?: boolean;
	events?: { [name: string]: any };
	arguments?: { [name: string]: any };
}
