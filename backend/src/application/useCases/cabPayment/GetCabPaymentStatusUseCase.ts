import { inject, injectable } from "tsyringe";
import { IGetCabPaymentStatusUseCase } from "@application/interfaces/useCase/cabPayment/IGetCabPaymentStatusUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ICabPaymentStatusResponseDTO } from "@domain/dtos/cabPayment/cabPaymentStatus.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { CabPaymentMapper } from "@mappers/cabPaymentMapper";

@injectable()
export class GetCabPaymentStatusUseCase implements IGetCabPaymentStatusUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute(tripId: string): Promise<ICabPaymentStatusResponseDTO> {
    const ride = await this._rideRepo.findById(tripId);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    return CabPaymentMapper.toCabPaymentStatusResponseDTO(ride, tripId);
  }
}
