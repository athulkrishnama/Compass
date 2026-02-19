import { CabEntity } from "@domain/entities/cab/cab.entity";
import { IBaseRepository } from "../base/base.repo.interface";
import { ICabDocument } from "@infrastructure/repository/cab/cabSchema";

export interface ICabRepo extends IBaseRepository<CabEntity, ICabDocument> {
  findByUserId(userId: string): Promise<CabEntity | null>;
  countCabs(): Promise<number>;
}
