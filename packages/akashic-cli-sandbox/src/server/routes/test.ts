import express = require("express");
import controller = require("../controller/test");
const router = express.Router();

router.get("/", <express.RequestHandler>controller);

module.exports = router;
