interface Mp4Inspector {
	inspect: (data: any) => any;
}

declare module "thumbcoil" {
	namespace thumbcoil {
		var mp4Inspector: Mp4Inspector;
	}
	export = thumbcoil;
}
