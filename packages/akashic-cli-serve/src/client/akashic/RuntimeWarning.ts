export type RuntimeWarningType = "drawOutOfCanvas" | "drawDestinationEmpty";

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
}
