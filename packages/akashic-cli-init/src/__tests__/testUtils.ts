import * as fsextra from "fs-extra";

export function workaroundMockFsExistsSync(): void {
	let fsSpy: jest.SpyInstance;

	beforeAll(() => {
		// node@20 で mock-fs でモックしたディレクトリ構造に対し fs.existsSync() を実行すると必ず偽が返ってくるので、spy で statSync() で存在判定をしている。
		fsSpy = jest.spyOn(fsextra, "existsSync").mockImplementation((path: fsextra.PathLike): boolean => {
			try {
				return !!fsextra.statSync(path);
			} catch (e) {
				return false;
			}
		});
	});
	afterAll(() => {
		fsSpy.mockClear();
	});
}
