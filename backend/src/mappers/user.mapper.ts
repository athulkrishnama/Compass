import { IUserDocument } from "@infrastructure/repository/database configs/schemas/userSchema";
import { UserEntity } from "@domain/entities/user/user.entity";

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
}
