import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetUnverifiedUsersUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserUseCase.interface";
import { env } from "@config/envConfig";
import {
  GetUnverfiedUsersRequestDTO,
  GetUnverifiedUsersResponseDTO,
} from "@domain/dtos/admin/getUnverifiedUsers.dto";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { UserMapper } from "@mappers/user.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUnverifiedUsersUseCase implements IGetUnverifiedUsersUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}
  async get({
    pageNo,
    role,
    query,
  }: GetUnverfiedUsersRequestDTO): Promise<GetUnverifiedUsersResponseDTO> {
    const data = await this._userRepo.getUsersWithFilter({
      pageNo,
      role: [role],
      is_verified: [VERIFICATION_STATUSES.PENDING],
      query,
    });

    for (const u of data.users) {
      if (u.profile_image)
        u.profile_image = await this._storageService.createSignedUrl(
          u.profile_image,
          env.SIGNED_URL_EXPIRY,
        );
    }

    const users = UserMapper.toGetUnverifiedUsersResponseDTOfromEntity(
      data.users,
    );
    return { totalPages: data.total, users };
  }
}
