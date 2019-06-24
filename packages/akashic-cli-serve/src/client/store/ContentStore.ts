import { observable } from "mobx";
import * as ApiClient from "../api/ApiClient";
import { ContentEntity } from "./ContentEntity";

export class ContentStore {
	@observable contents: ContentEntity[];
	private _initializationWaiter: Promise<void>;

	constructor() {
		this.contents = [];
		this._initializationWaiter = this._initialize();
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	private async _initialize(): Promise<void> {
		const res = await ApiClient.getContents();
		this.contents = res.data.map(desc => new ContentEntity(desc));
	}
}
