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
				callback(false);
			}
		};
		this.share = {
			isSupported: (callback: (supported: boolean) => void) => {
				callback(false);
			},
			requestShare: (message: string) => {
				console.log("game.external.nico.share.requestShare: ", message);
			}
		};

		this.getAccount = (callback: (err: any, data?: any) => void) => {
			callback(null, {
				id: "252525",
				name: "nicouser",
				premium: null
			});
		};
		this.requestPremiumUpgrade = () => {};
		this.requestGetApplicationStatus = (_application: any, callback: (err: any, data?: any) => void) => {
			callback(null, {isAvailable: true});
		};
		this.getFollowStatus = (callback: (err: any, data?: any) => void) => {
			callback(null, {isFollowing: true});
		};

	}
}
