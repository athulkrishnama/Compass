import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetBookingByPaymentIdUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingByPaymentIdUseCase";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { Messages } from "@domain/enums/messages";
import { IGetTravelerUpcomingBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerUpcomingBookingsUseCase";
import { IGetTravelerCompletedBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerCompletedBookingsUseCase";
import { bookingListingQueryValidationSchema } from "@presentation/validationSchemas/bookingValidation";
import { InvalideDataException } from "@application/constants/Exceptions";

@injectable()
export class BookingController {
  constructor(
    @inject("IGetBookingByPaymentIdUseCase")
    private _getBookingByPaymentIdUseCase: IGetBookingByPaymentIdUseCase,
    @inject("IGetTravelerUpcomingBookingsUseCase")
    private _getTravelerUpcomingBookingsUseCase: IGetTravelerUpcomingBookingsUseCase,
    @inject("IGetTravelerCompletedBookingsUseCase")
    private _getTravelerCompletedBookingsUseCase: IGetTravelerCompletedBookingsUseCase,
  ) {}

  async getBookingByPaymentId(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      const bookingStatus =
        await this._getBookingByPaymentIdUseCase.execute(paymentId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.BOOKING_RETRIEVED_SUCCESSFULLY,
        bookingStatus,
      );
    } catch (error) {
      next(error);
    }
  }

  async getTravelerUpcomingBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = bookingListingQueryValidationSchema.safeParse(req.query);
      if (query.error) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const travelerId = req.user.id;
      const bookings = await this._getTravelerUpcomingBookingsUseCase.execute(
        travelerId,
        query.data.pageNo,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        bookings,
      );
    } catch (error) {
      next(error);
    }
  }

  async getTravelerCompletedBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = bookingListingQueryValidationSchema.safeParse(req.query);
      if (query.error) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const travelerId = req.user.id;
      const bookings = await this._getTravelerCompletedBookingsUseCase.execute(
        travelerId,
        query.data.pageNo,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        bookings,
      );
    } catch (error) {
      next(error);
    }
  }
}
