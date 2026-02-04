import type { ACTIVITY_TYPE } from "@/constants/destinationConstants/activityType";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";

export interface IListDestinationRequestDTO {
    pageNo: number;
    queryString?: string;
    isActive?: boolean;
    type?: DESTINATION_TYPES[];
    activities?: ACTIVITY_TYPE[];
    minPrice?: number;
    maxPrice?: number;
    city?: [number, number];
    proximityRadius?: number;
    onlyFree?: boolean;
    isWheelchairAccessible?: boolean;
    sortBy?: "name" | "entryFee";
    sortOrder?: "asc" | "desc";
}
