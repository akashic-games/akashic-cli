import Prompt from "prompt";

let originalPromptGet: any = null;

export function mock(config: {width: number | null; height: number | string | null; fps?: number | null}): void {
	originalPromptGet = Prompt.get;
	(Prompt as any).get = function(_schema: any, func: Function) {
		func(undefined, config);
	};
}

export function restore(): void {
	if (originalPromptGet) {
		(Prompt as any).get = originalPromptGet;
		originalPromptGet = null;
	}
}
