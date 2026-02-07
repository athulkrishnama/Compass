import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { IRoomDocument } from "./roomSchema";
import { RoomEntity } from "@domain/entities/room/roomEntity";
import { Model, Types } from "mongoose";
import { inject, injectable } from "tsyringe";

@injectable()
export class RoomRepo
  extends BaseRepository<RoomEntity, IRoomDocument>
  implements IRoomRepo
{
  constructor(@inject("IRoomModel") protected _model: Model<IRoomDocument>) {
    super(_model);
  }

  toMongoDoc(entity: RoomEntity): IRoomDocument {
    const doc = new this._model();
    doc._id = new Types.ObjectId(entity._id);
    doc.hotelId = entity.hotelId;
    doc.variantId = entity.variantId;
    doc.roomCode = entity.roomCode;
    doc.floor = entity.floor;
    doc.status = entity.status;
    doc.createdAt = entity.createdAt;
    doc.updatedAt = entity.updatedAt;
    return doc;
  }

  toEntity(doc: IRoomDocument): RoomEntity {
    return {
      _id: doc._id.toString()!,
      hotelId: doc.hotelId,
      variantId: doc.variantId,
      roomCode: doc.roomCode,
      floor: doc.floor,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByVariantId(variantId: string): Promise<RoomEntity[]> {
    const rooms = await this._model.find({ variantId });
    return rooms.map((room) => this.toEntity(room));
  }

  async findRoomByVariantAndCode(
    variantId: string,
    roomCode: string,
  ): Promise<RoomEntity | null> {
    const room = await this._model.findOne({ variantId, roomCode });
    return room ? this.toEntity(room) : null;
  }

  async countRoomByVariantId(variantId: string): Promise<number> {
    const count = await this._model.countDocuments({ variantId });
    return count;
  }
}
