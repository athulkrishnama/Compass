import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { BaseRepository } from "../base/base.repo";
import { Model } from "mongoose";
import { UserMapper } from "@mappers/user.mapper";
import { UserEntity } from "@domain/entities/user/user.entity";
import { inject, injectable } from "tsyringe";
import { IUserDocument } from "../database configs/schemas/userSchema";

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
}
