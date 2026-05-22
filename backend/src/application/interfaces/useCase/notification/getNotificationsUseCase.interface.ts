import { NotificationEntity } from "@domain/entities/notification/notification.entity";

export interface IGetNotificationsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]>;
}
