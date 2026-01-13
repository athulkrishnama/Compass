import type { CURRENCY } from "@/constants/destinationConstants/currency";
import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";

interface Destination {
    id: string;
    name: string;
    tagline: string;
    coverImage: string;
    type: DESTINATION_TYPES;
    isFree: boolean;
    isActive: boolean;
    entryFee: number;
    currency: CURRENCY;
}
export interface IFindDestinationsResponse {
    totalDestinations: number;
    pageNo: number;
    totalPages: number;
    destinations: Destination[];
}
