import { InvalideDataException } from "@application/constants/Exceptions";
import { ICreatePaymentIntentUseCase } from "@application/interfaces/useCase/payment/createPaymentIntentUseCase.interface";
import { IInitiateCabPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IInitiateCabPaymentUseCase";
import { IProcessWalletCabPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IProcessWalletCabPaymentUseCase";
import { IRecordCashPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IRecordCashPaymentUseCase";
import { IGetCabPaymentStatusUseCase } from "@application/interfaces/useCase/cabPayment/IGetCabPaymentStatusUseCase";
import { Messages } from "@domain/enums/messages";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import {
  createIndentSchema,
  initiateCabPaymentSchema,
  recordCashPaymentSchema,
} from "@presentation/validationSchemas/paymentValidation";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaymentController {
  constructor(
    @inject("ICreatePaymentIntentUseCase")
    private _createPaymentIntentUseCase: ICreatePaymentIntentUseCase,
    @inject("IInitiateCabPaymentUseCase")
    private _initiateCabPaymentUseCase: IInitiateCabPaymentUseCase,
    @inject("IProcessWalletCabPaymentUseCase")
    private _processWalletCabPaymentUseCase: IProcessWalletCabPaymentUseCase,
    @inject("IRecordCashPaymentUseCase")
    private _recordCashPaymentUseCase: IRecordCashPaymentUseCase,
    @inject("IGetCabPaymentStatusUseCase")
    private _getCabPaymentStatusUseCase: IGetCabPaymentStatusUseCase,
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

  async handleInitiateCabPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = initiateCabPaymentSchema.safeParse({
        ...req.body,
        riderId: req.user.id,
      });
      if (!validation.success) {
        throw new InvalideDataException(validation.error.issues[0].message);
      }

      const result = await this._initiateCabPaymentUseCase.execute({
        tripId: validation.data.tripId,
        riderId: req.user.id,
        paymentMethod: validation.data.paymentMethod,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.PAYMENT_INITIATED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleProcessWalletCabPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { tripId } = req.body;
      if (!tripId) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.TRIP_ID_REQUIRED,
        );
      }

      await this._processWalletCabPaymentUseCase.execute(tripId, req.user.id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.PAYMENT_SUCCESSFUL,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleRecordCashPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validation = recordCashPaymentSchema.safeParse(req.body);
      if (!validation.success) {
        throw new InvalideDataException(validation.error.issues[0].message);
      }

      const result = await this._recordCashPaymentUseCase.execute({
        tripId: validation.data.tripId,
        driverId: req.user.id,
        amountReceived: validation.data.amountReceived,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.CASH_PAYMENT_RECORDED,
        result,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetCabPaymentStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { tripId } = req.params;
      if (!tripId) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.TRIP_ID_REQUIRED,
        );
      }

      const status = await this._getCabPaymentStatusUseCase.execute(tripId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.CAB_PAYMENT_STATUS_FETCHED,
        status,
      );
    } catch (error) {
      next(error);
    }
  }
}
