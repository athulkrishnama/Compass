import { inject, injectable } from "tsyringe";
import { IUpdateRoomUnavailabilityUseCase } from "@application/interfaces/useCase/roomVariant/updateRoomUnavailabilityUseCase.interface";
import { IUpdateRoomUnavailabilityRequestDTO } from "@domain/dtos/roomVariant/updateRoomUnavailability.dto";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class UpdateRoomUnavailabilityUseCase
  implements IUpdateRoomUnavailabilityUseCase
{
  constructor(
    @inject("IRoomStatusRepo")
    private _roomStatusRepo: IRoomStatusRepo,
  ) {}

  async execute(data: IUpdateRoomUnavailabilityRequestDTO): Promise<string> {
    const roomStatus = await this._roomStatusRepo.findById(data.id);

    if (!roomStatus) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.ROOM_STATUS_NOT_FOUND,
      );
    }

    await this._roomStatusRepo.update(
      {
        ...roomStatus,
        status: data.status,
        reason: data.reason,
      },
      data.id,
    );

    return data.id;
  }
}
