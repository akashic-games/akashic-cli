interface Window {
	gScriptContainer: {[key: string]: Function};
}

declare var g: typeof import("@akashic/akashic-engine");
type Trigger<T> = import("@akashic/akashic-engine").Trigger<T>;
type Asset = import("@akashic/akashic-engine").Asset;
type AssetLoadHandler = import("@akashic/akashic-engine").AssetLoadHandler;
type ScriptAssetExecuteEnvironment = import("@akashic/akashic-engine").ScriptAssetExecuteEnvironment;
