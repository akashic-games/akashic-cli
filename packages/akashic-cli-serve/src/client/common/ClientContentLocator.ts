import { ContentLocatorData } from "../../common/types/ContentLocatorData";
import { ContentLocator } from "../../common/ContentLocator";

export class ClientContentLocator extends ContentLocator {
	static instantiate(locData: ContentLocatorData): ClientContentLocator {
		return (locData instanceof ClientContentLocator) ? locData : new ClientContentLocator(locData);
	}

	asAbsoluteUrl(): string {
		const host = this.host || window.location.origin;
		return host + this.asRootRelativeUrl();
	}
}
