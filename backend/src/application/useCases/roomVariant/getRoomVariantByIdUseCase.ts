import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
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
    @inject("IRoomRepo")
    private readonly _roomRepo: IRoomRepo,
  ) {}

  async execute(roomVariantId: string): Promise<IRoomVariantDetailResponseDTO> {
    const [roomVariant, rooms] = await Promise.all([
      this._roomVariantRepository.findById(roomVariantId),
      this._roomRepo.findByVariantId(roomVariantId),
    ]);

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
    return RoomVariantMapper.toRoomVariantDetailResponseDTO(roomVariant, rooms);
  }
}
