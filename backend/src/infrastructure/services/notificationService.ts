import { INotificationService } from "@application/interfaces/service/notificationService.interface";
import { INotificationRepo } from "@application/interfaces/repository/notification/notification.repo.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { NotificationType } from "@domain/types/notificationType";
import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { SocketEvents } from "@presentation/constants/socketEvents";
import { inject, injectable } from "tsyringe";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject("INotificationRepo")
    private _notificationRepo: INotificationRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
  ) {}

  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const notification: NotificationEntity = {
      _id: "",
      user_id: userId,
      type,
      title,
      message,
      data,
      is_read: false,
      created_at: new Date(),
    };

    const notificationId = await this._notificationRepo.create(notification);

    this._socketEmitter.emitToUser(userId, SocketEvents.NOTIFICATION_NEW, {
      _id: notificationId,
      type,
      title,
      message,
      data,
      is_read: false,
      created_at: notification.created_at,
    });
  }
}
