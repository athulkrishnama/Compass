import { IRoomVariantDetailResponseDTO } from "@domain/dtos/roomVariant/getRoomVariantDetail.dto";

export interface IGetRoomVariantByIdUseCase {
  execute(roomVariantId: string): Promise<IRoomVariantDetailResponseDTO>;
}
