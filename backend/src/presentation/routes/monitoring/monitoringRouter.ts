import { MonitoringRoutes } from "@presentation/constants/routes/monitoringRoutes";
import { Router } from "express";
import client from "prom-client";
export class MonitoringRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setMetricsRoute();
  }

  private _setMetricsRoute() {
    client.collectDefaultMetrics();
    this._router.get(MonitoringRoutes.METRICS, async (_req, res) => {
      res.set("Content-Type", client.register.contentType);
      res.end(await client.register.metrics());
    });
  }

  getRouter(): Router {
    return this._router;
  }
}
