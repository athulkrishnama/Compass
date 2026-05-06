import { InvalideDataException } from "@application/constants/Exceptions";
import { ICreateFareUseCase } from "@application/interfaces/useCase/ride/createFareUseCase.interface";
import { ICreateRideUseCase } from "@application/interfaces/useCase/ride/createRideUseCase.interface";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { calculateFareValidationSchema } from "@presentation/validationSchemas/fareValidation";
import { createRideValidationSchema } from "@presentation/validationSchemas/rideValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class RideController {
  constructor(
    @inject("ICreateFareUseCase")
    private _createFareUseCase: ICreateFareUseCase,
    @inject("ICreateRideUseCase")
    private _createRideUseCase: ICreateRideUseCase,
  ) {}

  async handleCreateFare(req: Request, res: Response, next: NextFunction) {
    try {
      const data = calculateFareValidationSchema.safeParse(req.body);

      if (!data.success) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      const fare = await this._createFareUseCase.execute({
        ...data.data,
        travelerId: req.user.id,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.FARE_CREATED_SUCCESSFULLY,
        fare,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCreateRide(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRideValidationSchema.safeParse({
        ...req.body,
        userId: req.user.id,
      });

      if (!data.success) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      const rideId = await this._createRideUseCase.execute(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.RIDE_CREATED_SUCCESSFULLY,
        { rideId },
      );
    } catch (error) {
      next(error);
    }
  }
}
