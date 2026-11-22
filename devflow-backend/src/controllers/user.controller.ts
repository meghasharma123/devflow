import { Request, Response, NextFunction } from "express";
import { getAllUsers, registerUser } from "../services/user.service";

export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { page, limit } = req.query;
    const userDetail = await getAllUsers(Number(page) || 1, Number(limit) || 20);

    return res.status(200).json({ success: true, data:userDetail });
  } catch (error) {
    next(error);
  }
}

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Your implementation
  try {
    const { name, email } = req.body;
    const userDetail = await registerUser(name,email);

    return res.status(201).json({success:true,data:userDetail})
  } catch (error) {
    next(error);
  }
}
