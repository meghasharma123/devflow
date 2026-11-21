import { Request, Response, NextFunction } from "express";
import { getAllUsers } from "../services/user.service";

export function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = getAllUsers();

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
