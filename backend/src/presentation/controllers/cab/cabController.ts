import { InvalideDataException } from "@application/constants/Exceptions";
import { IDeleteCabImageUseCase } from "@application/interfaces/useCase/cab/deleteCabImageUseCase.interface";
import { IGetCabDetailsUseCase } from "@application/interfaces/useCase/cab/getCabDetailsUseCase.interface";
import { IUpdateVehicleUseCase } from "@application/interfaces/useCase/cab/updateVehicleUseCase.interface";
import { IUpdateVehicleRequestDTO } from "@domain/dtos/cab/updateVehicle.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { updateVehicleValidationSchema } from "@presentation/validationSchemas/cabValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class CabController {
  constructor(
    @inject("IUpdateVehicleUseCase")
    private _updateVehicleUseCase: IUpdateVehicleUseCase,
    @inject("IGetCabDetailsUseCase")
    private _getCabDetailsUseCase: IGetCabDetailsUseCase,
    @inject("IDeleteCabImageUseCase")
    private _deleteCabImageUseCase: IDeleteCabImageUseCase
  ) {}

  async handleGetCabDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      if(!userId){
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.ID_MISSING);
      }
      const cab = await this._getCabDetailsUseCase.execute(userId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        cab
      );
    } catch (error) {
      next(error);
    }
  }

  async handleVehicleUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data: IUpdateVehicleRequestDTO = { ...req.body };
      data.userId = req.user.id;
      const files = req.files as MulterFiles<"images">;

      if (files.images?.length) {
        data.images = files.images.map((img) => mutlterFileToFileconverter(img));
      }

      const parsedData = updateVehicleValidationSchema.safeParse(data);

      if (parsedData.error) {
        throw new InvalideDataException(parsedData.error.issues[0].message);
      }

      await this._updateVehicleUseCase.execute(data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.VEHICLE_UPDATED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCabImageDelete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const index = +req.params.index;
      if(index == null){
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
      }
      
      await this._deleteCabImageUseCase.execute(userId,index);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.VEHICLE_UPDATED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }
}
