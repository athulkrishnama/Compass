import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";

export interface IGetDestinationRequestDTO {
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
  entryFee?: number;
  isActive: boolean;
}

export interface IGetDestinationResponseDTO {
  destinations: Destination[];
  page: number;
}
