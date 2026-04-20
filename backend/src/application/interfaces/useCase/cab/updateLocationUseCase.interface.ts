import { ILocationUpdateRequestDTO } from "@domain/dtos/cab/locationUpdate.dto";

export interface IUpdateLocationUseCase {
  execute(dto: ILocationUpdateRequestDTO): Promise<void>;
}
