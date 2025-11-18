export type RuntimeWarningType =
	"useMathRandom" |
	"useMathSinCosTan" |
	"drawOutOfCanvas" |
	"drawDestinationEmpty" |
	"createNonIntegerSurface";

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
	referenceUrl?: string;
	referenceMessage?: string;
}
