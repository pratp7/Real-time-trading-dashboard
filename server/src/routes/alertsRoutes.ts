import { Router } from "express";

import {
  createAlert,
  deleteAlert,
  listAlerts,
  updateAlert,
} from "../controllers/alertsController";
import { mockAuth } from "../middleware/mockAuth";

const alertsRouter = Router();

alertsRouter.use(mockAuth);
alertsRouter.get("/", listAlerts);
alertsRouter.post("/", createAlert);
alertsRouter.patch("/:id", updateAlert);
alertsRouter.delete("/:id", deleteAlert);

export { alertsRouter };
