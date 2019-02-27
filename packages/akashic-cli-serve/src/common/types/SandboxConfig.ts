export interface SandboxConfig {
	autoSendEvents?: string;
	showMenu?: boolean;
	events?: { [name: string]: any };
	arguments?: { [name: string]: any };
}
