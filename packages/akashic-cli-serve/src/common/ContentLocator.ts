import type { ContentLocatorData } from "./types/ContentLocatorData.js";

export class ContentLocator {
	contentId: string | null;

	host: string | null;
	path: string | null;
	debuggablePath: string | null;

	constructor(locData: ContentLocatorData) {
		this.contentId = locData.contentId || null;
		this.host = locData.host || null;
		this.path = locData.path || null;
		this.debuggablePath = locData.debuggablePath || null;
	}

	asRootRelativeUrl(): string | null {
		if (this.contentId)
			return `/contents/${this.contentId}/content.raw.json`;
		if (this.path)
			return this.path;
		return null;
	}

	asDebuggableRootRelativeUrl(): string | null {
		if (this.contentId)
			return `/contents/${this.contentId}/content.json`;
		if (this.debuggablePath)
			return this.debuggablePath;
		return null;
	}

	asContentLocatorData(): ContentLocatorData {
		return {
			contentId: this.contentId,
			host: this.host,
			path: this.path,
			debuggablePath: this.debuggablePath
		};
	}
}
