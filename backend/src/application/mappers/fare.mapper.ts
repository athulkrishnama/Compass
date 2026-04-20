import { FareEntity } from "@domain/entities/fare/fare.entity";
import { FARE_STATUS } from "@domain/types/fareStatus";

export class FareMapper {
  static toEntityFromCreateFareDTO(
    data: Omit<FareEntity, "_id" | "created_at" | "status">,
  ): FareEntity {
    return {
      _id: "",
      rider_id: data.rider_id,
      pickup_location: data.pickup_location,
      dropoff_location: data.dropoff_location,
      distance: data.distance,
      time: data.time,
      fares: data.fares,
      status: FARE_STATUS.CREATED,
      expires_at: data.expires_at,
      created_at: new Date(),
    };
  }
}
