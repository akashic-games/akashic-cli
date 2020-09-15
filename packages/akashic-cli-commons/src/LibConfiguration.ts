/**
 * akashic-lib.json の型。
 */
export interface LibConfiguration {
	gameJson: LibGameJson;
}

export interface LibGameJson {
	environment?: LibEnvironment;
}

export interface LibEnvironment {
	external?: { [name: string]: string } };
