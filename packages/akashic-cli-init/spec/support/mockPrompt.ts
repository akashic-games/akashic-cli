import * as Prompt from "prompt";

let originalPromptGet: any = null;

export function mock(config: {width: number, height: number | string, fps: number}) {
	originalPromptGet = Prompt.get;
	(Prompt as any).get = function(_schema: any, func: Function) {
		func(undefined, config);
	};
}

export function restore() {
	if (originalPromptGet) {
		(Prompt as any).get = originalPromptGet;
		originalPromptGet = null;
	}
}
