import { CabEntity } from "@domain/entities/user/cab.entity";
import { IBaseRepository } from "../base/base.repo.interface";
import { ICabDocument } from "@infrastructure/repository/database configs/schemas/cabSchema";

export interface ICabRepo extends IBaseRepository<CabEntity, ICabDocument> {
  findByUserId(userId: string): Promise<CabEntity | null>;
}
