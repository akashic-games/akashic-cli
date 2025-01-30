import { CliConfigFontDeclaration } from "./common.js";

export interface CliConfigSandbox {
	args?: string[];
	cwd?: string;
	port?: number;
	cascade?: string[];
	scenario?: string;
	fonts?: CliConfigFontDeclaration[];
}
