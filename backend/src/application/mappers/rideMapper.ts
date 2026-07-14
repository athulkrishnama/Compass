import { RideEntity } from "@domain/entities/ride/ride.entity";
import { RideDetailsResponseDTO } from "@domain/dtos/ride/rideDetails.dto";
import { IActiveRideDetailsResponseDTO } from "@domain/dtos/ride/activeRideDetails.dto";
import { UserEntity } from "@domain/entities/user/user.entity";
import { CabEntity } from "@domain/entities/cab/cab.entity";
import { RideCabDetailsResponseDTO } from "@domain/dtos/ride/rideCabDetails.dto";
import { VEHICLE_TYPES } from "@domain/types/vehicleType";

import { RiderPastTripResponseDTO } from "@domain/dtos/ride/riderPastTrip.dto";
import { DriverPastTripResponseDTO } from "@domain/dtos/ride/driverPastTrip.dto";
import { RIDE_EVENT_NAMES } from "@domain/types/rideEvent";
import {
  DriverRideReportItem,
  IDriverRideReportResponseDTO,
  IAdminCabReportItem,
  IAdminCabReportResponseDTO,
} from "@domain/dtos/ride/driverRideReport.dto";

export class RideMapper {
  static toRiderPastTripResponseDTO(
    entity: RideEntity,
  ): RiderPastTripResponseDTO {
    const requestedEvent = entity.events?.find(
      (e) => e.event_name === RIDE_EVENT_NAMES.REQUESTED,
    );
    const rideDate = requestedEvent
      ? new Date(requestedEvent.timestamp)
      : new Date();

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = rideDate.toLocaleDateString("en-GB", dateOptions);

    return {
      _id: entity._id,
      status: entity.status,
      pickup_point: entity.pickup_point,
      dropoff_point: entity.dropoff_point,
      distance: entity.distance,
      time: entity.time,
      selected_fare: entity.selected_fare,
      date: formattedDate,
      paymentStatus: entity.paymentStatus,
    };
  }

  static toDriverPastTripResponseDTO(
    entity: RideEntity,
  ): DriverPastTripResponseDTO {
    const requestedEvent = entity.events?.find(
      (e) => e.event_name === RIDE_EVENT_NAMES.REQUESTED,
    );
    const rideDate = requestedEvent
      ? new Date(requestedEvent.timestamp)
      : new Date();

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = rideDate.toLocaleDateString("en-GB", dateOptions);

    return {
      _id: entity._id,
      status: entity.status,
      pickup_point: entity.pickup_point,
      dropoff_point: entity.dropoff_point,
      distance: entity.distance,
      time: entity.time,
      selected_fare: entity.selected_fare,
      date: formattedDate,
      paymentStatus: entity.paymentStatus,
    };
  }

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
      paymentStatus: entity.paymentStatus,
      paymentMethod: entity.paymentMethod,
    };
  }

  static toActiveRideDetailsResponseDTO(
    ride: RideEntity,
    rider: UserEntity,
  ): IActiveRideDetailsResponseDTO {
    return {
      _id: ride._id,
      pickup_point: ride.pickup_point,
      dropoff_point: ride.dropoff_point,
      status: ride.status,
      distance: ride.distance,
      time: ride.time,
      selected_fare: ride.selected_fare,
      paymentStatus: ride.paymentStatus,
      paymentMethod: ride.paymentMethod,
      rider: {
        _id: rider._id ?? "",
        full_name: rider.full_name,
        mobile: rider.mobile,
        profile_image: rider.profile_image,
      },
    };
  }

  static toRideCabDetailsResponseDTO(
    driver: UserEntity,
    cab: CabEntity,
  ): RideCabDetailsResponseDTO {
    return {
      driver: {
        _id: driver._id ?? "",
        full_name: driver.full_name,
        mobile: driver.mobile,
        profile_image: driver.profile_image,
      },
      cab: {
        model: cab.vehicleDetails?.model ?? "",
        type: cab.vehicleDetails?.type ?? VEHICLE_TYPES[0],
        registrationNumber: cab.vehicleDetails?.registrationNumber ?? "",
        images: cab.vehicleDetails?.images ?? [],
        averageRating: cab.averageRating ?? 0,
        totalReviews: cab.totalReviews ?? 0,
      },
    };
  }

  static toDriverRideReportResponseDTO(
    items: DriverRideReportItem[],
    total: number,
    limit: number,
    pageNo: number,
  ): IDriverRideReportResponseDTO {
    return {
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: pageNo,
      totalCount: total,
    };
  }

  static toAdminCabReportResponseDTO(
    items: IAdminCabReportItem[],
    total: number,
    limit: number,
    pageNo: number,
  ): IAdminCabReportResponseDTO {
    return {
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: pageNo,
      totalCount: total,
    };
  }
}
