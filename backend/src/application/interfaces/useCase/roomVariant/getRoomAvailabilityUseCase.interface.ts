import {
  IGetRoomAvailabilityRequestDTO,
  IGetRoomAvailabilityResponseDTO,
} from "@domain/dtos/roomVariant/getRoomAvailability.dto";

export interface IGetRoomAvailabilityUseCase {
  execute(
    data: IGetRoomAvailabilityRequestDTO,
  ): Promise<IGetRoomAvailabilityResponseDTO>;
}
