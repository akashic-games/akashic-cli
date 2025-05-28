export type CliConfigFontDescriptors = {
	"font-family": string; // NOTE: font-family は必須
} & Record<string, string>;

export interface CliConfigFontDeclaration {
	path: string;
	descriptors: CliConfigFontDescriptors;
}
