import { IGetNotificationsUseCase } from "@application/interfaces/useCase/notification/getNotificationsUseCase.interface";
import { INotificationRepo } from "@application/interfaces/repository/notification/notification.repo.interface";
import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetNotificationsUseCase implements IGetNotificationsUseCase {
  constructor(
    @inject("INotificationRepo")
    private _notificationRepo: INotificationRepo,
  ) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]> {
    return this._notificationRepo.findByUserId(userId, page, limit);
  }
}
