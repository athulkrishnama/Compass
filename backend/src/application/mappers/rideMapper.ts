import { RideEntity } from "@domain/entities/ride/ride.entity";
import { RideDetailsResponseDTO } from "@domain/dtos/ride/rideDetails.dto";

export class RideMapper {
  static toRideDetailsResponseDTOFromEntity(
    entity: RideEntity,
  ): RideDetailsResponseDTO {
    return {
      _id: entity._id,
      status: entity.status,
      pickup_point: entity.pickup_point,
      dropoff_point: entity.dropoff_point,
      distance: entity.distance,
      time: entity.time,
      selected_fare: entity.selected_fare,
      otp: entity.otp,
      cancelled_by: entity.cancelled_by,
      events: entity.events,
    };
  }
}
