
export const enum TelemeretryRandomAction {
	Reset = 0,
	Generate = 1,
	Get = 2,
}

export interface TelemetryMessage {
	age: number;
	actions: TelemeretryRandomAction[] | null;
	idx: number;
}
