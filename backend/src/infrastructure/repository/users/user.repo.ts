import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { Model, RootFilterQuery } from "mongoose";
import { UserMapper } from "application/mappers/user.mapper";
import { UserEntity } from "@domain/entities/user/user.entity";
import { inject, injectable } from "tsyringe";
import { IUserDocument } from "../database configs/schemas/userSchema";
import { ROLES } from "@domain/types/roles";
import { VALUES } from "presentation/constants/values";
import { ROLES as ROLE_VALUES } from "@domain/constants/roles";
import { UserNotFoundException } from "@application/constants/Exceptions";
import { AuthError } from "@application/constants/Errors";

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
    } else {
      filter.role = [ROLE_VALUES.CAB, ROLE_VALUES.TRAVELER, ROLE_VALUES.HOTEL];
    }

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

  async getUserStatus(id: string): Promise<boolean> {
    const data = await this._model.findById(id, { is_blocked: true });

    if (!data) throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
    return data.is_blocked;
  }

  async googleSignUp(user: UserEntity): Promise<string> {
    const newUser = await this._model.create(user);
    return newUser._id.toString();
  }
}
