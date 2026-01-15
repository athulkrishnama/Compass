import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { IHotelDocument } from "../database configs/schemas/hotelSchema";
import { HotelEntity } from "@domain/entities/hotel/hotel.entity";
import { Types } from "mongoose";

@injectable()
export class HotelRepo
  extends BaseRepository<HotelEntity, IHotelDocument>
  implements IHotelRepo
{
  constructor(@inject("IHotelModel") protected _model: Model<IHotelDocument>) {
    super(_model);
  }

  async findHotelByName(name: string): Promise<HotelEntity | null> {
    const hotel = await this._model.findOne({ name });
    return hotel ? this.toEntity(hotel) : null;
  }

  async create(entity: HotelEntity): Promise<string> {
    const doc = this.toMongoDoc(entity);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  async update(entity: HotelEntity): Promise<void> {
    const doc = this.toMongoDoc(entity);
    await this._model.updateOne({ _id: entity._id }, doc);
  }

  async getHotelsByUserId(
    userId: string,
  ): Promise<{ hotels: HotelEntity[]; count: number }> {
    const hotels = await this._model.find({ userId });
    return {
      hotels: hotels.map((hotel) => this.toEntity(hotel)),
      count: hotels.length,
    };
  }

  toMongoDoc(entity: HotelEntity): IHotelDocument {
    const doc = new this._model({
      _id: new Types.ObjectId(entity._id),
      userId: new Types.ObjectId(entity.userId),
      name: entity.name,
      description: entity.description,
      coverImage: entity.coverImage,
      images: entity.images,
      address: {
        city: entity.address.city,
        country: entity.address.country,
        landMark: entity.address.landMark,
        pinCode: entity.address.pinCode,
        coordinates: {
          type: "Point",
          coordinates: entity.address.coordinates,
        },
      },
    });
    return doc;
  }

  toEntity(doc: IHotelDocument): HotelEntity {
    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      name: doc.name,
      description: doc.description,
      coverImage: doc.coverImage,
      images: doc.images,
      address: {
        city: doc.address.city,
        country: doc.address.country,
        landMark: doc.address.landMark,
        pinCode: doc.address.pinCode,
        coordinates: [
          doc.address.coordinates.coordinates[0],
          doc.address.coordinates.coordinates[1],
        ],
      },
    };
  }
}
