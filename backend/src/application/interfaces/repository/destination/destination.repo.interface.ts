import { DestinationEntity } from "@domain/entities/destination/destination";
import { IBaseRepository } from "../base/base.repo.interface";
import { IDestinationDocument } from "@infrastructure/repository/database configs/schemas/destination";

export interface IDestinationRepo
  extends IBaseRepository<DestinationEntity, IDestinationDocument> {
  findByQuery(
    query: Record<string, string | string[]>,
  ): Promise<DestinationEntity[]>;
}
