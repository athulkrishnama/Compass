import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { UserEntity } from "@domain/entities/user/user.entity";
import { ICreateUserRequestDTO } from "@domain/dtos/auth/createUser.dto";
import { Errors } from "./Errors";
import { IUserLoginResponseDTO } from "@domain/dtos/auth/userLogin.dto";
import { IGetUsersResponseDTO } from "@domain/dtos/admin/getUsers.dto";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { IGetUserProfileResponseDTO } from "@domain/dtos/auth/getUserProfile.dto";

export class UserMapper {
  static toEntityfromMongooseDocument(document: IUserDocument): UserEntity {
    return {
      _id: document._id.toString(),
      email: document.email,
      password: document.password,
      googleId: document.googleId,
      full_name: document.full_name,
      role: document.role,
      is_verified: document.is_verified,
      profile_image: document.profile_image,
      verfication_id_image: document.verfication_id_image,
      is_blocked: document.is_blocked,
      mobile: document.mobile,
      cabDetails: document.cabDetails,
      createdAt: document.createdAt,
      lastLogin: document.lastLogin,
    };
  }

  static toStringfromCreateUserDTO(dto: ICreateUserRequestDTO): string {
    return JSON.stringify(dto);
  }

  static toEntityFromString(cachedData: string): UserEntity {
    const { email, full_name, role, password } = JSON.parse(cachedData);
    if (!(email && full_name && role && password)) {
      throw new Error(Errors.REDIS_DATA_MISSING_ERROR);
    }

    return {
      email,
      full_name,
      role,
      password,
      is_blocked: false,
      is_verified: VERIFICATION_STATUSES.NOT_SUBMITTED,
    };
  }

  static toLoginUserResponseDTOfromEntity(
    user: UserEntity,
  ): IUserLoginResponseDTO {
    return {
      email: user.email,
      full_name: user.full_name,
      id: user._id!,
      role: user.role,
    };
  }

  static toGetUsersResponseDTOfromEntity(
    users: UserEntity[],
  ): IGetUsersResponseDTO["clients"] {
    const result: IGetUsersResponseDTO["clients"][number][] = users.map(
      (user) => ({
        email: user.email,
        full_name: user.full_name,
        id: user._id!,
        is_blocked: user.is_blocked,
        role: user.role,
      }),
    );
    return result;
  }

  static toGetUserProfileDTOfromEntity(
    user: UserEntity,
  ): IGetUserProfileResponseDTO {
    return {
      email: user.email,
      full_name: user.full_name,
      id: user._id!,
      is_verified: user.is_verified,
      profile_image: user.profile_image,
      verfication_id_image: user.verfication_id_image,
    };
  }
}
