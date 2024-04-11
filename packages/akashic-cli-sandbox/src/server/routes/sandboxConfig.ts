import express = require("express");
import controller = require("../controller/sandboxConfig");
const router = express.Router();

router.get("/", <express.RequestHandler>controller);

module.exports = router;
