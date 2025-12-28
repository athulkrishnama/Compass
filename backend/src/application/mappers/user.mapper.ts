import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { UserEntity } from "@domain/entities/user/user.entity";
import { ICreateUserRequestDTO } from "@domain/dtos/auth/createUser.dto";
import { IUserLoginResponseDTO } from "@domain/dtos/auth/userLogin.dto";
import { IGetUsersResponseDTO } from "@domain/dtos/admin/getUsers.dto";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { IGetUserProfileResponseDTO } from "@domain/dtos/auth/getUserProfile.dto";
import { GetUnverifiedUsersResponseDTO } from "@domain/dtos/admin/getUnverifiedUsers.dto";
import { IGetUnverifedUserDetailsResponseDTO } from "@domain/dtos/admin/getUnverifiedUserDetails.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

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
      rejection_reason: document.rejection_reason,
      is_blocked: document.is_blocked,
      mobile: document.mobile,
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
      throw new Error(INTERNAL_ERROR_MESSAGES.CACHE_DATA_MISSING);
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
    const result: IGetUsersResponseDTO["clients"] = users.map((user) => ({
      email: user.email,
      full_name: user.full_name,
      id: user._id!,
      is_blocked: user.is_blocked,
      role: user.role,
    }));
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
      rejection_reason: user.rejection_reason,
    };
  }

  static toGetUnverifiedUsersResponseDTOfromEntity(
    users: UserEntity[],
  ): GetUnverifiedUsersResponseDTO["users"] {
    const result: GetUnverifiedUsersResponseDTO["users"] = users.map((u) => ({
      email: u.email,
      full_name: u.full_name,
      id: u._id!,
      is_verified: u.is_verified,
      profile_image: u.profile_image,
    }));

    return result;
  }

  static toGetUnverifedUserDetailsResponseDTOfromEntity(
    user: UserEntity,
  ): IGetUnverifedUserDetailsResponseDTO {
    return {
      id: user._id!,
      full_name: user.full_name,
      profile_image: user.profile_image,
      email: user.email,
      is_verified: user.is_verified,
      verification_id_image: user.verfication_id_image,
    };
  }
}
