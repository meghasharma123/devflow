import express from "express";
import {
  getOrgController,
  updateOrgController,
} from "../controllers/organization.controller";

const orgRoutes = express.Router();

orgRoutes.get("/:id", getOrgController);
orgRoutes.put("/:id", updateOrgController);

export default orgRoutes;
