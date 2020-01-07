export function dynamicRequire<T>(path: string, isDeleteCache?: boolean): T | null {
	let ret: T | null = null;
	try {
		if (isDeleteCache) delete require.cache[path];
		ret = require(path) as T;
	} catch (e) {
		if (e.code !== "MODULE_NOT_FOUND")
			throw e;
	}
	return ret;
}
