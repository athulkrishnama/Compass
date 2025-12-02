import { InvalideDataException } from "@application/constants/Exceptions";
import { IUpdateVehicleUseCase } from "@application/interfaces/useCase/cab/updateVehicleUseCase.interface";
import { IUpdateVehicleRequestDTO } from "@domain/dtos/cab/updateVehicle.dto";
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
  ) {}

  async handleGetCabDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
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
      const files = req.files as MulterFiles<"images">["images"];

      if (files?.length) {
        data.images = files.map((img) => mutlterFileToFileconverter(img));
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
}
