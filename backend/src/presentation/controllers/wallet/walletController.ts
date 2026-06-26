import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGetWalletSummaryUseCase } from "@application/interfaces/useCase/wallet/IGetWalletSummaryUseCase";
import { IGetWalletTransactionsUseCase } from "@application/interfaces/useCase/wallet/IGetWalletTransactionsUseCase";
import { ITopUpWalletUseCase } from "@application/interfaces/useCase/wallet/ITopUpWalletUseCase";
import { IGetAllTransactionsUseCase } from "@application/interfaces/useCase/transaction/IGetAllTransactionsUseCase";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { Messages } from "@domain/enums/messages";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import {
  walletTransactionsQueryValidationSchema,
  adminTransactionsQueryValidationSchema,
} from "@presentation/validationSchemas/walletValidation";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { ROLES } from "@domain/enums/roles";

@injectable()
export class WalletController {
  constructor(
    @inject("IGetWalletSummaryUseCase")
    private _getWalletSummaryUseCase: IGetWalletSummaryUseCase,
    @inject("IGetWalletTransactionsUseCase")
    private _getWalletTransactionsUseCase: IGetWalletTransactionsUseCase,
    @inject("IGetAllTransactionsUseCase")
    private _getAllTransactionsUseCase: IGetAllTransactionsUseCase,
    @inject("ITopUpWalletUseCase")
    private _topUpWalletUseCase: ITopUpWalletUseCase,
  ) {}

  private _getOwnerTypeFromRole(role?: string): SERVICE_TYPE {
    switch (role) {
      case ROLES.TRAVELER:
        return SERVICE_TYPE.USER;
      case ROLES.CAB:
        return SERVICE_TYPE.CAB;
      case ROLES.HOTEL:
        return SERVICE_TYPE.HOTEL;
      case ROLES.ADMIN:
        return SERVICE_TYPE.ADMIN;
      default:
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ROLE);
    }
  }

  async getWalletSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId || !role) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const ownerType = this._getOwnerTypeFromRole(role);
      const data = await this._getWalletSummaryUseCase.execute(
        userId,
        ownerType,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.WALLET_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async getWalletTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId || !role) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const queryValidation = walletTransactionsQueryValidationSchema.safeParse(
        req.query,
      );

      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }

      const ownerType = this._getOwnerTypeFromRole(role);
      const data = await this._getWalletTransactionsUseCase.execute(
        userId,
        ownerType,
        queryValidation.data,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.TRANSACTIONS_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async getAdminTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const queryValidation = adminTransactionsQueryValidationSchema.safeParse(
        req.query,
      );

      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }

      const data = await this._getAllTransactionsUseCase.execute(
        queryValidation.data,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.TRANSACTIONS_FETCHED_SUCCESSFULLY,
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async topUpWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { amount } = req.body;

      if (!userId || !amount) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
      }

      const paymentIntent = await this._topUpWalletUseCase.execute(
        userId,
        amount,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        "Top-up payment intent created",
        paymentIntent,
      );
    } catch (error) {
      next(error);
    }
  }
}
