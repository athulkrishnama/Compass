import { FareEntity } from "@domain/entities/fare/fare.entity";

export class FareMapper {
  static toEntityFromCreateFareDTO(
    data: Omit<FareEntity, "_id" | "created_at" | "status">,
  ): FareEntity {
    return {
      _id: "",
      rider_id: data.rider_id,
      pickup_coordinates: data.pickup_coordinates,
      drop_coordinates: data.drop_coordinates,
      distance_km: data.distance_km,
      duration_minutes: data.duration_minutes,
      fare_options: data.fare_options,
      selected_option: data.selected_option,
      status: "PENDING_SELECTION",
      expires_at: data.expires_at,
      created_at: new Date(),
    };
  }
}
