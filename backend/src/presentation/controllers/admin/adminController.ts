import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { IGetUsersUseCase } from "application/interfaces/useCase/admin/getUsersUseCase.interface";
import { IUserStatusChangeUseCase } from "application/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { ROLES } from "@domain/types/roles";
import {
  addDestinationValidationSchema,
  getUnverifiedUserValidationSchema,
  getUsersQueryValidationSchema,
  rejectUserVerificationRequestValidationSchema,
  userStatusChangeValidationSchema,
} from "presentation/validationSchemas/adminValidation";
import { Messages } from "@domain/enums/messages";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { InvalideDataException } from "@application/constants/Exceptions";
import { IGetUnverifiedUsersUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserUseCase.interface";
import { IGetUnverifiedUserDetailsUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserDetailsUseCase.interface";
import { IApproveUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/approveUserVerificationRequestUseCase.interface";
import { IRejectUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/rejectUserVerificationRequestUseCase.interface";
import { IRejectUserVerificationRequestRequestDTO } from "@domain/dtos/admin/rejectUserVerificationRequest.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { ICreateDestinationUseCase } from "@application/interfaces/useCase/admin/createDestinationUseCase.interface";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";
import { MulterFiles } from "@presentation/types/multerFilesType";

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
    @inject("ICreateDestinationUseCase")
    private _createDestinationUseCase: ICreateDestinationUseCase,
  ) {}

  async handleGetUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getUsersQueryValidationSchema.safeParse(req.query);
      if (query.error) {
        throw new InvalideDataException(query.error.issues[0].message);
      }

      const data = await this._getUsersUseCase.get({
        filter: {
          query: query.data.query,
          status: query.data.status,
          role: query.data.role as ROLES[],
        },
        page: query.data.pageNo,
      });

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

  async handleUserStatusChange(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = userStatusChangeValidationSchema.safeParse(req.body);
      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }
      await this._userStatusChangeUseCase.change(
        data.data.id,
        data.data.status,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.STATUS_UPDATED_SUCCESSFULLY,
      );
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

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        users,
      );
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
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      const user = await this._getUnverifiedUserDetailsUseCase.get(id);
      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DATA_FETCHED_SUCCESSFULLY,
        user,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleVerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.ID_MISSING);
      }
      await this._approveUserVerificationRequestUseCase.approve(id);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.VERIFICATION_APPROVED,
      );
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

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.VERIFICATION_REJECTED,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCreateDestination(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const files = req.files as MulterFiles<"images" | "coverImage">;
      const images = files.images?.map((img) =>
        mutlterFileToFileconverter(img),
      );

      const coverImage = mutlterFileToFileconverter(files.coverImage![0]);

      const data = addDestinationValidationSchema.safeParse({
        ...req.body,
        images,
        coverImage,
      });

      if (data.error) {
        throw new InvalideDataException(data.error.issues[0].message);
      }

      await this._createDestinationUseCase.create(data.data);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.DESTINATION_ADDED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }
}
