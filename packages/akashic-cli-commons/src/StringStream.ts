import * as stream from "stream";

export class StringStream extends stream.Readable {
	content: string;
	file: string;

	constructor (content: string, fileName?: string) {
		super();
		this.content = content;
		this.file = fileName;
	}

	_read(size: number): void {
		if (!this.content) {
			this.push(null);
		} else {
			this.push(this.content.slice(0, size));
			this.content = this.content.slice(size);
		}
	}
}
