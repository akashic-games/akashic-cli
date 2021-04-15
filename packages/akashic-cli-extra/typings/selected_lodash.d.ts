declare module "lodash.get" {
	const get: (object: {}, path: string, defaultValue: {}) => any;
	export = get;
}

declare module "lodash.set" {
	const set: (object: {}, path: string, Value: any) => void;
	export = set;
}

declare module "lodash.unset" {
	const unset: (object: {}, path: string) => void;
	export = unset;
}
