import { IMarkNotificationReadUseCase } from "@application/interfaces/useCase/notification/markNotificationReadUseCase.interface";
import { INotificationRepo } from "@application/interfaces/repository/notification/notification.repo.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class MarkNotificationReadUseCase
  implements IMarkNotificationReadUseCase
{
  constructor(
    @inject("INotificationRepo")
    private _notificationRepo: INotificationRepo,
  ) {}

  async execute(notificationId: string): Promise<void> {
    await this._notificationRepo.markAsRead(notificationId);
  }
}
