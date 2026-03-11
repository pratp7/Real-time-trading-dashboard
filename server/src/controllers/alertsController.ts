import { Request, Response } from "express";

import { alertsService } from "../services/alertsService";
import { AlertCondition } from "../types/domain";

const getUserId = (req: Request): string => {
  return req.user?.id ?? "user-1";
};

export const listAlerts = (req: Request, res: Response): void => {
  const alerts = alertsService.listAlerts(getUserId(req));
  res.status(200).json({ alerts });
};

export const createAlert = (req: Request, res: Response): void => {
  const { symbol, name, targetPrice, condition } = req.body as {
    symbol?: string;
    name?: string;
    targetPrice?: number;
    condition?: AlertCondition;
  };

  if (!symbol || !name || typeof targetPrice !== "number") {
    res.status(400).json({ error: "symbol, name and targetPrice are required" });
    return;
  }

  if (condition !== "above" && condition !== "below") {
    res.status(400).json({ error: "condition must be above or below" });
    return;
  }

  const alert = alertsService.createAlert({
    symbol,
    name,
    targetPrice,
    condition,
    userId: getUserId(req),
  });

  res.status(201).json(alert);
};

export const updateAlert = (req: Request, res: Response): void => {
  const { isActive } = req.body as { isActive?: boolean };
  const alertIdParam = req.params.id;
  const alertId = Array.isArray(alertIdParam) ? alertIdParam[0] : alertIdParam;

  if (typeof isActive !== "boolean") {
    res.status(400).json({ error: "isActive boolean is required" });
    return;
  }

  const updated = alertsService.toggleAlert(getUserId(req), alertId, isActive);
  if (!updated) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }

  res.status(200).json(updated);
};

export const deleteAlert = (req: Request, res: Response): void => {
  const alertIdParam = req.params.id;
  const alertId = Array.isArray(alertIdParam) ? alertIdParam[0] : alertIdParam;
  const deleted = alertsService.deleteAlert(getUserId(req), alertId);

  if (!deleted) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }

  res.status(204).send();
};
