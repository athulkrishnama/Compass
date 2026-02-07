import { InvalideDataException } from "@application/constants/Exceptions";
import { ICreatePaymentIntentUseCase } from "@application/interfaces/useCase/payment/createPaymentIntentUseCase.interface";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { createIndentSchema } from "@presentation/validationSchemas/paymentValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentController {
  constructor(
    @inject("ICreatePaymentIntentUseCase")
    private _createPaymentIntentUseCase: ICreatePaymentIntentUseCase,
  ) {}

  async handleCreatePaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = createIndentSchema.safeParse({
        ...req.body,
        traverlerId: req.user.id,
      });
      if (!validation.success) {
        throw new InvalideDataException(validation.error.issues[0].message);
      }

      const paymentIntent = await this._createPaymentIntentUseCase.execute(
        validation.data,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.PAYMENT_INTENT_CREATED,
        paymentIntent,
      );
    } catch (error) {
      next(error);
    }
  }
}
