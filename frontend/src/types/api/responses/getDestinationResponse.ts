import type { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";

interface Destination {
    id: string;
    name: string;
    tagline: string;
    description: string;
    coverImage: string;

    type: DESTINATION_TYPES;
    activities: ACTIVITY_TYPE[];
    city: string;

    isFree: boolean;
    entryFee: number;
    isActive: boolean;
    isWheelChairAccessible: boolean;
}

export interface IGetDestinationResponseDTO {
    destinations: Destination[];
    page: number;
}
