/**
 * akashic-lib.json の型。
 */
export interface LibConfiguration {
	gameJsonData: LibGameJsonData;
}

export interface LibGameJsonData {
	environment?: LibEnvironment;
}

export interface LibEnvironment {
	external?: { [name: string]: string } };
