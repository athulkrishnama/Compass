import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { BaseRepository } from "../base/base.repo";
import { IHotelBookingDocument } from "../database configs/schemas/hotelBookingSchema";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { inject, injectable } from "tsyringe";
import { Model, RootFilterQuery } from "mongoose";

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
    roomId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentStatus?: PAYMENT_STATUS;
    bookingStatus?: BOOKING_STATUS;
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
    if (filter.roomId) {
      filterQuery.roomId = filter.roomId;
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
    const result = await this._model.find(filterQuery).exec();
    return result.map((doc) => this.toEntity(doc));
  }

  async countBooking(filter: {
    travelerId?: string;
    hotelId?: string;
    roomVariantId?: string;
    roomId?: string;
    checkinDate?: Date;
    checkoutDate?: Date;
    afterCheckInDate?: Date;
    beforeCheckOutDate?: Date;
    afterCheckOutDate?: Date;
    beforeCheckInDate?: Date;
    paymentStatus?: PAYMENT_STATUS;
    bookingStatus?: BOOKING_STATUS;
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
    if (filter.roomId) {
      filterQuery.roomId = filter.roomId;
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
      roomId: doc.roomId,
      checkinDate: doc.checkinDate,
      checkoutDate: doc.checkoutDate,
      totalAmount: doc.totalAmount,
      paymentIntendId: doc.paymentIntendId,
      paymentStatus: doc.paymentStatus,
      bookingStatus: doc.bookingStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
