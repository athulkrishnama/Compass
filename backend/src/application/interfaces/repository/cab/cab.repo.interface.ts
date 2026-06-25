import { CabEntity } from "@domain/entities/cab/cab.entity";
import { IBaseRepository } from "../base/base.repo.interface";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

export interface ICabRepo extends IBaseRepository<CabEntity> {
  findByUserId(userId: string): Promise<CabEntity | null>;
  countCabs(): Promise<number>;
  updateActiveRide(
    driverId: string,
    rideId: string | null,
    session?: IDbSession,
  ): Promise<void>;
}
