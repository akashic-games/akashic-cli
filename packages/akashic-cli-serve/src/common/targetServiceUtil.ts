
export function isServiceTypeNicoliveLike(targetService: string): boolean {
	return (/^nicolive.*/.test(targetService) || targetService === "atsumaru:multi");
}
