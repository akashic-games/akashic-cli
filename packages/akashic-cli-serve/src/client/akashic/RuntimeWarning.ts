export type RuntimeWarningType =  "useMathRandom" | "drawOutOfCanvas" | "drawDestinationEmpty" | "surfaceSizeIsDecimal";

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
}
