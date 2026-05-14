import { NotificationType } from "@domain/types/notificationType";

export interface INotificationService {
  notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, unknown>,
  ): Promise<void>;
}
