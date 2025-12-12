// URLのパス名を取得するユーティリティ関数
export function getUrlPathname(url: string): string {
	if (!URL.canParse(url)) {
		throw new Error(`Invalid URL: ${url}`);
	}
	return new URL(url).pathname;
}
