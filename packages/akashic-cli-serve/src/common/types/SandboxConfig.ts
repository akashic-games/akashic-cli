export interface SandboxConfigInjectionItemBase {
	type: string;
	target?: string;
	marker?: string;
	onchange?: string;
	oninput?: string;
}

export interface SandboxConfigInjectionItemRange extends SandboxConfigInjectionItemBase {
	type: "range";
	min?: number;
	max?: number;
	step?: number;
}

export interface SandboxConfigInjectionItemCheckbox extends SandboxConfigInjectionItemBase {
	type: "checkbox";
}

export interface SandboxConfigInjectionItemButton extends SandboxConfigInjectionItemBase {
	type: "button";
	caption: string;
}

export type SandboxConfigInjectionItem =
	SandboxConfigInjectionItemRange |
	SandboxConfigInjectionItemCheckbox |
	SandboxConfigInjectionItemButton;

export interface SandboxConfigInjectionConfig {
	marker?: string;
	items: { [key: string]: SandboxConfigInjectionItem };
}

export interface SandboxConfig {
	autoSendEvents?: string;
	backgroundImage?: string;
	showMenu?: boolean;
	events?: { [name: string]: any };
	arguments?: { [name: string]: any };

	injection?: SandboxConfigInjectionConfig;
}
