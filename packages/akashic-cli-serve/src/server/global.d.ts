declare namespace NodeJS {
	interface ProcessEnv {
		/**
		 * engine-files v3 のビルド成果物のパス (e.g. `./engineFilesV3_x_y.js`)。
		 * この値が指定された場合、 対象の engine-files を akashic-engine v3 コンテンツ実行時に利用する。
		 */
		readonly ENGINE_FILES_V3_PATH: string;
	}
}
