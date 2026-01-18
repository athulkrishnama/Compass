import { IEditRoomVariantRequestDTO } from "@domain/dtos/roomVariant/editRoomVariant.dto";

export interface IEditRoomVariantUseCase {
  execute(data: IEditRoomVariantRequestDTO): Promise<void>;
}
