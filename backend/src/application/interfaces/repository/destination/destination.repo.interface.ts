import { DestinationEntity } from "@domain/entities/destination/destination";
import { IBaseRepository } from "../base/base.repo.interface";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destinationSchema";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { ACTIVITY_TYPE } from "@domain/enums/activityType";

export interface IDestinationRepo
  extends IBaseRepository<DestinationEntity, IDestinationDocument> {
  findByQuery(filter: {
    query?: string;
    type?: DESTINATION_TYPES[];
    isActive?: boolean;
    isFree?: boolean;
    pageNo: number;
    sortBy?: "name" | "entryFee";
    sortOrder?: "asc" | "desc";
  }): Promise<{
    destinations: DestinationEntity[];
    totalDestinations: number;
    pageNo: number;
    totalPages: number;
  }>;

  advancedFindByQuery(filter: {
    pageNo: number;
    queryString?: string;
    type?: DESTINATION_TYPES[];
    activities?: ACTIVITY_TYPE[];
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    city?: [number, number];
    proximityRadius?: number;
    onlyFree?: boolean;
    isWheelchairAccessible?: boolean;
    sortBy?: "name" | "entryFee";
    sortOrder?: "asc" | "desc";
  }): Promise<{
    destinations: DestinationEntity[];
  }>;
}
