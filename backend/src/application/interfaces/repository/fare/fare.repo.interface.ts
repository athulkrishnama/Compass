import { FareEntity } from "@domain/entities/fare/fare.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IFareRepo extends IBaseRepository<FareEntity> {}
