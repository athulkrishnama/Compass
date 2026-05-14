import { IMarkAllNotificationsReadUseCase } from "@application/interfaces/useCase/notification/markAllNotificationsReadUseCase.interface";
import { INotificationRepo } from "@application/interfaces/repository/notification/notification.repo.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class MarkAllNotificationsReadUseCase
  implements IMarkAllNotificationsReadUseCase
{
  constructor(
    @inject("INotificationRepo")
    private _notificationRepo: INotificationRepo,
  ) {}

  async execute(userId: string): Promise<void> {
    await this._notificationRepo.markAllAsRead(userId);
  }
}
