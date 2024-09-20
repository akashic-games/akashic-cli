import * as fs from "fs";
import { vi } from "vitest";

export default () => {
	vi.mock("fs", async () => {
		return {
			...(await vi.importActual("node:fs")),
			existsSync: vi.fn().mockImplementation((path: fs.PathLike): boolean => {
				try {
					return !!fs.statSync(path);
				} catch (e) {
					return false;
				}
			}),
		};
	});
}
