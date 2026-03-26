import { RideEntity } from "@domain/entities/ride/ride.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IRideDocument } from "@infrastructure/repository/ride/rideSchema";

export interface IRideRepo extends BaseRepository<RideEntity, IRideDocument> {}
