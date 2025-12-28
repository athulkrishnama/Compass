import { IUpdateVehicleRequestDTO } from "@domain/dtos/cab/updateVehicle.dto";

export interface IUpdateVehicleUseCase {
  execute(dto: IUpdateVehicleRequestDTO): Promise<void>;
}
