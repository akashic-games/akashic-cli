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

	findOrRegister(locData: ContentLocatorData): ContentEntity {
		const loc = ClientContentLocator.instantiate(locData);
		const url = loc.asAbsoluteUrl();
		const registered = this.contents.get(url);
		if (registered)
			return registered;
		const content = new ContentEntity({ contentLocatorData: loc });
		this.contents.set(url, content);
		return content;
	}

	private async _initialize(): Promise<void> {
		const res = await apiClient.getContents();
		res.data.forEach(desc => {
			const content = new ContentEntity(desc);
			this.contents.set(content.locator.asAbsoluteUrl(), content);
			if (!this._defaultContent)
				this._defaultContent = content;
		});
	}
}
