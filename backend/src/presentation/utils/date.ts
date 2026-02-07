import { differenceInDays } from "date-fns";

export function getNumberOfDays(checkinDate: Date, checkoutDate: Date): number {
  return differenceInDays(checkoutDate, checkinDate);
}
