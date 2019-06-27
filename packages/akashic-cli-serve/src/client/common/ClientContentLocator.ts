import { ContentLocator } from "../../common/ContentLocator";

export class ClientContentLocator extends ContentLocator {
	asAbsoluteUrl(): string {
		const host = this.host || window.location.origin;
		return host + this.asRootRelativeUrl();
	}
}
