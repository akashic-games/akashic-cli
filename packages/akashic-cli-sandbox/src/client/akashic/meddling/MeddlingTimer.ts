let setTimeout;
let setInterval;

(function (): void {
	setTimeout = new Proxy(window.setTimeout, {
		apply(
			target: (handler: TimerHandler, timeout?: number, ...args: any[]) => number,
			thisArg: typeof window,
			args: Parameters<typeof window.setTimeout>
		) {
			const message = "グローバル関数の setTimeout() が実行されました。" +
				"Akashicコンテンツでは scene.setTimeout() を利用してください。";

			console.warn(message);
			window.dispatchEvent(new ErrorEvent("akashicWarning", {
				error: {
					message,
					referenceUrl: "https://akashic-games.github.io/reverse-reference/v3/logic/timer-timeout.html",
					referenceMessage: "対応方法はこちらを参照してください。"
				}
			}));

			return Reflect.apply(target, thisArg, args);
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
			const message = "グローバル関数の setInterval() が実行されました。" +
				"Akashicコンテンツでは scene.setInterval() を利用してください。";

			console.warn(message);
			window.dispatchEvent(new ErrorEvent("akashicWarning", {
				error: {
					message,
					referenceUrl: "https://akashic-games.github.io/reverse-reference/v3/logic/timer-interval.html",
					referenceMessage: "対応方法はこちらを参照してください。"
				}
			}));

			return Reflect.apply(target, thisArg, args);
		}
	});
})();

(window as any).meddlingSetTimeout = setTimeout;
(window as any).meddlingSetInterval = setInterval;
