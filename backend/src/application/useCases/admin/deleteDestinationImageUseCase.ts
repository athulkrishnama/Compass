import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IDestinationRepo } from "@application/interfaces/repository/destination/destination.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IDeleteDestinationImageUseCase } from "@application/interfaces/useCase/admin/deleteDestinationImageUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class DelteDestinationImageUseCase
  implements IDeleteDestinationImageUseCase
{
  constructor(
    @inject("IDestinationRepo") private _destinationRepo: IDestinationRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}
  async execute(id: string, index: number): Promise<void> {
    const destination = await this._destinationRepo.findById(id);
    if (!destination) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.DESTINATION_NOT_FOUND,
      );
    }
    const image = destination.images[index];
    if (!image) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.IMAGE_NOT_FOUND,
      );
    }
    await this._storageService.delete(image);
    destination.images.splice(index, 1);
    await this._destinationRepo.update(destination, id);
  }
}
