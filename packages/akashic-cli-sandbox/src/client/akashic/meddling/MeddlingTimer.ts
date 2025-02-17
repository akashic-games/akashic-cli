// window 配下のObjectとなるため、命名規則のlintエラーを抑止
// eslint-disable-next-line @typescript-eslint/naming-convention
let setTimeout;
let setInterval;

(function (): void {
	setTimeout = new Proxy(window.setTimeout, {
		apply(
			target: (handler: TimerHandler, timeout?: number, ...args: any[]) => number,
			thisArg: typeof window,
			args: Parameters<typeof window.setTimeout>
		) {
			const [callback, timeout, ...rest] = args;

			const message = "グローバル関数の setTimeout() が実行されました。" +
				"Akashicコンテンツでは scene.setTimeout() を利用してください。";

			console.warn(message);
			window.dispatchEvent(new ErrorEvent("akashicWarning", {
				error: {
					message,
					referenceUrl: "https://akashic-games.github.io/reverse-reference/v3/logic/timer-timeout.html#%E8%A9%B3%E7%B4%B0",
					referenceMessage: "対応方法はこちらを参照してください。"
				}
			}));

			return Reflect.apply(target, thisArg, [callback, timeout, ...rest]);
		}
	});
})();

(function (): void {
	setInterval = new Proxy(window.setInterval, {
		apply(
			target: (handler: TimerHandler, interval?: number, ...args: any[]) => number,
			thisArg: typeof window,
			args: Parameters<typeof window.setInterval>
		) {
			const [callback, interval, ...rest] = args;

			const message = "グローバル関数の setInterval() が実行されました。" +
				"Akashicコンテンツでは scene.setInterval() を利用してください。";

			console.warn(message);
			window.dispatchEvent(new ErrorEvent("akashicWarning", {
				error: {
					message,
					referenceUrl: "https://akashic-games.github.io/reverse-reference/v3/logic/timer-interval.html#%E8%A9%B3%E7%B4%B0",
					referenceMessage: "対応方法はこちらを参照してください。"
				}
			}));

			return Reflect.apply(target, thisArg, [callback, interval, ...rest]);
		}
	});
})();

(window as any).meddlingSetTimeout = setTimeout;
(window as any).meddlingSetInterval = setInterval;
