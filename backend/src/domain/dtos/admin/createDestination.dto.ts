import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { MONTH } from "@domain/enums/months";
import { WEEKDAY } from "@domain/enums/weekdays";

export interface ICreateDestinationRequestDTO {
  name: string;
  tagline: string;
  description: string;
  coverImage: File;
  images: File[];

  country: string;
  city: string;
  pincode: string;
  coordinates: [number, number];

  type: DESTINATION_TYPES;
  activities: ACTIVITY_TYPE[];
  bestTimeToVisit: MONTH[];

  isWheelChairAccessible: boolean;
  isFree: boolean;
  isAlwaysOpen: boolean;

  entryFee?: number;

  openingTime?: string;
  closingTime?: string;
  closedDays?: WEEKDAY[];
}
