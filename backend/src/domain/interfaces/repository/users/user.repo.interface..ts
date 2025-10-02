import { UserEntity } from "@domain/entities/user/user.entity";
import { IBaseRepository } from "../base/base.repo.interface";
import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";

export interface IUserRepo extends IBaseRepository<UserEntity, IUserDocument> {
  findByEmail(email: string): Promise<UserEntity | null>;
}
