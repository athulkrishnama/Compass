import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { IRoomDocument } from "../database configs/schemas/roomSchema";
import { RoomEntity } from "@domain/entities/room/room.entity";
import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { RoomStatus } from "@domain/enums/roomStatus";

@injectable()
export class RoomRepo
  extends BaseRepository<RoomEntity, IRoomDocument>
  implements IRoomRepo
{
  constructor(@inject("IRoomModel") protected _model: Model<IRoomDocument>) {
    super(_model);
  }

  async findByHotelId(hotelId: string): Promise<RoomEntity[]> {
    const rooms = await this._model.find({ hotelId });
    return rooms.map((room) => this.toEntity(room));
  }

  async findByCode(hotelId: string, code: string): Promise<RoomEntity | null> {
    const room = await this._model.findOne({ hotelId, code });
    return room ? this.toEntity(room) : null;
  }

  async create(entity: RoomEntity): Promise<string> {
    const doc = this.toMongoDoc(entity);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  toMongoDoc(entity: RoomEntity): Partial<IRoomDocument> {
    return {
      _id: entity._id ? new Types.ObjectId(entity._id) : undefined,
      hotelId: new Types.ObjectId(entity.hotelId),
      name: entity.name,
      code: entity.code,
      description: entity.description,
      baseOccupancy: entity.baseOccupancy,
      maxOccupancy: entity.maxOccupancy,
      bedConfig: {
        type: entity.bedConfig.type,
        count: entity.bedConfig.count,
      },
      amenities: entity.amenities,
      policies: {
        smokingAllowed: entity.policies.smokingAllowed,
        petsAllowed: entity.policies.petsAllowed,
        checkInTime: entity.policies.checkInTime,
        checkOutTime: entity.policies.checkOutTime,
      },
      basePrice: entity.basePrice,
      coverImage: entity.coverImage,
      images: entity.images,
      status: entity.status,
    };
  }

  toEntity(doc: IRoomDocument): RoomEntity {
    return {
      _id: doc._id.toString(),
      hotelId: doc.hotelId.toString(),
      name: doc.name,
      code: doc.code,
      description: doc.description,
      baseOccupancy: doc.baseOccupancy,
      maxOccupancy: doc.maxOccupancy,
      bedConfig: {
        type: doc.bedConfig.type as BedType,
        count: doc.bedConfig.count,
      },
      amenities: doc.amenities as RoomAmenity[],
      policies: {
        smokingAllowed: doc.policies.smokingAllowed,
        petsAllowed: doc.policies.petsAllowed,
        checkInTime: doc.policies.checkInTime,
        checkOutTime: doc.policies.checkOutTime,
      },
      basePrice: doc.basePrice,
      coverImage: doc.coverImage,
      images: doc.images,
      status: doc.status as RoomStatus,
    };
  }
}
