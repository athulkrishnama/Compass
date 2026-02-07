import { InvalideDataException } from "@application/constants/Exceptions";
import { IVerifyPaymentUseCase } from "@application/interfaces/useCase/payment/verifyPaymentUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class WebHookController {
  constructor(
    @inject("IVerifyPaymentUseCase")
    private _verifyPaymentUseCase: IVerifyPaymentUseCase,
  ) {}

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.INVALID_SIGNATURE,
        );
      }

      const event = await this._verifyPaymentUseCase.execute({
        signature: signature as string,
        body: req.body,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.PAYMENT_INTENT_CREATED,
        { event },
      );
    } catch (error) {
      next(error);
    }
  }
}
