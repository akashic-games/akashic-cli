import * as queryString from "query-string";

const timeout = (ms: number): Promise<Response> => {
	return new Promise((_, reject) => setTimeout(() => reject(new Error("API実行がタイムアウトしました")), ms));
};

const DEFAULT_TIMEOUT_MILLISECOND = 5000;

const fetchWithTimeout = (url: string, options?: RequestInit, timeoutMilliSec?: number): Promise<Response> => {
	const timeoutMilliSecond = timeoutMilliSec || DEFAULT_TIMEOUT_MILLISECOND;
	return Promise.race([fetch(url, options), timeout(timeoutMilliSecond)]);
};

export const get = async<T>(url: string, params?: {[key: string]: string}): Promise<T> => {
	let urlWithQuery = url;
	if (params) {
		urlWithQuery = `${url}?${queryString.stringify(params)}`;
	}
	const response = await fetchWithTimeout(urlWithQuery);
	if (400 <= response.status) {
		throw new Error("Failed to GET " + url + ". Status: " + response.status);
	}
	return await response.json();
};

export const post = async<T>(url: string, params?: {[key: string]: string}): Promise<T> => {
	const method = "POST";
	const body = JSON.stringify(params);
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json; charset=utf-8"
	};
	const response = await fetchWithTimeout(url, {method, headers, body});
	if (400 <= response.status) {
		throw new Error("Failed to POST " + url + ". Status: " + response.status);
	}
	return await response.json();
};

// deleteは予約語なので代わりにdelを用いる
export const del = async<T>(url: string, params?: {[key: string]: string}): Promise<T> => {
	let urlWithQuery = url;
	if (params) {
		urlWithQuery = `${url}?${queryString.stringify(params)}`;
	}
	const response = await fetchWithTimeout(urlWithQuery, {method: "DELETE"});
	if (400 <= response.status) {
		throw new Error("Failed to DELETE " + url + ". Status: " + response.status);
	}
	return await response.json();
};

export const patch = async<T>(url: string, params?: {[key: string]: string}): Promise<T> => {
	const method = "PATCH";
	const body = JSON.stringify(params);
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json; charset=utf-8"
	};
	const response = await fetchWithTimeout(url, {method, headers, body});
	if (400 <= response.status) {
		throw new Error("Failed to PATCH " + url + ". Status: " + response.status);
	}
	return await response.json();
};
