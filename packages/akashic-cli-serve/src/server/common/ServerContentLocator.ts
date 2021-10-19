import { ContentLocator } from "../../common/ContentLocator";
import { serverGlobalConfig } from "./ServerGlobalConfig";

export class ServerContentLocator extends ContentLocator {
	asAbsoluteUrl(): string {
		const host = this.host || `${serverGlobalConfig.protocol}://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}`;
		return host + this.asRootRelativeUrl();
	}
}
