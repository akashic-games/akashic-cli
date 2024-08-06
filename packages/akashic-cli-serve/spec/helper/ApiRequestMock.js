const fetch = require("node-fetch");

exports.get = function(url) {
	return fetch(url)
		.then(function(response) {
			if (400 <= response.status) {
				throw new Error("Failed to GET " + url + ". Status: " + response.status);
			}
			return response.json();
		});
};

exports.post = function(url, params) {
	const body = JSON.stringify(params);
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json; charset=utf-8"
	};
	return fetch(url, {method: "POST", headers: headers, body: body})
		.then(function(response) {
			if (400 <= response.status) {
				throw new Error("Failed to POST " + url + ". Status: " + response.status);
			}
			return response.json();
		});
};

exports.del = function(url) {
	return fetch(url, {method: "DELETE"})
		.then(function(response) {
			if (400 <= response.status) {
				throw new Error("Failed to DELETE " + url + ". Status: " + response.status);
			}
			return response.json();
		});
};
