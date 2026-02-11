import { RoomStatusEntity } from "@domain/entities/roomStatus/roomStatus.entity";
import { BaseRepository } from "../base/base.repo";
import { IRoomStatusDocument } from "./roomStatusSchema";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";

@injectable()
export class RoomStatusRepo
  extends BaseRepository<RoomStatusEntity, IRoomStatusDocument>
  implements IRoomStatusRepo
{
  constructor(
    @inject("IRoomStatusModel") protected model: Model<IRoomStatusDocument>,
  ) {
    super(model);
  }

  toEntity(document: IRoomStatusDocument): RoomStatusEntity {
    return {
      _id: document._id.toString(),
      roomVariantId: document.roomVariantId,
      roomNumber: document.roomNumber,
      status: document.status,
      reason: document.reason,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async findByRoomVariantId(
    roomVariantId: string,
  ): Promise<RoomStatusEntity[]> {
    const documents = await this.model.find({ roomVariantId });
    return documents.map((document: IRoomStatusDocument) =>
      this.toEntity(document),
    );
  }

  async findByRoomVariantIdAndRoomNumber(
    roomVariantId: string,
    roomNumber: number,
  ): Promise<RoomStatusEntity | null> {
    const document = await this.model.findOne({
      roomVariantId,
      roomNumber,
    });
    return document ? this.toEntity(document) : null;
  }
}
