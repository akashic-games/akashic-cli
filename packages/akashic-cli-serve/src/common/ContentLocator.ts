import { ContentLocatorData } from "./types/ContentLocatorData";

export class ContentLocator {
	contentId: string | null;

	host: string | null;
	path: string | null;
	debuggablePath: string | null;

	constructor(locData: ContentLocatorData) {
		this.contentId = locData.contentId || null;
		this.path = locData.path || null;
		this.debuggablePath = locData.debuggablePath || null;
	}

	asRootRelativeUrl(): string {
		if (this.contentId)
			return `/contents/${this.contentId}/content.raw.json`;
		if (this.path)
			return this.path;
	}

	asDebuggableRootRelativeUrl(): string {
		if (this.contentId)
			return `/contents/${this.contentId}/content.json`;
		if (this.debuggablePath)
			return this.debuggablePath;
		throw new Error("ContentLocator: no debuggable path");
	}
}
