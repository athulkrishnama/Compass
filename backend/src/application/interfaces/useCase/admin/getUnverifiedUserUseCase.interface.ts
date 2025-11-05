import {
  GetUnverfiedUsersRequestDTO,
  GetUnverifiedUsersResponseDTO,
} from "@domain/dtos/admin/getUnverifiedUsers.dto";

export interface IGetUnverifiedUsersUseCase {
  get(dto: GetUnverfiedUsersRequestDTO): Promise<GetUnverifiedUsersResponseDTO>;
}
