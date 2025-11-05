import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IGetUnverifiedUsersUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserUseCase.interface";
import {
  GetUnverfiedUsersRequestDTO,
  GetUnverifiedUsersResponseDTO,
} from "@domain/dtos/admin/getUnverifiedUsers.dto";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { UserMapper } from "@mappers/user.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUnverifiedUsersUseCase implements IGetUnverifiedUsersUseCase {
  constructor(@inject("IUserRepo") private _userRepo: IUserRepo) {}
  async get({
    pageNo,
    role,
  }: GetUnverfiedUsersRequestDTO): Promise<GetUnverifiedUsersResponseDTO> {
    const data = await this._userRepo.getUsersWithFilter({
      pageNo,
      role: [role],
      is_verified: [VERIFICATION_STATUSES.PENDING],
    });

    const users = UserMapper.toGetUnverifiedUsersResponseDTOfromEntity(
      data.users,
    );
    return { totalPages: data.total, users };
  }
}
