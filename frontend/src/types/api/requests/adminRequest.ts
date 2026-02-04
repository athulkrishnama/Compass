import type { DESTINATION_TYPES } from "@/constants/destinationConstants/destinationType";

export interface IUserStatusChangeRequest {
    id: string;
    status: boolean;
}

export interface IRejectUserRegistrationRequest {
    reason: string;
}

export interface IFindDestinationsRequest {
    pageNo: number;
    query?: string;
    isActive?: boolean;
    type?: DESTINATION_TYPES[];
    isFree?: boolean;
    sortBy?: "name" | "entryFee";
    sortOrder?: "asc" | "desc";
}
