// routes/userRoutes.js
import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getUserHistory,
  getPublishedCreations,
  getUserCreations,
  syncUser,
  toggleLikeCraetion,
  deleteCreation,
  duplicateCreation,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/sync", auth, syncUser);
userRouter.get("/history", auth, getUserHistory);
userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.post("/toggle-like-creation", auth, toggleLikeCraetion);
userRouter.delete("/creations/:id", auth, deleteCreation);
userRouter.post("/creations/:id/duplicate", auth, duplicateCreation);

export default userRouter;
