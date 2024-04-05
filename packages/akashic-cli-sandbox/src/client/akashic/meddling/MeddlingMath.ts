// window 配下のObjectとなるため、命名規則のlintエラーを抑止
// eslint-disable-next-line @typescript-eslint/naming-convention
let MeddlingMath;

(function (): void {
	MeddlingMath = new Proxy(Math, {
		get: (target, prop, _receiver) => {
			if (prop === "random") {
				console.warn("Math.random()が実行されました。g.game.localRandom を使用してください。");
				window.dispatchEvent(new ErrorEvent("akashicWarning", {
					error: {
						message: "Math.random()が実行されました。g.game.localRandom を使用してください。",
						referenceUrl: "https://akashic-games.github.io/guide/sandbox-config.html#warn",
						referenceMessage: "各種警告表示の設定や対応方法はこちらを参照してください。"
					}
				}));
			}
			return (target as any)[prop];
		}
	});
})();

(window as any).MeddlingMath = MeddlingMath;
