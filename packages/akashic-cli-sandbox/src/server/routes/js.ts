import express from "express";
import controller from "../controller/js.js";
const router = express.Router();

router.get("/:scriptName(*.js$)", controller);

export default router;
