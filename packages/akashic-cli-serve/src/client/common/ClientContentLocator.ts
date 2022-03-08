import { ContentLocator } from "../../common/ContentLocator";
import type { ContentLocatorData } from "../../common/types/ContentLocatorData";

export class ClientContentLocator extends ContentLocator {
	static instantiate(locData: ContentLocatorData): ClientContentLocator {
		return (locData instanceof ClientContentLocator) ? locData : new ClientContentLocator(locData);
	}

	asAbsoluteUrl(): string {
		const host = this.host || window.location.origin;
		return host + this.asRootRelativeUrl();
	}
}
