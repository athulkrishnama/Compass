import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { MONTH } from "@domain/enums/months";
import { WEEKDAY } from "@domain/enums/weekdays";

export interface IFindDestinationByIdResponseDto {
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

  openingTime?: string;
  closingTime?: string;
  closedDays?: WEEKDAY[];
}
