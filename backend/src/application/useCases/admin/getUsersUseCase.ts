import {
  IGetUsersRequestDTO,
  IGetUsersResponseDTO,
} from "@domain/dtos/admin/getUsers.dto";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { IGetUsersUseCase } from "application/interfaces/useCase/admin/getUsersUseCase.interface";
import { UserMapper } from "application/mappers/user.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(@inject("IUserRepo") private _userRepo: IUserRepo) {}
  async get(dto: IGetUsersRequestDTO): Promise<IGetUsersResponseDTO> {
    const { total, users } = await this._userRepo.getUsersWithFilter(
      dto.page,
      dto.filter.role,
      dto.filter.status,
      dto.filter.query,
    );

    return {
      clients: UserMapper.toGetUsersResponseDTOfromEntity(users),
      totalPages: total,
    };
  }
}
