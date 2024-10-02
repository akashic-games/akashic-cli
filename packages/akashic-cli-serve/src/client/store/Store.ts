import type {ServiceType} from "@akashic/akashic-cli-commons/lib/ServiceType";
import {observable, action, autorun} from "mobx";
import { isServiceTypeNicoliveLike } from "../../common/targetServiceUtil";
import type {AppOptions} from "../../common/types/AppOptions";
import type {Player} from "../../common/types/Player";
import type { MessageEncodeTestbedEvent } from "../../common/types/TestbedEvent";
import type {GameViewManager} from "../akashic/GameViewManager";
import type {RuntimeWarning} from "../akashic/RuntimeWarning";
import {apiClient} from "../api/apiClientInstance";
import * as Subscriber from "../api/Subscriber";
import {ClientContentLocator} from "../common/ClientContentLocator";
import {queryParameters as query} from "../common/queryParameters";
import type { ScreenSize } from "../common/types/ScreenSize";
import {ContentStore} from "./ContentStore";
import {DevtoolUiStore} from "./DevtoolUiStore";
import type {LocalInstanceEntity} from "./LocalInstanceEntity";
import {NotificationUiStore} from "./NotificationUiStore";
import type {PlayEntity} from "./PlayEntity";
import {PlayerInfoResolverUiStore} from "./PlayerInfoResolverUiStore";
import {PlayStore} from "./PlayStore";
import {ProfilerStore} from "./ProfilerStore";
import {StartupScreenUiStore} from "./StartupScreenUiStore";
import {storage} from "./storage";
import {ToolBarUiStore} from "./ToolBarUiStore";

// FIXME: serve の ESM 移行後に commons のものを利用するように修正
export function asHumanReadable(byteLength: number, fractionDigits?: number): string {
	if (byteLength < 1024) {
		return `${byteLength} Bytes`;
	}
	// 1024 * 1024
	if (byteLength < 1048576) {
		return `${(byteLength / 1024).toFixed(fractionDigits)} KiB`;
	}
	// 1024 * 1024 * 1024
	if (byteLength < 1073741824) {
		return `${(byteLength / 1048576).toFixed(fractionDigits)} MiB`;
	}
	return `${(byteLength / 1073741824).toFixed(fractionDigits)} GiB`;
}

export interface StoreParameterObject {
	gameViewManager: GameViewManager;
}

export class Store {
	@observable contentStore: ContentStore;
	@observable playStore: PlayStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable notificationUiStore: NotificationUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable playerInfoResolverUiStore: PlayerInfoResolverUiStore;
	@observable profilerStore: ProfilerStore;
	@observable appOptions: AppOptions;
	@observable player: Player | null;
	@observable contentLocator: ClientContentLocator;

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;
	@observable gameViewSize: ScreenSize;

	private _gameViewManager: GameViewManager;
	private _initializationWaiter: Promise<void>;

	constructor(param: StoreParameterObject) {
		// TODO xnv bootstrapから渡す方が自然では？
		this.contentLocator = new ClientContentLocator({ contentId: (query.id != null) ? query.id : "0" });
		this.contentStore = new ContentStore();
		this.playStore = new PlayStore({ contentStore: this.contentStore, gameViewManager: param.gameViewManager });
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.notificationUiStore = new NotificationUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
		this.playerInfoResolverUiStore = new PlayerInfoResolverUiStore();
		this.profilerStore = new ProfilerStore();
		this.appOptions = null!;
		this.player = null;
		this.currentPlay = null;
		this.currentLocalInstance = null;
		this.gameViewSize = { width: 10, height: 10 }; // ゲーム表示時に更新されるが不具合の際に現象が分かりやすいようサイズをつけておく

		this._gameViewManager = param.gameViewManager;
		this._initializationWaiter = apiClient.getOptions().then(result => {
			this.appOptions = result.data;
			Subscriber.onMessageEncode.add(this.handleMessageEncode);
		});

		autorun(() => {
			if (!this.toolBarUiStore.fitsToScreen && this.currentLocalInstance?.intrinsicSize) {
				this.setGameViewSize(this.currentLocalInstance.intrinsicSize);
			}
		});
	}

	assertInitialized(): Promise<unknown> {
		return Promise.all([
			this.playStore.assertInitialized(),
			this.contentStore.assertInitialized(),
			this.playerInfoResolverUiStore.assertInitialized(),
			this.toolBarUiStore.assertInitialized(),
			storage.assertInitialized(),
			this._initializationWaiter
		]).then(() => {
			this.player = { id: storage.data.playerId, name: storage.data.playerName };
		});
	}

	@action
	setCurrentLocalInstance(instance: LocalInstanceEntity | null): void {
		if (this.currentLocalInstance === instance)
			return;
		this.currentLocalInstance?.onWarn.remove(this._warn, this);
		this.currentLocalInstance = instance;
		this.currentLocalInstance?.onWarn.add(this._warn, this);
		this.devtoolUiStore.setEntityTrees([]);
		if (this.currentLocalInstance?.intrinsicSize)
			this.setGameViewSize(this.currentLocalInstance.intrinsicSize);
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}

	@action
	setGameViewSize(size: ScreenSize): void {
		this.gameViewSize = size;
		this._gameViewManager.setViewSize(size.width, size.height);
	}

	get targetService(): ServiceType {
		return this.appOptions.targetService;
	}

	private _warn(warning: RuntimeWarning): void {
		const sandboxConfigWarn = this.currentLocalInstance!.content.sandboxConfig.warn;
		const warningTitle = "Runtime Warning";
		switch (warning.type) {
			case "useMathRandom":
				if (!sandboxConfigWarn || sandboxConfigWarn.useMathRandom !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({
						type: "error",
						title: warningTitle,
						name: warning.message, // 赤字表示のため name に message を設定
						message: "",
						referenceUrl: warning.referenceUrl,
						referenceMessage: warning.referenceMessage
					});
				}
				break;
			case "drawOutOfCanvas":
				if (!sandboxConfigWarn || sandboxConfigWarn.drawOutOfCanvas !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({type: "error", title: warningTitle, message: "", name: warning.message});
				}
				break;
			case "drawDestinationEmpty":
				if (!sandboxConfigWarn || sandboxConfigWarn.drawDestinationEmpty !== false) {
					console.warn(`${warning.message}`);
					this.notificationUiStore.setActive({type: "error", title: warningTitle, message: "", name: warning.message});
				}
				break;
		}
	}

	private handleMessageEncode = ({ packet, encoded }: MessageEncodeTestbedEvent): void => {
		if (!isServiceTypeNicoliveLike(this.targetService)) {
			return;
		}

		// TODO: 型をつけた方が良いかもしれない
		const data = packet.data;
		if (!data) return;

		// MessageEvent 以外は無視
		if (data[0] !== "amflow:sendEvent") return;

		// エンコード後のサイズが閾値以下であれば無視
		const EVENT_LIMIT_SIZE_BYTES = 102400; // TODO: sandbox-config などから参照できるように
		if (encoded.byteLength < EVENT_LIMIT_SIZE_BYTES) return;

		console.warn(
			`Message event size exceeds ${asHumanReadable(EVENT_LIMIT_SIZE_BYTES)} ` +
			`(encoded size: ${asHumanReadable(encoded.byteLength, 1)}). ` +
			"Large message events may potentially degrade performance or cause fatal error in nicolive environment.\n",
			"We recommend reducing the size of the following message event:",
			packet.data[2] // TODO: 人が見やすい形式に整形した方が良いかもしれない
		);
	};
}
