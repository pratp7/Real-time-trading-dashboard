import { Router } from "express";

import { getTickerHistory, getTickers } from "../controllers/tickersController";

const tickersRouter = Router();

tickersRouter.get("/", getTickers);
tickersRouter.get("/:id/history", getTickerHistory);

export { tickersRouter };
