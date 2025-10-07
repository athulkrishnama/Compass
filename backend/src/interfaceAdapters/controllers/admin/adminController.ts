import { HTTP_STATUS_CODE } from "@domain/constants/statusCodes";
import { IGetUsersUseCase } from "@domain/interfaces/useCase/admin/getUsersUseCase.interface";
import { IUserStatusChangeUseCase } from "@domain/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { ROLES } from "@domain/types/roles";
import {
  getUsersQueryValidationSchema,
  userStatusChangeValidationSchema,
} from "@infrastructure/validationSchemas/adminValidation";
import { HttpResponseMessages } from "@interfaceAdapters/constants/httpResponseMessages";
import { HTTPResponseBuilder } from "@utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AdminController {
  constructor(
    @inject("IGetUsersUseCase") private _getUsersUseCase: IGetUsersUseCase,
    @inject("IUserStatusChangeUseCase")
    private _userStatusChangeUseCase: IUserStatusChangeUseCase,
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
}
