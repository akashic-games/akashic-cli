import { observable, ObservableMap } from "mobx";
import type { ContentLocatorData } from "../../common/types/ContentLocatorData";
import { apiClient } from "../api/apiClientInstance";
import { ClientContentLocator } from "../common/ClientContentLocator";
import { ContentEntity } from "./ContentEntity";

export class ContentStore {
	@observable contents: ObservableMap<string, ContentEntity>;
	private _defaultContent: ContentEntity; // assertInitialize() がresolve されるまでの値は保証されない
	private _initializationWaiter: Promise<void>;

	constructor() {
		this.contents = new ObservableMap<string, ContentEntity>();
		this._defaultContent = null!;
		this._initializationWaiter = this._initialize();
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	defaultContent(): ContentEntity {
		return this._defaultContent!;
	}

	// TODO: serve 起動後にコンテンツを登録。現状未使用のため不要なら削除。
	async register(locData: ContentLocatorData): Promise<ContentEntity> {
		const loc = ClientContentLocator.instantiate(locData);
		const url = loc.asAbsoluteUrl();

		const content = new ContentEntity({ contentLocatorData: loc });
		await content.assertInitialized();
		this.contents.set(url, content);
		return content;
	}

	find(locData: ContentLocatorData): ContentEntity {
		const loc = ClientContentLocator.instantiate(locData);
		const url = loc.asAbsoluteUrl();
		const registered = this.contents.get(url);
		if (!registered)
			throw new Error("content is not found.");

		return registered;
	}

	private async _initialize(): Promise<void> {
		const res = await apiClient.getContents();
		await Promise.all(res.data.map(async (desc) => {
			const content = new ContentEntity(desc);
			await content.assertInitialized();
			this.contents.set(content.locator.asAbsoluteUrl(), content);
			if (!this._defaultContent)
				this._defaultContent = content;
		}));
	}
}
