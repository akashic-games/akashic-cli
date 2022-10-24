type CommandName = "screenshot" | "finish";

export interface ScenarioEventData {
	type: "scenario";
	command: {
		name: CommandName;
		options?: {
			fileName: string;
		};
	};
}
