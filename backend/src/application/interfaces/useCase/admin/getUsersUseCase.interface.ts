import {
  IGetUsersRequestDTO,
  IGetUsersResponseDTO,
} from "@domain/dtos/auth/getUsers.dto";

export interface IGetUsersUseCase {
  get(dto: IGetUsersRequestDTO): Promise<IGetUsersResponseDTO>;
}
