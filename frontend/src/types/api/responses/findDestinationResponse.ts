import type { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import type { CURRENCY } from "@/constants/destinationConstants/currency";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";
import type { MONTH } from "@/constants/destinationConstants/months";
import type { WEEKDAY } from "@/constants/destinationConstants/weekdays";

export interface IFindDestinationResponseDTO {
    id: string;
    name: string;
    tagline: string;
    description: string;
    coverImage: string;
    images: string[];

    country: string;
    city: string;
    pincode: string;
    coordinates: [number, number];

    type: DESTINATION_TYPES;
    activities: ACTIVITY_TYPE[];
    bestTimeToVisit: MONTH[];

    isActive: boolean;
    isWheelChairAccessible: boolean;
    isFree: boolean;
    isAlwaysOpen: boolean;

    entryFee?: number;
    currency?: CURRENCY;

    openingTime?: string;
    closingTime?: string;
    closedDays?: WEEKDAY[];
}
