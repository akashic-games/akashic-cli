import * as https from "https";

export function getFromHttps(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const request = https.get(url, (res) => {
			if (res.statusCode >= 400) {
				return reject(new Error(`Failed to get resource. url: ${url}. status code: ${res.statusCode}.`));
			}
			const bodies: string[] = [];
			res.on("data", (chunk) => {
				bodies.push(chunk.toString());
			});
			res.on("end", () => resolve(bodies.join("")));
		});
		request.on("error", (err) => reject(err));
	});
}
