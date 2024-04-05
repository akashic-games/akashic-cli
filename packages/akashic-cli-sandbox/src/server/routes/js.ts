import express = require("express");
import controller = require("../controller/js");
const router = express.Router();

router.get("/:scriptName(*.js$)", <express.RequestHandler>controller);

module.exports = router;
