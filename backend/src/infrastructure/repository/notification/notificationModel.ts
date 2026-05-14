import { model } from "mongoose";
import {
  INotificationDocument,
  notificationSchema,
} from "./notification.schema";

export const notificationModel = model<INotificationDocument>(
  "Notification",
  notificationSchema,
);
