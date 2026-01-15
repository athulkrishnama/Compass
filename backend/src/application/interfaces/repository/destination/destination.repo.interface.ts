import { DestinationEntity } from "@domain/entities/destination/destination";
import { IBaseRepository } from "../base/base.repo.interface";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destinationSchema";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";

export interface IDestinationRepo
  extends IBaseRepository<DestinationEntity, IDestinationDocument> {
  findByQuery(filter: {
    query?: string;
    type?: DESTINATION_TYPES[];
    isActive?: boolean;
    isFree?: boolean;
    pageNo: number;
  }): Promise<{
    destinations: DestinationEntity[];
    totalDestinations: number;
    pageNo: number;
    totalPages: number;
  }>;
}
