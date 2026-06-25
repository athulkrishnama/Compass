import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface INotificationRepo extends IBaseRepository<NotificationEntity> {
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]>;
  countUnread(userId: string): Promise<number>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
