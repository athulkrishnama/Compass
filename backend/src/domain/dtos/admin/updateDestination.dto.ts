import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { CURRENCY } from "@domain/enums/currency";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { MONTH } from "@domain/enums/months";
import { WEEKDAY } from "@domain/enums/weekdays";

export interface IUpdateDestinationRequestDTO {
  id: string;
  name?: string;
  tagline?: string;
  description?: string;
  coverImage?: File;
  images?: File[];

  country?: string;
  city?: string;
  pincode?: string;
  coordinates?: [number, number];

  type?: DESTINATION_TYPES;
  activities?: ACTIVITY_TYPE[];
  bestTimeToVisit?: MONTH[];

  isWheelChairAccessible?: boolean;
  isFree?: boolean;
  isAlwaysOpen?: boolean;
  isActive?: boolean;

  entryFee?: number;
  currency?: CURRENCY;

  openingTime?: string;
  closingTime?: string;
  closedDays?: WEEKDAY[];
}
