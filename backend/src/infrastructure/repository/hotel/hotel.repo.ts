import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { BaseRepository } from "../base/base.repo";
import { inject, injectable } from "tsyringe";
import { Model, PipelineStage, RootFilterQuery } from "mongoose";
import { IHotelDocument } from "./hotelSchema";
import { HotelEntity } from "@domain/entities/hotel/hotel.entity";
import { Types } from "mongoose";
import { IHotelWithAggregatedRoomVariantDTO } from "@domain/dtos/hotel/hotelSearch.dto";
import { IRoomVariantDocument } from "../roomVariant/roomVariantSchema";
import { VALUES } from "@presentation/constants/values";

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

  async hotelSearch(filter: {
    queryString?: string;
    city?: [number, number];
    proximityRadius?: number;
    checkInDate?: Date;
    checkOutDate?: Date;
    guests?: number;
    maxPrice?: number;
    minPrice?: number;
    pageNo: number;
  }): Promise<IHotelWithAggregatedRoomVariantDTO> {
    const query: RootFilterQuery<IHotelDocument> = {};

    if (filter.queryString) {
      query.$or = [
        { name: { $regex: filter.queryString, $options: "i" } },
        { description: { $regex: filter.queryString, $options: "i" } },
        { "address.city": { $regex: filter.queryString, $options: "i" } },
        { "address.country": { $regex: filter.queryString, $options: "i" } },
        { "address.landMark": { $regex: filter.queryString, $options: "i" } },
      ];
    }

    const aggregationPipeline: PipelineStage[] = [];

    if (filter.city && filter.proximityRadius) {
      aggregationPipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [filter.city[1], filter.city[0]],
          },
          distanceField: "distance",
          maxDistance: filter.proximityRadius * 1000,
          query: query,
          spherical: true,
          key: "address.coordinates",
        },
      });
    } else {
      aggregationPipeline.push({ $match: query });
    }

    const roomVariantMatch: RootFilterQuery<IRoomVariantDocument> = {
      isActive: true,
    };
    if (filter.guests) {
      roomVariantMatch.maxOccupancy = { $gte: filter.guests };
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      roomVariantMatch.basePrice = {};
      if (filter.minPrice !== undefined) {
        roomVariantMatch.basePrice.$gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        roomVariantMatch.basePrice.$lte = filter.maxPrice;
      }
    }

    aggregationPipeline.push({
      $lookup: {
        from: "roomvariants",
        let: { hotelId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$hotelId", "$$hotelId"] },
              ...roomVariantMatch,
            },
          },
        ],
        as: "roomVariant",
      },
    });

    aggregationPipeline.push({
      $match: { "roomVariant.0": { $exists: true } },
    });

    aggregationPipeline.push({
      $skip: (filter.pageNo - 1) * VALUES.HOTELS_LIMIT,
    });

    aggregationPipeline.push({
      $limit: VALUES.HOTELS_LIMIT,
    });

    const result = await this._model.aggregate(aggregationPipeline);
    return {
      hotels: result.map((hotel) =>
        this.toEntityFromHotelWithAggregatedRoomVariant(hotel),
      ),
    };
  }

  toEntityFromHotelWithAggregatedRoomVariant(
    doc: IHotelDocument & { roomVariant: IRoomVariantDocument[] },
  ): IHotelWithAggregatedRoomVariantDTO["hotels"][number] {
    return {
      ...this.toEntity(doc),
      roomVariants:
        doc.roomVariant?.map((roomVariant: IRoomVariantDocument) => ({
          _id: roomVariant._id.toString(),
          hotelId: roomVariant.hotelId.toString(),
          roomPrefix: roomVariant.roomPrefix,
          description: roomVariant.description,
          bedConfig: roomVariant.bedConfig,
          amenities: roomVariant.amenities,
          basePrice: roomVariant.basePrice,
          images: roomVariant.images,
          policies: roomVariant.policies,
          name: roomVariant.name,
          price: roomVariant.basePrice,
          maxOccupancy: roomVariant.maxOccupancy,
          coverImage: roomVariant.coverImage,
          totalRooms: roomVariant.totalRooms,
          isActive: roomVariant.isActive,
        })) || [],
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
      averageRating: doc.averageRating,
      totalReviews: doc.totalReviews,
    };
  }

  async countHotels(): Promise<number> {
    return await this._model.countDocuments();
  }

  async updateRating(
    hotelId: string,
    averageRating: number,
    totalReviews: number,
  ): Promise<void> {
    await this._model.findByIdAndUpdate(hotelId, {
      $set: { averageRating, totalReviews },
    });
  }
}
