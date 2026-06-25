import { RideEntity } from "@domain/entities/ride/ride.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IRideRepo extends IBaseRepository<RideEntity> {
  fetchCabActiveRide(driver_id: string): Promise<RideEntity | null>;
}
