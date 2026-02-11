import { IUpdateRoomUnavailabilityRequestDTO } from "@domain/dtos/roomVariant/updateRoomUnavailability.dto";

export interface IUpdateRoomUnavailabilityUseCase {
  execute(data: IUpdateRoomUnavailabilityRequestDTO): Promise<string>;
}
