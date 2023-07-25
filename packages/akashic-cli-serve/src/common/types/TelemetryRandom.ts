
export const enum TelemeretryRandomAction {
	Reset = 0,
	Generate = 1,
	Get = 2,
}

export interface TelemetryRandomMessage {
	age: number;
	actions: TelemeretryRandomAction[] | null;
}
