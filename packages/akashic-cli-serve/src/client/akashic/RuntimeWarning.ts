export type RuntimeWarningType = "drawOutOfCanvas";  // 将来的に | で増える可能性がある

export interface RuntimeWarning {
	type: RuntimeWarningType;
	message: string;
}
