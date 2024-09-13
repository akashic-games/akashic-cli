// express独自拡張
interface Error {
	status?: number;
}

declare namespace Express {
	interface Request {
		baseDir: string;
		useRawScript: boolean;
	}
}
