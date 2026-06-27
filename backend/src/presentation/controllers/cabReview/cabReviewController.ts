import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { ICreateCabReviewUseCase } from "@application/interfaces/useCase/cabReview/createCabReviewUseCase.interface";
import { IGetDriverReviewsUseCase } from "@application/interfaces/useCase/cabReview/getDriverReviewsUseCase.interface";
import { IGetAllCabReviewsUseCase } from "@application/interfaces/useCase/cabReview/getAllCabReviewsUseCase.interface";
import { ICheckCabReviewEligibilityUseCase } from "@application/interfaces/useCase/cabReview/checkCabReviewEligibilityUseCase.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { createCabReviewValidationSchema } from "@presentation/validationSchemas/cabReviewValidation";

@injectable()
export class CabReviewController {
  constructor(
    @inject("ICreateCabReviewUseCase")
    private _createCabReviewUseCase: ICreateCabReviewUseCase,
    @inject("IGetDriverReviewsUseCase")
    private _getDriverReviewsUseCase: IGetDriverReviewsUseCase,
    @inject("IGetAllCabReviewsUseCase")
    private _getAllCabReviewsUseCase: IGetAllCabReviewsUseCase,
    @inject("ICheckCabReviewEligibilityUseCase")
    private _checkCabReviewEligibilityUseCase: ICheckCabReviewEligibilityUseCase,
  ) {}

  async handleCreateCabReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = createCabReviewValidationSchema.safeParse(req.body);
      if (!data.success) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createCabReviewUseCase.execute({
        ...data.data,
        riderId: req.user.id,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.CREATED,
        Messages.REVIEW_CREATED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetDriverReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getDriverReviewsUseCase.execute(
        driverId,
        page,
        limit,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetAllCabReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { rating, driverId, riderId, search, fromDate, toDate } = req.query;

      const result = await this._getAllCabReviewsUseCase.execute(
        {
          rating: rating ? parseInt(rating as string) : undefined,
          driverId: driverId as string | undefined,
          riderId: riderId as string | undefined,
          search: search as string | undefined,
          fromDate: fromDate ? new Date(fromDate as string) : undefined,
          toDate: toDate ? new Date(toDate as string) : undefined,
        },
        page,
        limit,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCheckEligibility(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rideId = req.params.rideId;
      if (!rideId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const result = await this._checkCabReviewEligibilityUseCase.execute(
        rideId,
        req.user.id,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  }
}
