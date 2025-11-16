import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { IGetUsersUseCase } from "application/interfaces/useCase/admin/getUsersUseCase.interface";
import { IUserStatusChangeUseCase } from "application/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { ROLES } from "@domain/types/roles";
import {
  getUnverifiedUserValidationSchema,
  getUsersQueryValidationSchema,
  rejectUserVerificationRequestValidationSchema,
  userStatusChangeValidationSchema,
} from "presentation/validationSchemas/adminValidation";
import { HttpResponseMessages } from "presentation/constants/httpResponseMessages";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { InvalideDataException } from "@application/constants/Exceptions";
import { IGetUnverifiedUsersUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserUseCase.interface";
import { AuthError } from "@presentation/constants/AuthErrors";
import { IGetUnverifiedUserDetailsUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserDetailsUseCase.interface";
import { ValidationErrors } from "@presentation/constants/validationErrors";
import { IApproveUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/approveUserVerificationRequestUseCase.interface";
import { IRejectUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/rejectUserVerificationRequestUseCase.interface";
import { IRejectUserVerificationRequestRequestDTO } from "@domain/dtos/admin/rejectUserVerificationRequest.dto";

@injectable()
export class AdminController {
  constructor(
    @inject("IGetUsersUseCase") private _getUsersUseCase: IGetUsersUseCase,
    @inject("IUserStatusChangeUseCase")
    private _userStatusChangeUseCase: IUserStatusChangeUseCase,
    @inject("IGetUnverifiedUsersUseCase")
    private _getUnverifiedUsesUseCase: IGetUnverifiedUsersUseCase,
    @inject("IGetUnverifiedUserDetailsUseCase")
    private _getUnverifiedUserDetailsUseCase: IGetUnverifiedUserDetailsUseCase,
    @inject("IApproveUserVerificationRequestUseCase")
    private _approveUserVerificationRequestUseCase: IApproveUserVerificationRequestUseCase,
    @inject("IRejectUserVerificationRequestUseCase")
    private _rejectUserVerificationRequestUseCase: IRejectUserVerificationRequestUseCase,
  ) {}

  async handleGetUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getUsersQueryValidationSchema.safeParse(req.query);
      if (query.error) {
        throw new Error(query.error.issues[0].message);
      }

      const data = await this._getUsersUseCase.get({
        filter: {
          query: query.data.query,
          status: query.data.status,
          role: query.data.role as ROLES[],
        },
        page: query.data.pageNo,
      });

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.DATA_FETCHED_SUCCESSFULLY,
        data,
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleUserStatusChange(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = userStatusChangeValidationSchema.safeParse(req.body);
      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }
      await this._userStatusChangeUseCase.change(
        data.data.id,
        data.data.status,
      );

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.STATUS_UPDATED_SUCCESSFULLY,
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleGetUnverifiedUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = getUnverifiedUserValidationSchema.safeParse(req.query);

      if (query.error) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const users = await this._getUnverifiedUsesUseCase.get({
        pageNo: query.data.pageNo,
        role: query.data.role as ROLES,
        query: query.data.query,
      });

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.DATA_FETCHED_SUCCESSFULLY,
        users,
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleGetUnverifiedUserDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new InvalideDataException(AuthError.INVALID_ID);
      }

      const user = await this._getUnverifiedUserDetailsUseCase.get(id);
      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.DATA_FETCHED_SUCCESSFULLY,
        user,
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleVerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new InvalideDataException(ValidationErrors.ID_MISSING);
      }
      await this._approveUserVerificationRequestUseCase.approve(id);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.VERIFICATION_APPROVED,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleRejectUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const dto: IRejectUserVerificationRequestRequestDTO = {
        userId: id,
        reason,
      };

      const data = rejectUserVerificationRequestValidationSchema.safeParse(dto);

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._rejectUserVerificationRequestUseCase.reject(data.data);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.VERIFICATION_REJECTED,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
