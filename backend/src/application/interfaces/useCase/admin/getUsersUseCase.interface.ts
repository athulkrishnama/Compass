import {
  IGetUsersRequestDTO,
  IGetUsersResponseDTO,
} from "@domain/dtos/admin/getUsers.dto";

export interface IGetUsersUseCase {
  get(dto: IGetUsersRequestDTO): Promise<IGetUsersResponseDTO>;
}
