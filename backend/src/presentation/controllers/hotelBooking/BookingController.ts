import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetBookingByPaymentIdUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingByPaymentIdUseCase";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { Messages } from "@domain/enums/messages";

@injectable()
export class BookingController {
  constructor(
    @inject("IGetBookingByPaymentIdUseCase")
    private _getBookingByPaymentIdUseCase: IGetBookingByPaymentIdUseCase,
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
}
