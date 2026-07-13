import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetBookingByPaymentIdUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingByPaymentIdUseCase";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { Messages } from "@domain/enums/messages";
import { IGetTravelerUpcomingBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerUpcomingBookingsUseCase";
import { IGetTravelerCompletedBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerCompletedBookingsUseCase";
import { IGetTravelerOngoingBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetTravelerOngoingBookingsUseCase";
import { IGetBookingDetailsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingDetailsUseCase";
import { ICancelBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICancelBookingUseCase";
import { IGetOverallDashboardUseCase } from "@application/interfaces/useCase/hotelBooking/IGetOverallDashboardUseCase";
import { IGetHotelDashboardUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelDashboardUseCase";
import { IGetHotelBookingsUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelBookingsUseCase";
import { IGetAvailableRoomsForCheckInUseCase } from "@application/interfaces/useCase/hotelBooking/IGetAvailableRoomsForCheckInUseCase";
import { ICheckInBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICheckInBookingUseCase";
import { ICheckOutBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICheckOutBookingUseCase";
import {
  bookingListingQueryValidationSchema,
  hotelBookingQueryValidationSchema,
  checkInParamsValidationSchema,
  checkInBodyValidationSchema,
  checkOutParamsValidationSchema,
} from "@presentation/validationSchemas/bookingValidation";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class BookingController {
  constructor(
    @inject("IGetBookingByPaymentIdUseCase")
    private _getBookingByPaymentIdUseCase: IGetBookingByPaymentIdUseCase,
    @inject("IGetTravelerUpcomingBookingsUseCase")
    private _getTravelerUpcomingBookingsUseCase: IGetTravelerUpcomingBookingsUseCase,
    @inject("IGetTravelerOngoingBookingsUseCase")
    private _getTravelerOngoingBookingsUseCase: IGetTravelerOngoingBookingsUseCase,
    @inject("IGetTravelerCompletedBookingsUseCase")
    private _getTravelerCompletedBookingsUseCase: IGetTravelerCompletedBookingsUseCase,
    @inject("IGetBookingDetailsUseCase")
    private _getBookingDetailsUseCase: IGetBookingDetailsUseCase,
    @inject("ICancelBookingUseCase")
    private _cancelBookingUseCase: ICancelBookingUseCase,
    @inject("IGetOverallDashboardUseCase")
    private _getOverallDashboardUseCase: IGetOverallDashboardUseCase,
    @inject("IGetHotelDashboardUseCase")
    private _getHotelDashboardUseCase: IGetHotelDashboardUseCase,
    @inject("IGetHotelBookingsUseCase")
    private _getHotelBookingsUseCase: IGetHotelBookingsUseCase,
    @inject("IGetAvailableRoomsForCheckInUseCase")
    private _getAvailableRoomsForCheckInUseCase: IGetAvailableRoomsForCheckInUseCase,
    @inject("ICheckInBookingUseCase")
    private _checkInBookingUseCase: ICheckInBookingUseCase,
    @inject("ICheckOutBookingUseCase")
    private _checkOutBookingUseCase: ICheckOutBookingUseCase,
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

  async getTravelerOngoingBookings(
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
      const bookings = await this._getTravelerOngoingBookingsUseCase.execute(
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

  async getBookingDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const travelerId = req.user?.id;
      if (!bookingId || !travelerId) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.BOOKING_ID_REQUIRED,
        );
      }

      const bookingDetails = await this._getBookingDetailsUseCase.execute(
        bookingId,
        travelerId,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.BOOKING_DETAILS_FETCHED,
        bookingDetails,
      );
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId } = req.params;
      const travelerId = req.user?.id;
      if (!bookingId || !travelerId) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.BOOKING_ID_REQUIRED,
        );
      }

      const result = await this._cancelBookingUseCase.execute(
        bookingId,
        travelerId,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.BOOKING_CANCELLED_SUCCESSFULLY,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async getOverallDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const type = (req.query.type as string) || "weekly";
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : undefined;
      const month = req.query.month
        ? parseInt(req.query.month as string)
        : undefined;

      const filter = {
        type: type as "weekly" | "monthly" | "yearly",
        year,
        month,
      };

      const data = await this._getOverallDashboardUseCase.execute(
        userId,
        filter,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DASHBOARD_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async getHotelDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { hotelId } = req.params;
      if (!hotelId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
      }

      const data = await this._getHotelDashboardUseCase.execute(
        userId,
        hotelId,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DASHBOARD_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async getHotelBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotelId } = req.params;
      if (!hotelId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
      }

      const query = hotelBookingQueryValidationSchema.safeParse(req.query);
      if (query.error) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const userId = req.user.id;
      const data = await this._getHotelBookingsUseCase.execute(
        userId,
        hotelId,
        query.data.roomVariantId,
        query.data.status,
        query.data.search,
        query.data.pageNo,
      );

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

  async getAvailableRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = checkInParamsValidationSchema.safeParse(req.params);

      if (!validation.success) {
        throw new InvalideDataException(validation.error.issues[0].message);
      }

      const { bookingId, hotelId } = validation.data;

      const result = await this._getAvailableRoomsForCheckInUseCase.execute(
        bookingId,
        hotelId,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.AVAILABLE_ROOMS_FETCHED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req: Request, res: Response, next: NextFunction) {
    try {
      const paramsValidation = checkInParamsValidationSchema.safeParse(
        req.params,
      );
      const bodyValidation = checkInBodyValidationSchema.safeParse(req.body);

      if (!paramsValidation.success) {
        throw new InvalideDataException(
          paramsValidation.error.issues[0].message,
        );
      }

      if (!bodyValidation.success) {
        throw new InvalideDataException(bodyValidation.error.issues[0].message);
      }

      const { bookingId, hotelId } = paramsValidation.data;
      const { roomNumber } = bodyValidation.data;

      await this._checkInBookingUseCase.execute(bookingId, hotelId, roomNumber);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.CHECKED_IN_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  async checkOut(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = checkOutParamsValidationSchema.safeParse(req.params);

      if (!validation.success) {
        throw new InvalideDataException(validation.error.issues[0].message);
      }

      const { bookingId, hotelId } = validation.data;

      await this._checkOutBookingUseCase.execute(bookingId, hotelId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.CHECKED_OUT_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }
}
