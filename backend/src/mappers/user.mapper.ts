import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { UserEntity } from "@domain/entities/user/user.entity";
import { ICreateUserRequestDTO } from "@domain/dtos/auth/createUser.dto";
import { Errors } from "./Errors";

export class UserMapper {
  static toEntityfromMongooseDocument(document: IUserDocument): UserEntity {
    return {
      _id: document._id.toString(),
      email: document.email,
      password: document.password,
      full_name: document.full_name,
      role: document.role,
      is_blocked: document.is_blocked,
      mobile: document.mobile,
      cabDetails: document.cabDetails,
      hotelDetails: document.hotelDetails,
      travelerDetails: document.travelerDetails,
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
    };
  }
}
