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
    const { total, users } = await this._userRepo.getUsersWithFilter({
      pageNo: dto.page,
      query: dto.filter.query,
      role: dto.filter.role,
      status: dto.filter.status,
    });

    return {
      clients: UserMapper.toGetUsersResponseDTOfromEntity(users),
      totalPages: total,
    };
  }
}
