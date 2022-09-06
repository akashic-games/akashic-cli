export type RuntimeWarningType =  "useMathRandom" | "drawOutOfCanvas" | "drawDestinationEmpty";

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
}
