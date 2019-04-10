import {action, observable} from "mobx";
import {storage} from "./storage";

export class ExternalPluginUiStore {
	@observable contentUrl: string;
	@observable sessionParameters: string;
	@observable currentPlayId: string | null;

	constructor() {
		this.contentUrl = storage.data.childSessionContentUrl;
		this.sessionParameters = storage.data.childSessionParameters;
	}

	@action
	setContentUrl(url: string): void {
		this.contentUrl = url;
		storage.put({ childSessionContentUrl: url });
	}

	@action
	setSessionParameters(params: string): void {
		this.sessionParameters = params;
		storage.put({ childSessionParameters: params });
	}

	@action
	setCurrentPlay(playId: string | null): void {
		this.currentPlayId = playId;
	}
}
