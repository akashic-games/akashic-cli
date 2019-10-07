export interface CameraServiceLike {
	exists: any;
}

export interface ShareServiceLike {
	isSupported: any;
	requestShare: any;
}

export class NicoPluginEntity {
	camera: CameraServiceLike;
	share: ShareServiceLike;
	getAccount: (callback: (err: any, data?: any) => void) => void;
	requestPremiumUpgrade: () => void;
	requestGetApplicationStatus: (_application: any, callback: (err: any, data?: any) => void) => void;
	getFollowStatus: (callback: (err: any, data?: any) => void) => void;

	constructor() {
		this.camera = {
			exists: (callback: (exists: boolean) => void) => {
				window.setTimeout(() => { callback(false); }, 0);
			}
		};
		this.share = {
			isSupported: (callback: (supported: boolean) => void) => {
				window.setTimeout(() => { callback(false); }, 0);
			},
			requestShare: (message: string) => {
				console.log("game.external.nico.share.requestShare: ", message);
			}
		};

		this.getAccount = (callback: (err: any, data?: any) => void) => {
			window.setTimeout(() => {
				callback(null, {
					id: "252525",
					name: "nicouser",
					premium: null
				});
			}, 0);
		};
		this.requestPremiumUpgrade = () => {};
		this.requestGetApplicationStatus = (_application: any, callback: (err: any, data?: any) => void) => {
			window.setTimeout(() => { callback(null, {isAvailable: true}); }, 0);
		};
		this.getFollowStatus = (callback: (err: any, data?: any) => void) => {
			window.setTimeout(() => { callback(null, {isFollowing: true}); }, 0);
		};

	}
}
