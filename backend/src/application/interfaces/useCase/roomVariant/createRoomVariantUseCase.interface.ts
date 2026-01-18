import { ICreateRoomVariantRequestDTO } from "@domain/dtos/roomVariant/createRoomVariant.dto";

export interface ICreateRoomVariantUseCase {
  execute(data: ICreateRoomVariantRequestDTO): Promise<void>;
}
