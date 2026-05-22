import { IGetUnreadCountUseCase } from "@application/interfaces/useCase/notification/getUnreadCountUseCase.interface";
import { INotificationRepo } from "@application/interfaces/repository/notification/notification.repo.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
  constructor(
    @inject("INotificationRepo")
    private _notificationRepo: INotificationRepo,
  ) {}

  async execute(userId: string): Promise<number> {
    return this._notificationRepo.countUnread(userId);
  }
}
