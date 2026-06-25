import { CabEntity } from "@domain/entities/cab/cab.entity";
import { IBaseRepository } from "../base/base.repo.interface";

export interface ICabRepo extends IBaseRepository<CabEntity> {
  findByUserId(userId: string): Promise<CabEntity | null>;
  countCabs(): Promise<number>;
}
