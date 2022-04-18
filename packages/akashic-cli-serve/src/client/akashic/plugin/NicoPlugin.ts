export interface CameraServiceLike {
	exists: any;
}

export interface ShareServiceLike {
	isSupported: any;
	requestShare: any;
}

export interface NicoPluginObjectLike {
	camera: CameraServiceLike;
	share: ShareServiceLike;
	getAccount: (callback: (err: any, data?: any) => void) => void;
	requestPremiumUpgrade: () => void;
	requestGetApplicationStatus: (_application: any, callback: (err: any, data?: any) => void) => void;
	getFollowStatus: (callback: (err: any, data?: any) => void) => void;
}

export class NicoPlugin implements agv.ExternalPlugin {
	readonly name: string = "nico";

	onload(game: agv.GameLike, _dataBus: unknown, _gameContent: agv.GameContent): void {
		game.external.nico = {
			camera: {
				exists: (callback: (exists: boolean) => void) => {
					window.setTimeout(() => {
						callback(false);
					}, 0);
				}
			},
			share: {
				isSupported: (callback: (supported: boolean) => void) => {
					window.setTimeout(() => {
						callback(false);
					}, 0);
				},
				requestShare: (message: string) => {
					console.log("game.external.nico.share.requestShare: ", message);
				}
			},
			getAccount: (callback: (err: any, data?: any) => void) => {
				window.setTimeout(() => {
					callback(null, { id: "252525", name: "nicouser", premium: null });
				}, 0);
			},
			requestPremiumUpgrade: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
			requestGetApplicationStatus: (_application: any, callback: (err: any, data?: any) => void) => {
				window.setTimeout(() => {
					callback(null, { isAvailable: true });
				}, 0);
			},
			getFollowStatus: (callback: (err: any, data?: any) => void) => {
				window.setTimeout(() => {
					callback(null, { isFollowing: true });
				}, 0);
			}
		} as NicoPluginObjectLike;
	}
}
