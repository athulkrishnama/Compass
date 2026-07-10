import { RideEntity } from "@domain/entities/ride/ride.entity";
import { BaseRepository } from "../base/base.repo";
import { IRideDocument } from "./ride.schema";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { inject, injectable } from "tsyringe";
import { Model, Types, RootFilterQuery } from "mongoose";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { env } from "@config/envConfig";
@injectable()
export class RideRepo
  extends BaseRepository<RideEntity, IRideDocument>
  implements IRideRepo
{
  constructor(@inject("IRideModel") model: Model<IRideDocument>) {
    super(model);
  }

  async create(data: RideEntity): Promise<string> {
    const doc = this.toMongoDoc(data);
    const result = await this._model.create(doc);
    return result._id.toString();
  }

  async update(entity: RideEntity, id: string): Promise<void> {
    const updateData = this.toMongoDoc(entity);
    await this._model.findByIdAndUpdate(id, { $set: updateData });
  }

  async fetchCabActiveRide(driver_id: string): Promise<RideEntity | null> {
    const doc = await this._model.findOne({
      driver_id: new Types.ObjectId(driver_id),
      $or: [
        {
          status: {
            $in: [
              RIDE_STATUSES.MATCHED,
              RIDE_STATUSES.IN_TRANSIT,
              RIDE_STATUSES.ARRIVED,
            ],
          },
        },
        {
          status: RIDE_STATUSES.COMPLETED,
          paymentStatus: { $ne: "SUCCESS" },
        },
      ],
    });
    return doc ? this.toEntity(doc) : null;
  }
  async fetchRiderActiveRide(rider_id: string): Promise<RideEntity | null> {
    const doc = await this._model
      .findOne({
        rider_id: new Types.ObjectId(rider_id),
        $or: [
          {
            status: {
              $in: [
                RIDE_STATUSES.SEARCHING,
                RIDE_STATUSES.MATCHED,
                RIDE_STATUSES.IN_TRANSIT,
                RIDE_STATUSES.ARRIVED,
              ],
            },
          },
          {
            status: RIDE_STATUSES.COMPLETED,
            paymentStatus: { $ne: "SUCCESS" },
          },
        ],
      })
      .sort({ createdAt: -1 }); // Get the most recent one just in case
    return doc ? this.toEntity(doc) : null;
  }

  async fetchRiderPastTrips(
    rider_id: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RideEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = {
      rider_id: new Types.ObjectId(rider_id),
      status: {
        $in: [RIDE_STATUSES.COMPLETED, RIDE_STATUSES.CANCELLED],
      },
    };

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ _id: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);

    return {
      trips: docs.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  async fetchDriverPastTrips(
    driver_id: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RideEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter = {
      driver_id: new Types.ObjectId(driver_id),
      status: {
        $in: [RIDE_STATUSES.COMPLETED, RIDE_STATUSES.CANCELLED],
      },
    };

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort({ _id: -1 }).skip(skip).limit(limit),
      this._model.countDocuments(filter),
    ]);

    return {
      trips: docs.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  async getDriverDashboardStats(
    driverId: string,
    filter: {
      type: "weekly" | "monthly" | "yearly";
      year?: number;
      month?: number;
    },
  ): Promise<{
    todayEarnings: number;
    todayTrips: number;
    totalEarnings: number;
    totalDistance: number;
    earningsTrends: { name: string; earnings: number; trips: number }[];
    tripStatusDistribution: { name: string; value: number }[];
  }> {
    const driverObjectId = new Types.ObjectId(driverId);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const year = filter.year || now.getFullYear();

    // 1. Get summary basic metrics
    const basicStatsAgg = await this._model.aggregate([
      { $match: { driver_id: driverObjectId } },
      {
        $group: {
          _id: null,
          todayEarnings: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", RIDE_STATUSES.COMPLETED] },
                    {
                      $gte: [
                        "$_id",
                        Types.ObjectId.createFromTime(today.getTime() / 1000),
                      ],
                    }, // Approx createdAt check using ObjectId
                  ],
                },
                "$selected_fare.fare",
                0,
              ],
            },
          },
          todayTrips: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", RIDE_STATUSES.COMPLETED] },
                    {
                      $gte: [
                        "$_id",
                        Types.ObjectId.createFromTime(today.getTime() / 1000),
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalEarnings: {
            $sum: {
              $cond: [
                { $eq: ["$status", RIDE_STATUSES.COMPLETED] },
                "$selected_fare.fare",
                0,
              ],
            },
          },
          totalDistance: {
            $sum: {
              $cond: [
                { $eq: ["$status", RIDE_STATUSES.COMPLETED] },
                "$distance",
                0,
              ],
            },
          },
        },
      },
    ]);

    const basicStats = basicStatsAgg[0] || {
      todayEarnings: 0,
      todayTrips: 0,
      totalEarnings: 0,
      totalDistance: 0,
    };

    // 2. Trip Status Distribution
    const statusAgg = await this._model.aggregate([
      { $match: { driver_id: driverObjectId } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$status", RIDE_STATUSES.COMPLETED] },
              "Completed",
              {
                $cond: [
                  { $eq: ["$cancelled_by", "RIDER"] },
                  "Cancelled by Rider",
                  {
                    $cond: [
                      { $eq: ["$cancelled_by", "DRIVER"] },
                      "Cancelled by Driver",
                      "Missed / Timeout",
                    ],
                  },
                ],
              },
            ],
          },
          value: { $sum: 1 },
        },
      },
    ]);

    const tripStatusDistribution = statusAgg.map((item) => ({
      name: item._id,
      value: item.value,
    }));

    // 3. Earnings Trends
    const trendsMatch: RootFilterQuery<IRideDocument> = {
      driver_id: driverObjectId,
      status: RIDE_STATUSES.COMPLETED,
    };

    let groupBy: Record<string, unknown> = {};
    if (filter.type === "weekly") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      trendsMatch._id = {
        $gte: Types.ObjectId.createFromTime(startOfWeek.getTime() / 1000),
      };
      // Extract date string from objectId
      groupBy = {
        $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$_id" } },
      };
    } else if (filter.type === "monthly") {
      let { year } = filter;
      const { month } = filter;
      if (!year) year = today.getFullYear();
      const targetMonth = month ? month - 1 : today.getMonth();

      const startOfMonth = new Date(year, targetMonth, 1);
      const startOfNextMonth = new Date(year, targetMonth + 1, 1);

      trendsMatch._id = {
        $gte: Types.ObjectId.createFromTime(startOfMonth.getTime() / 1000),
        $lt: Types.ObjectId.createFromTime(startOfNextMonth.getTime() / 1000),
      };
      groupBy = { $dayOfMonth: { $toDate: "$_id" } };
    } else {
      const startYear = year - 4;
      const startDate = new Date(startYear, 0, 1);
      trendsMatch._id = {
        $gte: Types.ObjectId.createFromTime(startDate.getTime() / 1000),
      };
      groupBy = { $year: { $toDate: "$_id" } };
    }

    const trendsAgg = await this._model.aggregate([
      { $match: trendsMatch },
      {
        $group: {
          _id: groupBy,
          earnings: { $sum: "$selected_fare.fare" },
          trips: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    let earningsTrends: { name: string; earnings: number; trips: number }[] =
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

      earningsTrends = last7Days.map((d) => {
        const found = trendsAgg.find((t) => t._id === d.dateStr);
        return {
          name: d.name,
          earnings: found ? found.earnings : 0,
          trips: found ? found.trips : 0,
        };
      });
    } else if (filter.type === "monthly") {
      let { year } = filter;
      const { month } = filter;
      if (!year) year = today.getFullYear();
      const targetMonth = month ? month - 1 : today.getMonth();
      const daysInMonth = new Date(year, targetMonth + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

      earningsTrends = days.map((day) => {
        const found = trendsAgg.find((t) => t._id === day);
        return {
          name: day.toString(),
          earnings: found ? found.earnings : 0,
          trips: found ? found.trips : 0,
        };
      });
    } else {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
      earningsTrends = years.map((yr) => {
        const found = trendsAgg.find((t) => t._id === yr);
        return {
          name: yr.toString(),
          earnings: found ? found.earnings : 0,
          trips: found ? found.trips : 0,
        };
      });
    }

    const commissionMultiplier = (100 - env.COMMISSION_PERCENTAGE) / 100;

    return {
      todayEarnings: basicStats.todayEarnings * commissionMultiplier,
      todayTrips: basicStats.todayTrips,
      totalEarnings: basicStats.totalEarnings * commissionMultiplier,
      totalDistance: basicStats.totalDistance,
      earningsTrends: earningsTrends.map((t) => ({
        ...t,
        earnings: t.earnings * commissionMultiplier,
      })),
      tripStatusDistribution,
    };
  }

  toMongoDoc(entity: RideEntity): IRideDocument {
    return new this._model({
      _id: entity._id ? new Types.ObjectId(entity._id) : new Types.ObjectId(),
      rider_id: new Types.ObjectId(entity.rider_id),
      driver_id: entity.driver_id ? new Types.ObjectId(entity.driver_id) : null,
      fare_id: new Types.ObjectId(entity.fare_id),
      selected_fare: entity.selected_fare,
      distance: entity.distance,
      time: entity.time,
      pickup_point: {
        type: "Point",
        coordinates: [
          entity.pickup_point.longitude,
          entity.pickup_point.latitude,
        ],
      },
      dropoff_point: {
        type: "Point",
        coordinates: [
          entity.dropoff_point.longitude,
          entity.dropoff_point.latitude,
        ],
      },
      attempted_drivers: entity.attempted_drivers.map(
        (id) => new Types.ObjectId(id),
      ),
      attempt_id: entity.attempt_id ?? "",
      otp: entity.otp ?? "",
      otp_attempts: entity.otp_attempts,
      status: entity.status,
      cancelled_by: entity.cancelled_by,
      events: entity.events,
      paymentStatus: entity.paymentStatus,
      paymentMethod: entity.paymentMethod,
      remainingAmount: entity.remainingAmount ?? 0,
    });
  }

  toEntity(doc: IRideDocument): RideEntity {
    return {
      _id: doc._id.toString(),
      rider_id: doc.rider_id.toString(),
      driver_id: doc.driver_id ? doc.driver_id.toString() : null,
      fare_id: doc.fare_id.toString(),
      selected_fare: doc.selected_fare,
      distance: doc.distance,
      time: doc.time,
      pickup_point: {
        longitude: doc.pickup_point.coordinates[0],
        latitude: doc.pickup_point.coordinates[1],
      },
      dropoff_point: {
        longitude: doc.dropoff_point.coordinates[0],
        latitude: doc.dropoff_point.coordinates[1],
      },
      attempted_drivers: doc.attempted_drivers
        ? doc.attempted_drivers.map((id) => id.toString())
        : [],
      attempt_id: doc.attempt_id,
      otp: doc.otp,
      otp_attempts: doc.otp_attempts,
      status: doc.status,
      cancelled_by: doc.cancelled_by,
      events: doc.events
        ? doc.events.map((event) => ({
            event_name: event.event_name,
            actor: event.actor,
            timestamp: event.timestamp,
          }))
        : [],
      paymentStatus: doc.paymentStatus,
      paymentMethod: doc.paymentMethod,
      remainingAmount: doc.remainingAmount ?? 0,
    };
  }
}
