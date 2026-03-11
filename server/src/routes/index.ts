import { Router } from "express";

import { alertsRouter } from "./alertsRoutes";
import { authRouter } from "./authRoutes";
import { tickersRouter } from "./tickersRoutes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tickers", tickersRouter);
apiRouter.use("/alerts", alertsRouter);

export { apiRouter };
