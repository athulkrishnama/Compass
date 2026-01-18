import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { inject, injectable } from "tsyringe";
import { Model, Types } from "mongoose";
import { IRoomVariantDocument } from "../database configs/schemas/roomVariantSchema";
import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";
import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

@injectable()
export class RoomVariantRepo
  extends BaseRepository<RoomVariantEntity, IRoomVariantDocument>
  implements IRoomVariantRepo
{
  constructor(
    @inject("IRoomVariantModel") protected _model: Model<IRoomVariantDocument>,
  ) {
    super(_model);
  }

  async findByHotelId(hotelId: string): Promise<RoomVariantEntity[]> {
    const roomVariants = await this._model.find({ hotelId });
    return roomVariants.map((roomVariant) => this.toEntity(roomVariant));
  }

  async findByCode(
    hotelId: string,
    code: string,
  ): Promise<RoomVariantEntity | null> {
    const roomVariant = await this._model.findOne({ hotelId, code });
    return roomVariant ? this.toEntity(roomVariant) : null;
  }

  async create(entity: RoomVariantEntity): Promise<string> {
    const doc = this.toMongoDoc(entity);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  toMongoDoc(entity: RoomVariantEntity): Partial<IRoomVariantDocument> {
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

  toEntity(doc: IRoomVariantDocument): RoomVariantEntity {
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
      status: doc.status as RoomVariantStatus,
    };
  }
}
