declare module "unzip" {
	import * as stream from "stream";

	export function Extract(params: {
		path: string;
		verbose?: boolean;
	}): stream.Writable;

	export function Parse(params: {
		verbose?: boolean;
	}): stream.Readable;
}
