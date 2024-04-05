// window 配下のObjectとなるため、命名規則のlintエラーを抑止
// eslint-disable-next-line @typescript-eslint/naming-convention
let MeddlingDate;

(function (): void {
	MeddlingDate = new Proxy(Date, {
		get: (target, prop, _receiver) => {
			if (prop === "now") {
				console.warn("Date.now()が実行されました。Akashicコンテンツではこの機能に依存してゲームの実行状態が変わらないようにしてください。");
				window.dispatchEvent(new ErrorEvent("akashicWarning", {
					error: {
						message: "Date.now()が実行されました。Akashicコンテンツではこの機能に依存してゲームの実行状態が変わらないようにしてください。",
						referenceUrl: "https://akashic-games.github.io/guide/sandbox-config.html#warn",
						referenceMessage: "各種警告表示の設定や対応方法はこちらを参照してください。"
					}
				}));
			}
			return (target as any)[prop];
		}
	});
})();

(window as any).MeddlingDate = MeddlingDate;
