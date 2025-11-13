export type RuntimeWarningType =
	"useMathRandom" |
	"useMathBasicTrig" |
	"drawOutOfCanvas" |
	"drawDestinationEmpty" |
	"createNonIntegerSurface";

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
}
