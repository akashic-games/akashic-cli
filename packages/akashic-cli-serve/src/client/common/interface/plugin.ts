import { Event } from "@akashic/playlog";

export interface CoePlugin {
	startSession: (parameters: CoeStartSessionParameterObject) => void;
	exitSession: (sessionId: string, parameters: CoeExitSessionParameterObject) => void;
	sendLocalEvents: (sessionId: string, events: Event[]) => void;
}

export interface CoeApplicationIdentifier {
	type: string;
	version: string;
	url?: string;
}

export interface CoeExternalMessage {
	type: string;
	sessionId: string;
	result?: any;
	target?: string;
	id?: number;
	data?: any;
}

export interface CoeStartSessionParameterObject {
	sessionId: string;
	local?: boolean;
	localEvents?: Event[];
	delayRange?: number;
	application?: CoeApplicationIdentifier;
	cascadeApplications?: CoeApplicationIdentifier[];
	messageHandler?: (message: CoeExternalMessage) => void;
	eventSendablePlayers?: string[];
	additionalData?: any;
	size?: {
		width: number;
		height: number;
	};
}

export interface CoeExitSessionParameterObject {
	needsResult?: boolean;
	needsPlaylog?: boolean;
}
