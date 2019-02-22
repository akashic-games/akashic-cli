interface EctStatic {
	(opt: any): any;
}
declare var ect: EctStatic;
declare module "ect" {
	export = ect
}
