import { CURRENCY } from "@domain/enums/currency";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";

export interface IListDestinationRequestDTO {
  queryString?: string;
  type?: DESTINATION_TYPES[];
  isActive?: boolean;
  isFree?: boolean;
  pageNo: number;
}

interface Destination {
  id: string;
  type: DESTINATION_TYPES;
  name: string;
  tagline: string;
  coverImage: string;
  isActive: boolean;
  entryFee?: number;
  currency?: CURRENCY;
  isFree: boolean;
}
export interface IListDestinationResponseDTO {
  destinations: Destination[];
  totalDestinations: number;
  pageNo: number;
  totalPages: number;
}
