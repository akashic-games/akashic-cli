import {action, observable} from "mobx";
import {storage} from "./storage";

export class ExternalPluginUiStore {
	@observable contentUrl: string;
	@observable sessionParameters: any;

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
	setSessionParameters(params: any): void {
		try {
			const str = JSON.stringify(params, null, 4);
			this.sessionParameters = params;
			storage.put({ childSessionParameters: str });
		} catch (e) {
			//
		}
	}
}
