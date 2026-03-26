import { ICabPricingService } from "@application/interfaces/service/cabPricingService.interface";
import { env } from "@config/envConfig";
import { FareOption } from "@domain/entities/fare/fare.entity";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Coordinate } from "@domain/types/coordinate";

import { CAB_PRICING_CONFIG } from "@domain/values/cabPricingConfig";

export class CabPricingService implements ICabPricingService {
  async calculateCabPriceAndTime(
    pickup: Coordinate,
    dropoff: Coordinate,
  ): Promise<{ distance: number; time: number; fares: FareOption[] }> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?access_token=${env.MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(INTERNAL_ERROR_MESSAGES.MAPBOX_API_ERROR);
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error(INTERNAL_ERROR_MESSAGES.NO_ROUTE_FOUND);
    }

    const distanceMeters = data.routes[0].distance;
    const durationSeconds = data.routes[0].duration;

    const distance = distanceMeters / 1000; // km
    const time = durationSeconds / 60; // minutes

    const baseFareCost = 30 + distance * 12 + time * 1.5;

    const fares: FareOption[] = (
      Object.keys(CAB_PRICING_CONFIG) as Array<keyof typeof CAB_PRICING_CONFIG>
    ).map((vehicleType) => {
      const multiplier = CAB_PRICING_CONFIG[vehicleType];
      return {
        cab_type: vehicleType,
        total_fare: Math.round(baseFareCost * multiplier),
      };
    });

    return {
      distance,
      time,
      fares,
    };
  }
}
