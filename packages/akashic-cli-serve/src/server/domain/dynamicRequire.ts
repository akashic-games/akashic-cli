import { createRequire } from "module";

const require = createRequire(import.meta.url);

export function dynamicRequire<T>(path: string, isDeleteCache?: boolean): T | null {
	let ret: T | null = null;
	try {
		if (isDeleteCache) delete require.cache[path];
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		ret = require(path) as T;
	} catch (e) {
		if (e.code !== "MODULE_NOT_FOUND")
			throw e;
	}
	return ret;
}
