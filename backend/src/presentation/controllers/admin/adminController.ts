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
import {
  hotelBookingReportQuerySchema,
  hotelBookingReportPdfQuerySchema,
} from "presentation/validationSchemas/bookingValidation";
import {
  rideReportQuerySchema,
  rideReportPdfQuerySchema,
} from "presentation/validationSchemas/rideValidation";
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
import { IGetAdminDashboardStatsUseCase } from "@application/interfaces/useCase/admin/getAdminDashboardStatsUseCase.interface";
import { IGetAdminHotelReportUseCase } from "@application/interfaces/useCase/admin/IGetAdminHotelReportUseCase";
import { IGetAdminHotelReportPdfUseCase } from "@application/interfaces/useCase/admin/IGetAdminHotelReportPdfUseCase";
import { IGetAdminCabReportUseCase } from "@application/interfaces/useCase/admin/IGetAdminCabReportUseCase";
import { IGetAdminCabReportPdfUseCase } from "@application/interfaces/useCase/admin/IGetAdminCabReportPdfUseCase";

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

    @inject("IGetAdminDashboardStatsUseCase")
    private _getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
    @inject("IGetAdminHotelReportUseCase")
    private _getAdminHotelReportUseCase: IGetAdminHotelReportUseCase,
    @inject("IGetAdminHotelReportPdfUseCase")
    private _getAdminHotelReportPdfUseCase: IGetAdminHotelReportPdfUseCase,
    @inject("IGetAdminCabReportUseCase")
    private _getAdminCabReportUseCase: IGetAdminCabReportUseCase,
    @inject("IGetAdminCabReportPdfUseCase")
    private _getAdminCabReportPdfUseCase: IGetAdminCabReportPdfUseCase,
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

  async handleGetDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const type =
        (req.query.type as "weekly" | "monthly" | "yearly") || "weekly";
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : undefined;

      const data = await this._getAdminDashboardStatsUseCase.execute({
        type,
        year,
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

  async getHotelReport(req: Request, res: Response, next: NextFunction) {
    try {
      const queryValidation = hotelBookingReportQuerySchema.safeParse(
        req.query,
      );
      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }

      const {
        status,
        search,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
        pageNo,
      } = queryValidation.data;

      const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
      const dateTo = dateToStr ? new Date(dateToStr) : undefined;

      const data = await this._getAdminHotelReportUseCase.execute({
        status,
        search,
        dateFrom,
        dateTo,
        pageNo,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        "Report fetched successfully",
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async getHotelReportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const queryValidation = hotelBookingReportPdfQuerySchema.safeParse(
        req.query,
      );
      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }

      const {
        status,
        search,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
      } = queryValidation.data;

      const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
      const dateTo = dateToStr ? new Date(dateToStr) : undefined;

      const pdfBuffer = await this._getAdminHotelReportPdfUseCase.execute({
        status,
        search,
        dateFrom,
        dateTo,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=admin_hotel_report_${new Date().toISOString()}.pdf`,
      );
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  async getCabReport(req: Request, res: Response, next: NextFunction) {
    try {
      const queryValidation = rideReportQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }

      const {
        status,
        search,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
        pageNo: pageNoStr,
        limit: limitStr,
      } = queryValidation.data;

      const pageNo = parseInt(pageNoStr || "1");
      const limit = parseInt(limitStr || "10");
      const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
      const dateTo = dateToStr ? new Date(dateToStr) : undefined;

      const data = await this._getAdminCabReportUseCase.execute({
        status,
        search,
        dateFrom,
        dateTo,
        pageNo,
        limit,
      });

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        "Report fetched successfully",
        data,
      );
    } catch (error) {
      next(error);
    }
  }

  async getCabReportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const queryValidation = rideReportPdfQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        throw new InvalideDataException(
          queryValidation.error.issues[0].message,
        );
      }

      const {
        status,
        search,
        dateFrom: dateFromStr,
        dateTo: dateToStr,
      } = queryValidation.data;

      const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
      const dateTo = dateToStr ? new Date(dateToStr) : undefined;

      const pdfBuffer = await this._getAdminCabReportPdfUseCase.execute({
        status,
        search,
        dateFrom,
        dateTo,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=admin_cab_report_${new Date().toISOString()}.pdf`,
      );
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}
