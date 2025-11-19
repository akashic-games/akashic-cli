import { Trigger } from "@akashic/trigger";
import type { RuntimeWarning } from "./RuntimeWarning";

export interface ScriptHelper {
	onScriptWarn: Trigger<RuntimeWarning>;
	overrides: { MeddlingMath: Math };
}

function createMeddlingMath(): Math {
	const MeddlingMath = new Proxy(Math, {
		get: (target, prop, _receiver) => {
			if (prop === "random") {
				const type = "useMathRandom";
				const message = "Math.random()が参照されました。g.game.localRandom を使用してください。";
				const referenceUrl = "https://akashic-games.github.io/guide/sandbox-config.html#warn";
				const referenceMessage = "この警告が表示される場合の対処方法についてはこちらを参照してください";
				(window as any).akashicServe.scriptHelper.onScriptWarn.fire({ type, message, referenceUrl, referenceMessage });
			} else if (prop === "sin" || prop === "cos") {
				// FIXME: tan に対応
				const type = "useMathSinCosTan";
				const message = "Math.sin() または Math.cos() が利用されました。代わりに g.game.Math.sin() または g.game.Math.cos() の利用を推奨します。";
				const referenceUrl = "https://akashic-games.github.io/guide/sandbox-config.html#warn";
				const referenceMessage = "この警告が表示される場合の対処方法についてはこちらを参照してください";
				(window as any).akashicServe.scriptHelper.onScriptWarn.fire({ type, message, referenceUrl, referenceMessage });
			}
			return (target as any)[prop];
		}
	});
	return MeddlingMath;
}

export const scriptHelper: ScriptHelper = {
	onScriptWarn: new Trigger<RuntimeWarning>(),
	overrides: {
		MeddlingMath: createMeddlingMath()
	}
};
