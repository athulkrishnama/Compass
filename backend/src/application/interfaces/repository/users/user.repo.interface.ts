import { UserEntity } from "@domain/entities/user/user.entity";
import { IBaseRepository } from "../base/base.repo.interface";
import { ROLES } from "@domain/types/roles";
import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";

export interface IUserRepo extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByIdAndUpdatePassword(email: string, password: string): Promise<void>;
  getUsersWithFilter(filter: {
    pageNo: number;
    role?: ROLES[];
    status?: boolean;
    query?: string;
    is_verified?: VERIFICATION_STATUS[] | undefined;
  }): Promise<{ users: UserEntity[]; total: number }>;
  userStatusChange(id: string, status: boolean): Promise<void>;
  getUserStatus(id: string): Promise<boolean>;
  googleSignUp(user: UserEntity): Promise<string>;
  countUsers(role?: ROLES): Promise<number>;
  findByRole(role: ROLES): Promise<UserEntity | null>;
}
