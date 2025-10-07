import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { BaseRepository } from "../base/base.repo";
import { Model, RootFilterQuery } from "mongoose";
import { UserMapper } from "@mappers/user.mapper";
import { UserEntity } from "@domain/entities/user/user.entity";
import { inject, injectable } from "tsyringe";
import { IUserDocument } from "../database configs/schemas/userSchema";
import { ROLES } from "@domain/types/roles";
import { VALUES } from "@infrastructure/constants/values";

@injectable()
export class UserRepository
  extends BaseRepository<UserEntity, IUserDocument>
  implements IUserRepo
{
  constructor(@inject("IUserModel") protected _model: Model<IUserDocument>) {
    super(_model);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this._model.findOne({ email });

    if (user) return UserMapper.toEntityfromMongooseDocument(user);
    return null;
  }

  async findByIdAndUpdatePassword(
    email: string,
    password: string,
  ): Promise<void> {
    await this._model.updateOne({ email }, { $set: { password } });
  }

  async getUsersWithFilter(
    pageNo: number,
    role: ROLES[] | undefined,
    status: boolean | undefined,
    query: string | undefined,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const skip = (pageNo - 1) * VALUES.GET_USERS_LIMIT;

    const filter: RootFilterQuery<IUserDocument> = {};

    if (status !== undefined) {
      filter.is_blocked = status;
    }

    if (query !== undefined) {
      filter.query = query;
    }

    if (role) {
      for (const r of role) {
        if (filter.role) {
          filter.role.push(r);
        } else {
          filter.role = [r];
        }
      }
    }

    console.log("filter", filter);
    const response = await this._model
      .find(filter)
      .skip(skip)
      .limit(VALUES.GET_USERS_LIMIT);

    const totalDocuments = Math.ceil(
      (await this._model.countDocuments(filter)) / VALUES.GET_USERS_LIMIT,
    );

    const users = response.map((user) =>
      UserMapper.toEntityfromMongooseDocument(user),
    );

    return { users, total: totalDocuments };
  }

  async userStatusChange(id: string, status: boolean): Promise<void> {
    await this._model.findByIdAndUpdate(id, { is_blocked: status });
  }
}
