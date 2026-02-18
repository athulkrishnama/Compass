import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { BaseRepository } from "../base/base.repo";
import { IHotelBookingDocument } from "./hotelBookingSchema";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { inject, injectable } from "tsyringe";
import { Model, PipelineStage, RootFilterQuery, Types } from "mongoose";
import { IBookingWithHotelAggregation } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";
import { VALUES } from "@presentation/constants/values";
import { IHotelDocument } from "../hotel/hotelSchema";
import { IRoomVariantDocument } from "../roomVariant/roomVariantSchema";
import { IBookingDetailsAggregation } from "@domain/dtos/hotelBooking/bookingDetails.dto";

@injectable()
export class HotelBookingRepo
  extends BaseRepository<HotelBookingEntity, IHotelBookingDocument>
  implements IHotelBookingRepo
{
  constructor(
    @inject("IHotelBookingModel") model: Model<IHotelBookingDocument>,
  ) {
    super(model);
  }

  async filterBooking(filter: {
    travelerId?: string;
    hotelId?: string;
    roomVariantId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentStatus?: PAYMENT_STATUS;
    bookingStatus?: BOOKING_STATUS;
    isWalkIn?: boolean;
    paymentIntendId?: string;
  }): Promise<HotelBookingEntity[]> {
    const filterQuery: RootFilterQuery<IHotelBookingDocument> = {};

    if (filter.travelerId) {
      filterQuery.travelerId = filter.travelerId;
    }
    if (filter.hotelId) {
      filterQuery.hotelId = filter.hotelId;
    }
    if (filter.roomVariantId) {
      filterQuery.roomVariantId = filter.roomVariantId;
    }
    if (filter.checkinDate) {
      filterQuery.checkinDate = filter.checkinDate;
    }
    if (filter.checkoutDate) {
      filterQuery.checkoutDate = filter.checkoutDate;
    }
    if (filter.afterCheckInDate) {
      filterQuery.checkinDate = {
        $gte: filter.afterCheckInDate,
      };
    }
    if (filter.beforeCheckOutDate) {
      filterQuery.checkoutDate = {
        $lte: filter.beforeCheckOutDate,
      };
    }
    if (filter.afterCheckOutDate) {
      filterQuery.checkoutDate = {
        $gte: filter.afterCheckOutDate,
      };
    }
    if (filter.beforeCheckInDate) {
      filterQuery.checkinDate = {
        $lte: filter.beforeCheckInDate,
      };
    }
    if (filter.paymentStatus) {
      filterQuery.paymentStatus = filter.paymentStatus;
    }
    if (filter.bookingStatus) {
      filterQuery.bookingStatus = filter.bookingStatus;
    }
    if (filter.isWalkIn !== undefined) {
      filterQuery.isWalkIn = filter.isWalkIn;
    }
    if (filter.paymentIntendId) {
      filterQuery.paymentIntendId = filter.paymentIntendId;
    }
    const result = await this._model.find(filterQuery).exec();
    return result.map((doc) => this.toEntity(doc));
  }

  async countBooking(filter: {
    travelerId?: string;
    hotelId?: string;
    roomVariantId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentStatus?: PAYMENT_STATUS;
    bookingStatus?: BOOKING_STATUS;
    isWalkIn?: boolean;
    paymentIntendId?: string;
  }): Promise<number> {
    const filterQuery: RootFilterQuery<IHotelBookingDocument> = {};

    if (filter.travelerId) {
      filterQuery.travelerId = filter.travelerId;
    }
    if (filter.hotelId) {
      filterQuery.hotelId = filter.hotelId;
    }
    if (filter.roomVariantId) {
      filterQuery.roomVariantId = filter.roomVariantId;
    }
    if (filter.checkinDate) {
      filterQuery.checkinDate = filter.checkinDate;
    }
    if (filter.checkoutDate) {
      filterQuery.checkoutDate = filter.checkoutDate;
    }
    if (filter.afterCheckInDate) {
      filterQuery.checkinDate = {
        $gte: filter.afterCheckInDate,
      };
    }
    if (filter.beforeCheckOutDate) {
      filterQuery.checkoutDate = {
        $lte: filter.beforeCheckOutDate,
      };
    }
    if (filter.afterCheckOutDate) {
      filterQuery.checkoutDate = {
        $gte: filter.afterCheckOutDate,
      };
    }
    if (filter.beforeCheckInDate) {
      filterQuery.checkinDate = {
        $lte: filter.beforeCheckInDate,
      };
    }
    if (filter.paymentStatus) {
      filterQuery.paymentStatus = filter.paymentStatus;
    }
    if (filter.bookingStatus) {
      filterQuery.bookingStatus = filter.bookingStatus;
    }
    if (filter.isWalkIn !== undefined) {
      filterQuery.isWalkIn = filter.isWalkIn;
    }
    if (filter.paymentIntendId) {
      filterQuery.paymentIntendId = filter.paymentIntendId;
    }
    const result = await this._model.countDocuments(filterQuery).exec();
    return result;
  }

  async countMonthWise(filter: {
    travelerId: string;
    hotelId: string;
    date: Date;
  }): Promise<number> {
    filter.date.setDate(filter.date.getDate() - 30);
    const count = await this._model
      .find({
        travelerId: filter.travelerId,
        hotelId: filter.hotelId,
        createdAt: { $gt: filter.date },
      })
      .countDocuments();
    return count;
  }

  toEntity(doc: IHotelBookingDocument): HotelBookingEntity {
    return {
      _id: doc._id.toString(),
      hotelId: doc.hotelId,
      travelerId: doc.travelerId,
      roomVariantId: doc.roomVariantId,
      roomNumber: doc.roomNumber,
      checkinDate: doc.checkinDate,
      checkoutDate: doc.checkoutDate,
      totalAmount: doc.totalAmount,
      paymentIntendId: doc.paymentIntendId,
      paymentStatus: doc.paymentStatus,
      bookingStatus: doc.bookingStatus,
      isWalkIn: doc.isWalkIn,
      refundAmount: doc.refundAmount,
      refundStatus: doc.refundStatus,
      cancelledAt: doc.cancelledAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getTravelerOngoingBookings(
    travelerId: string,
    pageNo: number,
  ): Promise<IBookingWithHotelAggregation> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          travelerId,
          checkinDate: { $lte: today },
          checkoutDate: { $gte: today },
        },
      },
      {
        $addFields: {
          hotelObjectId: { $toObjectId: "$hotelId" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelObjectId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $sort: { checkinDate: 1 },
      },
      {
        $skip: (pageNo - 1) * VALUES.BOOKINGS_LIMIT,
      },
      {
        $limit: VALUES.BOOKINGS_LIMIT,
      },
    ];

    const bookings = await this._model.aggregate<
      IHotelBookingDocument & { hotel: IHotelDocument }
    >(aggregationPipeline);

    return {
      bookings: bookings.map((booking) => ({
        ...this.toEntity(booking as IHotelBookingDocument),
        hotel: {
          name: booking.hotel.name,
          coverImage: booking.hotel.coverImage,
          address: { city: booking.hotel.address.city },
        },
      })),
      pageNo,
    };
  }

  async getTravelerUpcomingBookings(
    travelerId: string,
    pageNo: number,
  ): Promise<IBookingWithHotelAggregation> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          travelerId,
          checkinDate: { $gt: today },
        },
      },
      {
        $addFields: {
          hotelObjectId: { $toObjectId: "$hotelId" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelObjectId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $sort: { checkinDate: 1 },
      },
      {
        $skip: (pageNo - 1) * VALUES.BOOKINGS_LIMIT,
      },
      {
        $limit: VALUES.BOOKINGS_LIMIT,
      },
    ];

    const bookings = await this._model.aggregate<
      IHotelBookingDocument & { hotel: IHotelDocument }
    >(aggregationPipeline);

    return {
      bookings: bookings.map((booking) => ({
        ...this.toEntity(booking as IHotelBookingDocument),
        hotel: {
          name: booking.hotel.name,
          coverImage: booking.hotel.coverImage,
          address: { city: booking.hotel.address.city },
        },
      })),
      pageNo,
    };
  }

  async getTravelerCompletedBookings(
    travelerId: string,
    pageNo: number,
  ): Promise<IBookingWithHotelAggregation> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          travelerId,
          checkoutDate: { $lt: today },
        },
      },
      {
        $addFields: {
          hotelObjectId: { $toObjectId: "$hotelId" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelObjectId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $sort: { checkinDate: -1 },
      },
      {
        $skip: (pageNo - 1) * VALUES.BOOKINGS_LIMIT,
      },
      {
        $limit: VALUES.BOOKINGS_LIMIT,
      },
    ];

    const bookings = await this._model.aggregate<
      IHotelBookingDocument & { hotel: IHotelDocument }
    >(aggregationPipeline);

    return {
      bookings: bookings.map((booking) => ({
        ...this.toEntity(booking as IHotelBookingDocument),
        hotel: {
          name: booking.hotel.name,
          coverImage: booking.hotel.coverImage,
          address: { city: booking.hotel.address.city },
        },
      })),
      pageNo,
    };
  }

  async getBookingDetailsById(
    bookingId: string,
    travelerId: string,
  ): Promise<IBookingDetailsAggregation | null> {
    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(bookingId),
          travelerId,
        },
      },
      {
        $addFields: {
          hotelObjectId: { $toObjectId: "$hotelId" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelObjectId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: "$hotel",
      },
      {
        $addFields: {
          roomVariantObjectId: { $toObjectId: "$roomVariantId" },
        },
      },
      {
        $lookup: {
          from: "roomvariants",
          localField: "roomVariantObjectId",
          foreignField: "_id",
          as: "roomVariant",
        },
      },
      {
        $unwind: "$roomVariant",
      },
    ];

    const result = await this._model.aggregate<
      IHotelBookingDocument & {
        hotel: IHotelDocument;
        roomVariant: IRoomVariantDocument;
      }
    >(aggregationPipeline);

    if (result.length === 0) return null;

    const booking = result[0];
    return {
      booking: {
        ...this.toEntity(booking as IHotelBookingDocument),
        hotel: booking.hotel,
        roomVariant: booking.roomVariant,
      },
    };
  }
}
