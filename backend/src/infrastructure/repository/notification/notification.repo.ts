import { NotificationEntity } from "@domain/entities/notification/notification.entity";
import { BaseRepository } from "../base/base.repo";
import { INotificationDocument } from "./notification.schema";
import { INotificationRepo } from "@application/interfaces/repository/notification/notification.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";

@injectable()
export class NotificationRepo
  extends BaseRepository<NotificationEntity, INotificationDocument>
  implements INotificationRepo
{
  constructor(
    @inject("INotificationModel") model: Model<INotificationDocument>,
  ) {
    super(model);
  }

  async findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NotificationEntity[]> {
    const skip = (page - 1) * limit;
    const docs = await this._model
      .find({ user_id: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    return docs.map((doc) => this.toEntity(doc));
  }

  async countUnread(userId: string): Promise<number> {
    return this._model.countDocuments({
      user_id: new Types.ObjectId(userId),
      is_read: false,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this._model.findByIdAndUpdate(notificationId, {
      $set: { is_read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this._model.updateMany(
      { user_id: new Types.ObjectId(userId), is_read: false },
      { $set: { is_read: true } },
    );
  }

  toEntity(doc: INotificationDocument): NotificationEntity {
    return {
      _id: doc._id.toString(),
      user_id: doc.user_id.toString(),
      type: doc.type,
      title: doc.title,
      message: doc.message,
      data: doc.data,
      is_read: doc.is_read,
      created_at: doc.created_at,
    };
  }
}
