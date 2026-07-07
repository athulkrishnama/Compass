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
import {
  updateVehicleValidationSchema,
  nearbyDriversValidationSchema,
  dashboardStatsValidationSchema,
} from "@presentation/validationSchemas/cabValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetNearbyDriversUseCase } from "@application/interfaces/useCase/cab/getNearbyDriversUseCase.interface";

import { IGetCabDashboardStatsUseCase } from "@application/interfaces/useCase/cab/getCabDashboardStatsUseCase.interface";

@injectable()
export class CabController {
  constructor(
    @inject("IUpdateVehicleUseCase")
    private _updateVehicleUseCase: IUpdateVehicleUseCase,
    @inject("IGetCabDetailsUseCase")
    private _getCabDetailsUseCase: IGetCabDetailsUseCase,
    @inject("IDeleteCabImageUseCase")
    private _deleteCabImageUseCase: IDeleteCabImageUseCase,
    @inject("IGetCabDashboardStatsUseCase")
    private _getCabDashboardStatsUseCase: IGetCabDashboardStatsUseCase,
    @inject("IGetNearbyDriversUseCase")
    private _getNearbyDriversUseCase: IGetNearbyDriversUseCase,
  ) {}

  async handleGetCabDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.ID_MISSING);
      }
      const cab = await this._getCabDetailsUseCase.execute(userId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        cab,
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
        data.images = files.images.map((img) =>
          mutlterFileToFileconverter(img),
        );
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
      if (index == null) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
      }

      await this._deleteCabImageUseCase.execute(userId, index);

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

  async handleGetDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.ID_MISSING);
      }

      const query = dashboardStatsValidationSchema.safeParse(req.query);
      if (!query.success) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const { type, year, month } = query.data;

      const data = await this._getCabDashboardStatsUseCase.execute(userId, {
        type,
        year,
        month,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetNearbyDrivers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = nearbyDriversValidationSchema.safeParse(req.query);
      if (!query.success) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const drivers = await this._getNearbyDriversUseCase.execute({
        coordinates: {
          latitude: query.data.latitude,
          longitude: query.data.longitude,
        },
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        drivers,
      );
    } catch (error) {
      next(error);
    }
  }
}
