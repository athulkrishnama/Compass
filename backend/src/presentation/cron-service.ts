import cron from "node-cron";
import { inject, injectable } from "tsyringe";
import { IGeoService } from "@application/interfaces/service/geoService.interface";
import { Messages } from "./constants/messages";

@injectable()
export class CronService {
  constructor(@inject("IGeoService") readonly _geoService: IGeoService) {}

  public start(): void {
    console.log(Messages.CRON_STARTED);
    cron.schedule("* * * * *", () => this._removeStaleDrivers());
  }

  private async _removeStaleDrivers(): Promise<void> {
    try {
      console.log("Running cron job: cleanup stale drivers");
      await this._geoService.cleanupStaleDrivers();
    } catch (error) {
      console.error("Error cleaning up stale drivers:", error);
    }
  }
}
