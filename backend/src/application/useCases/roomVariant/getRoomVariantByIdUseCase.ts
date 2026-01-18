import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetRoomVariantByIdUseCase } from "@application/interfaces/useCase/roomVariant/getRoomVariantByIdUseCase.interface";
import { env } from "@config/envConfig";
import { IRoomVariantDetailResponseDTO } from "@domain/dtos/roomVariant/getRoomVariantDetail.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { RoomVariantMapper } from "@mappers/roomVariant.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetRoomVariantByIdUseCase implements IGetRoomVariantByIdUseCase {
  constructor(
    @inject("IRoomVariantRepo")
    private readonly _roomVariantRepository: IRoomVariantRepo,
    @inject("IStorageService")
    private readonly _storageService: IStorageService,
  ) {}

  async execute(roomVariantId: string): Promise<IRoomVariantDetailResponseDTO> {
    const roomVariant =
      await this._roomVariantRepository.findById(roomVariantId);
    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }
    roomVariant.coverImage = await this._storageService.createSignedUrl(
      roomVariant.coverImage,
      env.SIGNED_URL_EXPIRY,
    );
    roomVariant.images = await Promise.all(
      roomVariant.images.map((image) =>
        this._storageService.createSignedUrl(image, env.SIGNED_URL_EXPIRY),
      ),
    );
    return RoomVariantMapper.toRoomVariantDetailResponseDTO(roomVariant);
  }
}
