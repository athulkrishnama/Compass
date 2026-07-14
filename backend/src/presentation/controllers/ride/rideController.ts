import {
  InvalideDataException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { ICreateFareUseCase } from "@application/interfaces/useCase/ride/createFareUseCase.interface";
import { ICreateRideUseCase } from "@application/interfaces/useCase/ride/createRideUseCase.interface";
import { IGetRideDetailsUseCase } from "@application/interfaces/useCase/ride/getRideDetailsUseCase.interface";
import { IActiveRideDetailsUseCase } from "@application/interfaces/useCase/ride/activeRideDetailsUseCase.interface";
import { IGetRideCabDetailsUseCase } from "@application/interfaces/useCase/ride/getRideCabDetailsUseCase.interface";
import { IGetRiderPastTripsUseCase } from "@application/interfaces/useCase/ride/getRiderPastTripsUseCase.interface";
import { IGetRiderActiveRideUseCase } from "@application/interfaces/useCase/ride/getRiderActiveRideUseCase.interface";
import { IGetDriverPastTripsUseCase } from "@application/interfaces/useCase/ride/getDriverPastTripsUseCase.interface";
import { ICancelRideUseCase } from "@application/interfaces/useCase/ride/cancelRideUseCase.interface";
import { IGetDriverRideReportUseCase } from "@application/interfaces/useCase/ride/IGetDriverRideReportUseCase";
import { IGetDriverRideReportPdfUseCase } from "@application/interfaces/useCase/ride/IGetDriverRideReportPdfUseCase";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { calculateFareValidationSchema } from "@presentation/validationSchemas/fareValidation";
import {
  createRideValidationSchema,
  rideReportQuerySchema,
} from "@presentation/validationSchemas/rideValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class RideController {
  constructor(
    @inject("ICreateFareUseCase")
    private _createFareUseCase: ICreateFareUseCase,
    @inject("ICreateRideUseCase")
    private _createRideUseCase: ICreateRideUseCase,
    @inject("IGetRideDetailsUseCase")
    private _getRideDetailsUseCase: IGetRideDetailsUseCase,
    @inject("IActiveRideDetailsUseCase")
    private _activeRideDetailsUseCase: IActiveRideDetailsUseCase,
    @inject("IGetRideCabDetailsUseCase")
    private _getRideCabDetailsUseCase: IGetRideCabDetailsUseCase,
    @inject("IGetRiderPastTripsUseCase")
    private _getRiderPastTripsUseCase: IGetRiderPastTripsUseCase,
    @inject("IGetRiderActiveRideUseCase")
    private _getRiderActiveRideUseCase: IGetRiderActiveRideUseCase,
    @inject("IGetDriverPastTripsUseCase")
    private _getDriverPastTripsUseCase: IGetDriverPastTripsUseCase,
    @inject("ICancelRideUseCase")
    private _cancelRideUseCase: ICancelRideUseCase,
    @inject("IGetDriverRideReportUseCase")
    private _getDriverRideReportUseCase: IGetDriverRideReportUseCase,
    @inject("IGetDriverRideReportPdfUseCase")
    private _getDriverRideReportPdfUseCase: IGetDriverRideReportPdfUseCase,
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
        HTTP_STATUS_CODE.CREATED,
        Messages.FARE_CREATED_SUCCESSFULLY,
        fare,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleSearchCab(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRideValidationSchema.safeParse(req.body);

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

  async handleGetRideDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const rideId = req.params.id;

      if (!userId || !rideId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const rideDetails = await this._getRideDetailsUseCase.execute({
        rideId,
        userId,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.RIDE_DETAILS_FETCHED_SUCCESSFULLY,
        rideDetails,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetActiveRideDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const driverId = req.user.id;

      if (!driverId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const rideDetails =
        await this._activeRideDetailsUseCase.execute(driverId);

      if (!rideDetails) {
        throw new ResourceNotFoundException(
          INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
        );
      }

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.RIDE_DETAILS_FETCHED_SUCCESSFULLY,
        rideDetails,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetRideCabDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const rideId = req.params.id;

      if (!rideId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const cabDetails = await this._getRideCabDetailsUseCase.execute(rideId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        cabDetails,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetRiderPastTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const riderId = req.user.id;
      if (!riderId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const pastTripsData = await this._getRiderPastTripsUseCase.execute(
        riderId,
        page,
        limit,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        pastTripsData,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetDriverPastTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const driverId = req.user.id;
      if (!driverId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const pastTripsData = await this._getDriverPastTripsUseCase.execute(
        driverId,
        page,
        limit,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        pastTripsData,
      );
    } catch (error) {
      next(error);
    }
  }

  async getRiderActiveRide(req: Request, res: Response, next: NextFunction) {
    try {
      const riderId = req.user.id;

      if (!riderId) {
        throw new ResourceNotFoundException(
          INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND,
        );
      }

      const ride = await this._getRiderActiveRideUseCase.execute(riderId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.RIDE_DETAILS_FETCHED_SUCCESSFULLY,
        ride || undefined, // it can be null if no active ride
      );
    } catch (error) {
      next(error);
    }
  }

  async getDriverReport(req: Request, res: Response, next: NextFunction) {
    try {
      const driverId = req.user.id;
      const queryValidation = rideReportQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }
      const { status, search, dateFrom, dateTo, pageNo, limit } =
        queryValidation.data;

      const report = await this._getDriverRideReportUseCase.execute({
        driverId,
        status: status as string,
        search: search as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
        pageNo: pageNo ? parseInt(pageNo as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        report,
      );
    } catch (error) {
      next(error);
    }
  }

  async getDriverReportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const driverId = req.user.id;
      const queryValidation = rideReportQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }
      const { status, search, dateFrom, dateTo } = queryValidation.data;

      const pdfBuffer = await this._getDriverRideReportPdfUseCase.execute({
        driverId,
        status: status as string,
        search: search as string,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=driver_report.pdf",
      );
      res.status(HTTP_STATUS_CODE.OK).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}
