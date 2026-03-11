import { Alert, AlertCondition } from "../types/domain";

interface CreateAlertInput {
  symbol: string;
  name: string;
  targetPrice: number;
  condition: AlertCondition;
  userId: string;
}

type AlertsByUser = Record<string, Alert[]>;

export class AlertsService {
  private readonly alertsByUser: AlertsByUser = {};

  listAlerts(userId: string): Alert[] {
    return this.alertsByUser[userId] ?? [];
  }

  createAlert(input: CreateAlertInput): Alert {
    const newAlert: Alert = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      symbol: input.symbol,
      name: input.name,
      targetPrice: input.targetPrice,
      createdAt: new Date().toISOString(),
      isActive: true,
      condition: input.condition,
      userId: input.userId,
    };

    if (!this.alertsByUser[input.userId]) {
      this.alertsByUser[input.userId] = [];
    }

    this.alertsByUser[input.userId].push(newAlert);
    return newAlert;
  }

  toggleAlert(userId: string, alertId: string, isActive: boolean): Alert | null {
    const alerts = this.alertsByUser[userId] ?? [];
    const alert = alerts.find((item) => item.id === alertId);

    if (!alert) {
      return null;
    }

    alert.isActive = isActive;
    return alert;
  }

  deleteAlert(userId: string, alertId: string): boolean {
    const alerts = this.alertsByUser[userId] ?? [];
    const next = alerts.filter((item) => item.id !== alertId);

    if (next.length === alerts.length) {
      return false;
    }

    this.alertsByUser[userId] = next;
    return true;
  }
}

export const alertsService = new AlertsService();
