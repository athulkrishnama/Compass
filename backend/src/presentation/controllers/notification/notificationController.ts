import { IGetNotificationsUseCase } from "@application/interfaces/useCase/notification/getNotificationsUseCase.interface";
import { IGetUnreadCountUseCase } from "@application/interfaces/useCase/notification/getUnreadCountUseCase.interface";
import { IMarkNotificationReadUseCase } from "@application/interfaces/useCase/notification/markNotificationReadUseCase.interface";
import { IMarkAllNotificationsReadUseCase } from "@application/interfaces/useCase/notification/markAllNotificationsReadUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { HTTPResponseBuilder } from "@presentation/utils/httpResponseBuilder";
import { InvalideDataException } from "@application/constants/Exceptions";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class NotificationController {
  constructor(
    @inject("IGetNotificationsUseCase")
    private _getNotificationsUseCase: IGetNotificationsUseCase,
    @inject("IGetUnreadCountUseCase")
    private _getUnreadCountUseCase: IGetUnreadCountUseCase,
    @inject("IMarkNotificationReadUseCase")
    private _markNotificationReadUseCase: IMarkNotificationReadUseCase,
    @inject("IMarkAllNotificationsReadUseCase")
    private _markAllNotificationsReadUseCase: IMarkAllNotificationsReadUseCase,
  ) {}

  async handleGetNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const notifications = await this._getNotificationsUseCase.execute(
        userId,
        page,
        limit,
      );

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.NOTIFICATIONS_FETCHED_SUCCESSFULLY,
        notifications,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleGetUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const count = await this._getUnreadCountUseCase.execute(userId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.UNREAD_COUNT_FETCHED_SUCCESSFULLY,
        { count },
      );
    } catch (error) {
      next(error);
    }
  }

  async handleMarkAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;

      if (!notificationId) {
        throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
      }

      await this._markNotificationReadUseCase.execute(notificationId, userId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.NOTIFICATION_MARKED_AS_READ,
      );
    } catch (error) {
      next(error);
    }
  }

  async handleMarkAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      await this._markAllNotificationsReadUseCase.execute(userId);

      HTTPResponseBuilder.buildSuccessResponse(
        req,
        res,
        HTTP_STATUS_CODE.OK,
        Messages.ALL_NOTIFICATIONS_MARKED_AS_READ,
      );
    } catch (error) {
      next(error);
    }
  }
}
