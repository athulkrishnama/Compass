import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { BaseRepository } from "../base/base.repo";
import { IHotelBookingDocument } from "./hotelBookingSchema";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { inject, injectable } from "tsyringe";
import { Model, PipelineStage, RootFilterQuery, Types } from "mongoose";
import { IBookingWithHotelAggregation } from "@domain/dtos/hotelBooking/travelerBookingListing.dto";
import { IHotelBookingListingAggregation } from "@domain/dtos/hotelBooking/hotelBookingListing.dto";
import { VALUES } from "@presentation/constants/values";
import { IHotelDocument } from "../hotel/hotelSchema";
import { IRoomVariantDocument } from "../roomVariant/roomVariantSchema";
import { IUserDocument } from "../users/userSchema";
import { IBookingDetailsAggregation } from "@domain/dtos/hotelBooking/bookingDetails.dto";
import { HotelEntity } from "@domain/entities/hotel/hotel.entity";
import { RoomVariantEntity } from "@domain/entities/roomVariant/roomVariant.entity";

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
    // Sum numberOfRooms across matching documents to get total rooms booked
    const result = await this._model.aggregate([
      { $match: filterQuery },
      { $group: { _id: null, total: { $sum: "$numberOfRooms" } } },
    ]);
    return result[0]?.total ?? 0;
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
      numberOfRooms: doc.numberOfRooms ?? 1,
      roomNumbers: doc.roomNumbers,
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          travelerId,
          checkinDate: { $lt: tomorrow },
          checkoutDate: { $gte: today },
          bookingStatus: {
            $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CHECKED_IN],
          },
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          travelerId,
          checkinDate: { $gte: tomorrow },
          bookingStatus: BOOKING_STATUS.CONFIRMED,
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
          bookingStatus: {
            $in: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED],
          },
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
        hotel: {
          ...booking.hotel,
          _id: booking.hotel._id.toString(),
        } as unknown as HotelEntity,
        roomVariant: {
          ...booking.roomVariant,
          _id: booking.roomVariant._id.toString(),
        } as unknown as RoomVariantEntity,
      },
    };
  }

  async getDashboardStats(hotelIds: string[]): Promise<
    {
      hotelId: string;
      todayCheckIns: number;
      todayCheckOuts: number;
      activeGuests: number;
      occupiedRooms: number;
      totalRevenue: number;
      totalBookings: number;
    }[]
  > {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const result = await this._model.aggregate([
      { $match: { hotelId: { $in: hotelIds } } },
      {
        $group: {
          _id: "$hotelId",
          todayCheckIns: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$checkinDate", startOfDay] },
                    { $lt: ["$checkinDate", endOfDay] },
                    { $ne: ["$bookingStatus", BOOKING_STATUS.CANCELLED] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          todayCheckOuts: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$checkoutDate", startOfDay] },
                    { $lt: ["$checkoutDate", endOfDay] },
                    { $ne: ["$bookingStatus", BOOKING_STATUS.CANCELLED] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          activeGuests: {
            $sum: {
              $cond: [
                { $eq: ["$bookingStatus", BOOKING_STATUS.CHECKED_IN] },
                1,
                0,
              ],
            },
          },
          occupiedRooms: {
            $sum: {
              $cond: [
                { $eq: ["$bookingStatus", BOOKING_STATUS.CHECKED_IN] },
                1,
                0,
              ],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $ne: ["$bookingStatus", BOOKING_STATUS.CANCELLED] },
                "$totalAmount",
                0,
              ],
            },
          },
          totalBookings: {
            $sum: {
              $cond: [
                { $ne: ["$bookingStatus", BOOKING_STATUS.CANCELLED] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          hotelId: "$_id",
          todayCheckIns: 1,
          todayCheckOuts: 1,
          activeGuests: 1,
          occupiedRooms: 1,
          totalRevenue: 1,
          totalBookings: 1,
        },
      },
    ]);

    return result;
  }

  async getRecentBookingsByHotelId(
    hotelId: string,
    limit: number,
  ): Promise<
    {
      _id: string;
      guestName: string;
      roomVariantName: string;
      checkinDate: Date;
      checkoutDate: Date;
      bookingStatus: BOOKING_STATUS;
      totalAmount: number;
    }[]
  > {
    const result = await this._model.aggregate([
      {
        $match: {
          hotelId,
          bookingStatus: { $ne: BOOKING_STATUS.CANCELLED },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $addFields: {
          travelerObjectId: { $toObjectId: "$travelerId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "travelerObjectId",
          foreignField: "_id",
          as: "traveler",
        },
      },
      { $unwind: { path: "$traveler", preserveNullAndEmptyArrays: true } },
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
      { $unwind: { path: "$roomVariant", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: { $toString: "$_id" },
          guestName: { $ifNull: ["$traveler.full_name", "Guest"] },
          roomVariantName: { $ifNull: ["$roomVariant.name", "Unknown"] },
          checkinDate: 1,
          checkoutDate: 1,
          bookingStatus: 1,
          totalAmount: 1,
        },
      },
    ]);

    return result;
  }

  async getHotelBookings(params: {
    hotelId: string;
    roomVariantId?: string;
    bookingStatus?: BOOKING_STATUS;
    search?: string;
    pageNo: number;
  }): Promise<IHotelBookingListingAggregation> {
    const matchStage: Record<string, unknown> = {
      hotelId: params.hotelId,
    };

    if (params.roomVariantId) {
      matchStage.roomVariantId = params.roomVariantId;
    }

    if (params.bookingStatus) {
      matchStage.bookingStatus = params.bookingStatus;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $addFields: {
          travelerObjectId: { $toObjectId: "$travelerId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "travelerObjectId",
          foreignField: "_id",
          as: "traveler",
        },
      },
      { $unwind: { path: "$traveler", preserveNullAndEmptyArrays: true } },
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
      { $unwind: { path: "$roomVariant", preserveNullAndEmptyArrays: true } },
    ];

    if (params.search) {
      pipeline.push({
        $match: {
          "traveler.full_name": {
            $regex: params.search,
            $options: "i",
          },
        },
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const result = await this._model.aggregate<{
      bookings: (IHotelBookingDocument & {
        traveler: IUserDocument;
        roomVariant: IRoomVariantDocument;
      })[];
      total: { count: number }[];
    }>([
      ...pipeline,
      {
        $facet: {
          bookings: [
            { $skip: (params.pageNo - 1) * VALUES.BOOKINGS_LIMIT },
            { $limit: VALUES.BOOKINGS_LIMIT },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const facetResult = result[0];

    return {
      bookings: facetResult?.bookings || [],
      total: facetResult?.total?.[0]?.count || 0,
    } as unknown as IHotelBookingListingAggregation;
  }

  async countTotalBookings(): Promise<number> {
    return await this._model.countDocuments({
      bookingStatus: { $ne: BOOKING_STATUS.CANCELLED },
    });
  }

  async calculateTotalRevenue(): Promise<number> {
    const result = await this._model.aggregate([
      {
        $match: {
          bookingStatus: {
            $in: [BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CHECKED_IN],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    return result[0]?.totalRevenue || 0;
  }

  async getBookingTrends(filter: {
    type: "weekly" | "monthly" | "yearly";
    year?: number;
    month?: number;
  }): Promise<{ name: string; bookings: number; revenue: number }[]> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const year = filter.year || now.getFullYear();

    const trendsMatch: RootFilterQuery<IHotelBookingDocument> = {
      bookingStatus: { $ne: BOOKING_STATUS.CANCELLED },
    };

    let groupBy: Record<string, unknown> = {};
    if (filter.type === "weekly") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      trendsMatch.createdAt = { $gte: startOfWeek };
      groupBy = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    } else if (filter.type === "monthly") {
      const targetMonth = filter.month ? filter.month - 1 : today.getMonth();
      const startOfMonth = new Date(year, targetMonth, 1);
      const startOfNextMonth = new Date(year, targetMonth + 1, 1);
      trendsMatch.createdAt = {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      };
      groupBy = { $dayOfMonth: "$createdAt" };
    } else {
      const startYear = year - 4;
      const startDate = new Date(startYear, 0, 1);
      trendsMatch.createdAt = { $gte: startDate };
      groupBy = { $year: "$createdAt" };
    }

    const trendsAgg = await this._model.aggregate([
      { $match: trendsMatch },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    let bookingTrends: { name: string; revenue: number; bookings: number }[] =
      [];

    if (filter.type === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return {
          dateStr: `${y}-${m}-${day}`,
          name: days[d.getDay()],
        };
      });

      bookingTrends = last7Days.map((d) => {
        const found = trendsAgg.find((t) => t._id === d.dateStr);
        return {
          name: d.name,
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        };
      });
    } else if (filter.type === "monthly") {
      const targetMonth = filter.month ? filter.month - 1 : today.getMonth();
      const daysInMonth = new Date(year, targetMonth + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      bookingTrends = days.map((day) => {
        const found = trendsAgg.find((t) => t._id === day);
        return {
          name: day.toString(),
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        };
      });
    } else {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
      bookingTrends = years.map((yr) => {
        const found = trendsAgg.find((t) => t._id === yr);
        return {
          name: yr.toString(),
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        };
      });
    }

    return bookingTrends;
  }

  async getTopBookedHotels(
    limit: number,
  ): Promise<{ name: string; bookings: number }[]> {
    const result = await this._model.aggregate([
      {
        $match: { bookingStatus: { $ne: BOOKING_STATUS.CANCELLED } },
      },
      {
        $group: {
          _id: "$hotelId",
          bookings: { $sum: 1 },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: limit },
      {
        $addFields: {
          hotelObjectId: { $toObjectId: "$_id" },
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
      { $unwind: "$hotel" },
      {
        $project: {
          name: "$hotel.name",
          bookings: 1,
          _id: 0,
        },
      },
    ]);
    return result;
  }

  async getBookingStatusDistribution(): Promise<
    { name: string; value: number }[]
  > {
    const result = await this._model.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);
    return result;
  }
  async getOverallDashboardCharts(
    hotelIds: string[],
    filter: {
      type: "weekly" | "monthly" | "yearly";
      year?: number;
      month?: number;
    },
  ): Promise<{
    revenueTrends: { name: string; revenue: number; bookings: number }[];
    bookingStatusDistribution: { name: string; value: number }[];
    topHotelsByBookings: { name: string; bookings: number }[];
  }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const year = filter.year || now.getFullYear();

    const trendsMatch: RootFilterQuery<HotelBookingEntity> = {
      hotelId: { $in: hotelIds },
      bookingStatus: { $ne: BOOKING_STATUS.CANCELLED },
    };

    let groupBy: Record<string, unknown> = {};
    if (filter.type === "weekly") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      trendsMatch.createdAt = { $gte: startOfWeek };
      groupBy = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
    } else if (filter.type === "monthly") {
      const targetMonth = filter.month ? filter.month - 1 : today.getMonth();
      const startOfMonth = new Date(year, targetMonth, 1);
      const startOfNextMonth = new Date(year, targetMonth + 1, 1);
      trendsMatch.createdAt = {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      };
      groupBy = { $dayOfMonth: "$createdAt" };
    } else {
      const startYear = year - 4;
      const startDate = new Date(startYear, 0, 1);
      trendsMatch.createdAt = { $gte: startDate };
      groupBy = { $year: "$createdAt" };
    }

    const trendsAgg = await this._model.aggregate([
      { $match: trendsMatch },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    let revenueTrends: { name: string; revenue: number; bookings: number }[] =
      [];

    if (filter.type === "weekly") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return {
          dateStr: `${year}-${month}-${day}`,
          name: days[d.getDay()],
        };
      });

      revenueTrends = last7Days.map((d) => {
        const found = trendsAgg.find((t) => t._id === d.dateStr);
        return {
          name: d.name,
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        };
      });
    } else if (filter.type === "monthly") {
      const targetMonth = filter.month ? filter.month - 1 : today.getMonth();
      const daysInMonth = new Date(year, targetMonth + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      revenueTrends = days.map((day) => {
        const found = trendsAgg.find((t) => t._id === day);
        return {
          name: day.toString(),
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        };
      });
    } else {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
      revenueTrends = years.map((yr) => {
        const found = trendsAgg.find((t) => t._id === yr);
        return {
          name: yr.toString(),
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        };
      });
    }

    const statusAgg = await this._model.aggregate([
      { $match: { hotelId: { $in: hotelIds } } },
      {
        $group: {
          _id: "$bookingStatus",
          value: { $sum: 1 },
        },
      },
    ]);

    const bookingStatusDistribution = statusAgg.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    const topHotelsAgg = await this._model.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          bookingStatus: { $ne: BOOKING_STATUS.CANCELLED },
        },
      },
      {
        $group: {
          _id: "$hotelId",
          bookings: { $sum: 1 },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $addFields: {
          hotelObjectId: { $toObjectId: "$_id" },
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
      { $unwind: "$hotel" },
      {
        $project: {
          name: "$hotel.name",
          bookings: 1,
          _id: 0,
        },
      },
    ]);

    return {
      revenueTrends,
      bookingStatusDistribution,
      topHotelsByBookings: topHotelsAgg,
    };
  }
}
