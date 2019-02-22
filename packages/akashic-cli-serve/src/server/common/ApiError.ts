export interface ErrorArgs {
	errorCode?: string;
	errorMessage?: string;
	data?: any;
	debug?: any;
	raw?: Error;
}

export class ErrorInterface extends Error {
	public readonly status: number;
	public readonly code: string;
	public readonly data: any;
	public readonly debug: any;
	public readonly raw: Error;

	constructor(
		status: number,
		code: string,
		message: string,
		data?: any,
		debug?: any,
		raw?: Error
	) {
		super(message);
		this.status = status;
		this.code = code;
		this.data = data || undefined;
		this.debug = debug || undefined;
		this.raw = raw || undefined;
	}
}

export class BadRequestError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "BAD_REQUEST";
		const message = args.errorMessage ? args.errorMessage : "BAD_REQUEST";
		super(400, code, message, args.data, args.debug, args.raw);
	}
}

export class UnauthorizedError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "UNAUTHORIZED";
		const message = args.errorMessage ? args.errorMessage : "UNAUTHORIZED";
		super(401, code, message, args.data, args.debug, args.raw);
	}
}

export class ForbiddenError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "FORBIDDEN";
		const message = args.errorMessage ? args.errorMessage : "FORBIDDEN";
		super(403, code, message, args.data, args.debug, args.raw);
	}
}

export class NotFoundError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "NOT_FOUND";
		const message = args.errorMessage ? args.errorMessage : "NOT_FOUND";
		super(404, code, message, args.data, args.debug, args.raw);
	}
}

export class ConflictError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "CONFLICT";
		const message = args.errorMessage ? args.errorMessage : "CONFLICT";
		super(409, code, message, args.data, args.debug, args.raw);
	}
}

export class TooManyRequestError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "TOO_MANY_REQUESTS";
		const message = args.errorMessage ? args.errorMessage : "TOO_MANY_REQUESTS";
		super(429, code, message, args.data, args.debug, args.raw);
	}
}

export class InternalServerError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "INTERNAL_SERVER_ERROR";
		const message = args.errorMessage ? args.errorMessage : "INTERNAL_SERVER_ERROR";
		super(500, code, message, args.data, args.debug, args.raw);
	}
}

export class GatewatyTimeOutError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "GATEWAY_TIMEOUT";
		const message = args.errorMessage ? args.errorMessage : "GATEWAY_TIMEOUT";
		super(504, code, message, args.data, args.debug, args.raw);
	}
}

export class ServiceUnavailableError extends ErrorInterface {
	constructor(args: ErrorArgs) {
		const code = args.errorCode ? args.errorCode : "SERVICE_UNAVAILABLE";
		const message = args.errorMessage ? args.errorMessage : "SERVICE_UNAVAILABLE";
		super(503, code, message, args.data, args.debug, args.raw);
	}
}
