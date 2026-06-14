import express from "express";
import { getTools } from "../controllers/toolController.js";

const toolRouter = express.Router();

toolRouter.get("/", getTools);

export default toolRouter;
