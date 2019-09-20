window.g = require("@akashic/akashic-engine");

if (! ("gLocalAssetContainer" in window)) {
	window.gLocalAssetContainer = {};
}

if (! ("__akashic__" in window)) {
	window.__akashic__ = {};
}
