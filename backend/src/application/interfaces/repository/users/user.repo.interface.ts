import { UserEntity } from "@domain/entities/user/user.entity";
import { IBaseRepository } from "../base/base.repo.interface";
import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { ROLES } from "@domain/types/roles";

export interface IUserRepo extends IBaseRepository<UserEntity, IUserDocument> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByIdAndUpdatePassword(email: string, password: string): Promise<void>;
  getUsersWithFilter(
    pageNo: number,
    role: ROLES[] | undefined,
    status: boolean | undefined,
    query: string | undefined,
  ): Promise<{ users: UserEntity[]; total: number }>;
  userStatusChange(id: string, status: boolean): Promise<void>;
}
