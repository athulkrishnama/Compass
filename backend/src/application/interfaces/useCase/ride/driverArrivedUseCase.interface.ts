import { IDriverArrivedRequestDTO } from "@domain/dtos/ride/driverArrived.dto";

export interface IDriverArrivedUseCase {
  execute(dto: IDriverArrivedRequestDTO): Promise<void>;
}
