import express from "express";
import controller from "../controller/game.js";
const router = express.Router();

router.get("/", controller);

export default router;
