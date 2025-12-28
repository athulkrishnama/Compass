import { IDeleteCabImageUseCase } from "@application/interfaces/useCase/cab/deleteCabImageUseCase.interface";
import { inject, injectable } from "tsyringe";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class DeleteCabImageUseCase implements IDeleteCabImageUseCase{
    constructor(@inject("IStorageService") private _storageService: IStorageService, 
@inject("ICabRepo") private _cabRepo: ICabRepo){

    }

     async execute(userId: string,index: number): Promise<void> {
        const cab = await this._cabRepo.findByUserId(userId)
        if(!cab){
            throw new ResourceNotFoundException(INTERNAL_ERROR_MESSAGES.CAB_NOT_FOUND)
        }

        const imageKey = cab.vehicleDetails?.images[index]
        if(!imageKey){
            throw new ResourceNotFoundException(INTERNAL_ERROR_MESSAGES.IMAGE_NOT_FOUND)
        }

        await this._storageService.delete(imageKey)

        cab.vehicleDetails?.images.splice(index,1)

        await this._cabRepo.update(cab, cab._id!)
     }
}