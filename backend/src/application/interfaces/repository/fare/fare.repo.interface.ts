import { FareEntity } from "@domain/entities/fare/fare.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { IFareDocument } from "@infrastructure/repository/fare/fare.schema";

export interface IFareRepo extends BaseRepository<FareEntity, IFareDocument> {}
