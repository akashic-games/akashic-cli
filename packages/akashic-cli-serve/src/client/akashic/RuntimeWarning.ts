export type RuntimeWarningType =  "useMathRandom" | "drawOutOfCanvas" | "drawDestinationEmpty" | "createNonIntegerSurface";

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
}
