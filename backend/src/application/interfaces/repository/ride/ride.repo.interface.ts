import { RideEntity } from "@domain/entities/ride/ride.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRideDocument } from "@infrastructure/repository/ride/ride.schema";

export interface IRideRepo extends BaseRepository<RideEntity, IRideDocument> {
  fetchCabActiveRide(driver_id: string): Promise<RideEntity | null>;
}
