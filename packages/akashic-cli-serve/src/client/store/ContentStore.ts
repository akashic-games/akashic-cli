import { observable, ObservableMap } from "mobx";
import { ContentLocatorData } from "../../common/types/ContentLocatorData";
import { GameConfiguration } from "../../common/types/GameConfiguration";
import { ClientContentLocator } from "../common/ClientContentLocator";
import * as ApiClient from "../api/ApiClient";
import { ContentEntity } from "./ContentEntity";

export class ContentStore {
	@observable contents: ObservableMap<string, ContentEntity>;
	private _defaultContent: ContentEntity;
	private _initializationWaiter: Promise<void>;
	private _gameJsonTable: { [name: string]: GameConfiguration };

	constructor() {
		this.contents = new ObservableMap<string, ContentEntity>();
		this._defaultContent = null;
		this._gameJsonTable = {};
		this._initializationWaiter = this._initialize();
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	defaultContent(): ContentEntity {
		return this._defaultContent;
	}

	findOrRegister(locData: ContentLocatorData): ContentEntity {
		const loc = ClientContentLocator.instantiate(locData);
		const url = loc.asAbsoluteUrl();
		if (this.contents.get(url))
			return this.contents.get(url);
		const gameJson = this._gameJsonTable[loc.contentId];
		const content = new ContentEntity({ contentLocatorData: loc, gameJson: gameJson });
		this.contents.set(url, content);
		return content;
	}

	private async _initialize(): Promise<void> {
		const res = await ApiClient.getContents();
		res.data.forEach(desc => {
			const content = new ContentEntity(desc);
			this.contents.set(content.locator.asAbsoluteUrl(), content);
			this._gameJsonTable[content.locator.contentId] = desc.gameJson;
			if (!this._defaultContent)
				this._defaultContent = content;
		});
	}
}
