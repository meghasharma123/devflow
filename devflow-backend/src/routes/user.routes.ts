import express from "express";
import { getUsersController } from "../controllers/user.controller";

const userRoute = express.Router();

userRoute.get("/", getUsersController);

export default userRoute;
