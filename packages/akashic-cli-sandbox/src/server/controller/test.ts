import type { RequestHandler } from "express";

const controller: RequestHandler = (_req, res) => {
	res.render("test", {
		title: "test"
	});
};

export default controller;
