import express from "express";
import {
  createUserController,
  getUsersController,
} from "../controllers/user.controller";

const userRoute = express.Router();

userRoute.get("/", getUsersController);
userRoute.post("/", createUserController);

export default userRoute;
