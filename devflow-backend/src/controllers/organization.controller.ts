import { NextFunction, Request, Response } from "express";
import {
  getOrgFromId,
  updateOrganization,
} from "../services/organization.service";

export async function getOrgController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid organization ID",
      });
    }

    const value = await getOrgFromId(id);

    if (!value) {
      return res.status(404).json({
        message: "Organization not found.",
      });
    }
    return res.status(200).json({ value });
  } catch (error) {
    console.log("Error controller: ", error);
    next(error);
  }
}

export async function updateOrgController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    const name = req.body.name;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid organization ID",
      });
    }

    const org = await updateOrganization(id, name);

    if (!org) {
      return res.status(404).json({
        message: "Organization not found.",
      });
    }
    return res.status(200).json({ value: org });
  } catch (error) {
    next(error);
  }
}
