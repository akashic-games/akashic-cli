import { action, observable } from "mobx";
import { ServiceName, ServiceType } from "../../common/types/ServiceType";


export class TargetServiceStore {
	@observable targetService: ServiceType;

	constructor() {
		this.targetService = ServiceName.None;
	}

	@action
	setService(service: ServiceType): void {
		this.targetService = service;
	}

	get service(): ServiceType {
		return this.targetService;
	}

	isNicoLiveService(): boolean {
		return this.targetService === ServiceName.NicoLive;
	}

	createNicoLiveArgs(isBroadcaster: boolean) {
		return {
			coe: {
				permission: {
					advance: false,
					advanceRequest: isBroadcaster ? true : false,
					aggregation: false
				},
				roles: isBroadcaster ? ["broadcaster"] : [],
				debugMode: true
			}
		};
	}
}
