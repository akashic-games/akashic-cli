interface Mp4Inspector {
	inspect: (data: any) => any;
}

declare module "thumbcoil" {
	namespace thumbcoil {
		const mp4Inspector: Mp4Inspector;
	}
	export default thumbcoil;
}
