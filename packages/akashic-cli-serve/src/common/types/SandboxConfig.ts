export interface SandboxConfig {
	autoSendEvents?: string;
	backgroundImage?: string;
	showMenu?: boolean;
	events?: { [name: string]: any };
	arguments?: { [name: string]: any };
}
