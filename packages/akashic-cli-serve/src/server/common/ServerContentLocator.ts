import { ContentLocator } from "../../common/ContentLocator.js";
import { serverGlobalConfig } from "./ServerGlobalConfig.js";

export class ServerContentLocator extends ContentLocator {
	asAbsoluteUrl(): string {
		const host = this.host || `${serverGlobalConfig.protocol}://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}`;
		return host + this.asRootRelativeUrl();
	}
}
