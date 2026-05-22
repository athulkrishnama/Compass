import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { BaseRepository } from "@infrastructure/repository/base/base.repo";
import { INotificationDocument } from "@infrastructure/repository/notification/notification.schema";

export interface INotificationRepo
  extends BaseRepository<NotificationEntity, INotificationDocument> {
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
