import * as fs from "fs";

export function workaroundMockFsExistsSync() {
	let fsSpy: jest.SpyInstance;

	beforeAll(() => {
		// node@20 で mock-fs でモックしたディレクトリ構造に対し fs.existsSync() を実行すると必ず偽が返ってくるので、spy で statSync() で存在判定をしている。
		fsSpy = jest.spyOn(fs, "existsSync").mockImplementation((path: fs.PathLike): boolean => {
			try { 
				return !!fs.statSync(path);
			} catch (e) {
				return false;
			}
		});
	});
	afterAll(() => {
		fsSpy.mockClear();
	});
}
