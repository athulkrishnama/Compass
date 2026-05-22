import { NotificationType } from "@domain/types/notificationType";

export interface NotificationEntity {
  _id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: Date;
}
