import { inject, injectable } from "tsyringe";
import { IRestoreRoomUseCase } from "@application/interfaces/useCase/roomVariant/restoreRoomUseCase.interface";
import { IRestoreRoomRequestDTO } from "@domain/dtos/roomVariant/restoreRoom.dto";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class RestoreRoomUseCase implements IRestoreRoomUseCase {
  constructor(
    @inject("IRoomStatusRepo")
    private _roomStatusRepo: IRoomStatusRepo,
  ) {}

  async execute(data: IRestoreRoomRequestDTO): Promise<void> {
    const roomStatus = await this._roomStatusRepo.findById(data.id);

    if (!roomStatus) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.ROOM_STATUS_NOT_FOUND,
      );
    }

    await this._roomStatusRepo.deleteById(data.id);
  }
}
