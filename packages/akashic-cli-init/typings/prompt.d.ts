declare module "prompt" {
	export function get(scheme: any, handler: (err: any, result: any) => void): any;
	export function start(): any;
	export function stop(): any;
	export var message: string;
	export var delimiter: string;
}
