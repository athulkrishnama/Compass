import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { Errors } from "presentation/constants/Error";
import { Messages } from "presentation/constants/messages";
import Redis from "ioredis";
import { env } from "@config/envConfig";
import { injectable } from "tsyringe";
import { IGeoService } from "@application/interfaces/service/geoService.interface";
import { Coordinate } from "@domain/types/coordinate";
import { VEHICLE_TYPES, VehicleType } from "@domain/types/vehicleType";
import { RedisKeys } from "@domain/enums/cacheKeys";
import { VALUES } from "@presentation/constants/values";

@injectable()
export class CacheService implements ICacheService, IGeoService {
  private _redisClient: Redis;

  constructor() {
    this._redisClient = new Redis(env.REDIS_URL);

    this._redisClient.on("error", (err) =>
      console.log(
        Errors.REDIS_CONNECTION_ERROR,
        err instanceof Error && err.message,
      ),
    );

    this._redisClient.on("connect", () =>
      console.log(Messages.REDIS_CONNECTED),
    );

    this._redisClient.on("close", () =>
      console.log(Messages.REDIS_DISCONNECTED),
    );
  }

  async setValue(key: string, value: string): Promise<void> {
    await this._redisClient.set(key, value);
  }

  async setWithExpiry(key: string, value: string, time: number): Promise<void> {
    await this._redisClient.set(key, value, "EX", time);
  }

  async getValue(key: string): Promise<string | null> {
    return await this._redisClient.get(key);
  }

  async deleteValue(key: string): Promise<void> {
    await this._redisClient.del(key);
  }

  async addDriverLocation(
    driverId: string,
    coordinates: Coordinate,
    vehicleType: VehicleType,
  ): Promise<void> {
    const pipeline = this._redisClient.pipeline();
    pipeline.geoadd(
      RedisKeys.DRIVER_LOCATION(vehicleType),
      coordinates.longitude,
      coordinates.latitude,
      driverId,
    );
    pipeline.setex(
      RedisKeys.DRIVER_AVAILABLE(driverId),
      VALUES.DRIVER_LOCATION_EXPIRY,
      "true",
    );
    await pipeline.exec();
  }

  async getNearbyDrivers(
    coordinates: Coordinate,
    radius: number,
    vehicleType: VehicleType,
  ): Promise<string[]> {
    return [];
  }

  async cleanupStaleDrivers(): Promise<void> {
    const vehicleTypes = Object.values(VEHICLE_TYPES);

    for (const vehicleType of vehicleTypes) {
      const geoKey = RedisKeys.DRIVER_LOCATION(vehicleType);
      let cursor = 0;

      do {
        const [nextCursor, members] = await this._redisClient.zscan(
          geoKey,
          cursor,
          "COUNT",
          500,
        );

        cursor = parseInt(nextCursor);

        if (!members.length) continue;

        const driverIds = members.filter((_, i) => i % 2 === 0);

        if (!driverIds.length) continue;

        const pipeline = this._redisClient.pipeline();
        for (const driverId of driverIds) {
          pipeline.exists(RedisKeys.DRIVER_AVAILABLE(driverId));
        }

        const results = await pipeline.exec();
        if (!results) continue;

        const deadDrivers = driverIds.filter((_, i) => {
          const [err, alive] = results[i] as [Error | null, number];
          return !err && alive === 0;
        });

        if (deadDrivers.length) {
          await this._redisClient.zrem(geoKey, ...deadDrivers);
        }
      } while (cursor !== 0);
    }
  }
}
