export function dynamicRequire<T>(path: string): T | null {
	let ret: T | null = null;
	try {
		ret = require(path) as T;
	} catch (e) {
		if (e.code !== "MODULE_NOT_FOUND")
			throw e;
	}
	return ret;
}
