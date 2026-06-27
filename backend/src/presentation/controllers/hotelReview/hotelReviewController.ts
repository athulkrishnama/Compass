import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { ICreateHotelReviewUseCase } from "@application/interfaces/useCase/hotelReview/createHotelReviewUseCase.interface";
import { IGetHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getHotelReviewsUseCase.interface";
import { IGetOwnerHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getOwnerHotelReviewsUseCase.interface";
import { IGetAllHotelReviewsUseCase } from "@application/interfaces/useCase/hotelReview/getAllHotelReviewsUseCase.interface";
import { ICheckHotelReviewEligibilityUseCase } from "@application/interfaces/useCase/hotelReview/checkHotelReviewEligibilityUseCase.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { createHotelReviewValidationSchema } from "@presentation/validationSchemas/hotelReviewValidation";

@injectable()
export class HotelReviewController {
  constructor(
    @inject("ICreateHotelReviewUseCase")
    private _createHotelReviewUseCase: ICreateHotelReviewUseCase,
    @inject("IGetHotelReviewsUseCase")
    private _getHotelReviewsUseCase: IGetHotelReviewsUseCase,
    @inject("IGetOwnerHotelReviewsUseCase")
    private _getOwnerHotelReviewsUseCase: IGetOwnerHotelReviewsUseCase,
    @inject("IGetAllHotelReviewsUseCase")
    private _getAllHotelReviewsUseCase: IGetAllHotelReviewsUseCase,
    @inject("ICheckHotelReviewEligibilityUseCase")
    private _checkHotelReviewEligibilityUseCase: ICheckHotelReviewEligibilityUseCase,
  ) {}

  async handleCreateHotelReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = createHotelReviewValidationSchema.safeParse(req.body);
      if (!data.success) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createHotelReviewUseCase.execute({
        ...data.data,
        reviewerId: req.user.id,
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

  async handleGetHotelReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hotelId = req.params.hotelId;
      if (!hotelId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getHotelReviewsUseCase.execute(
        hotelId,
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

  async handleGetOwnerHotelReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getOwnerHotelReviewsUseCase.execute(
        userId,
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

  async handleGetAllHotelReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { rating, hotelId, reviewerId, search, fromDate, toDate } =
        req.query;

      const result = await this._getAllHotelReviewsUseCase.execute(
        {
          rating: rating ? parseInt(rating as string) : undefined,
          hotelId: hotelId as string | undefined,
          reviewerId: reviewerId as string | undefined,
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
      const bookingId = req.params.bookingId;
      if (!bookingId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const result = await this._checkHotelReviewEligibilityUseCase.execute(
        bookingId,
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
