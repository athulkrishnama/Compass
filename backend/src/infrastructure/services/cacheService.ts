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
import { INearbyDriverResponseDTO } from "@domain/dtos/cab/nearbyDrivers.dto";

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
    heading?: number,
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
    if (heading !== undefined) {
      pipeline.setex(
        RedisKeys.DRIVER_HEADING(driverId),
        VALUES.DRIVER_LOCATION_EXPIRY,
        heading.toString(),
      );
    }
    await pipeline.exec();
  }

  async getNearbyDrivers(
    coordinates: Coordinate,
    radius: number,
    vehicleType: VehicleType,
    count?: number,
    attemptedDrivers: string[] = [],
  ): Promise<string | null> {
    const results = await this._redisClient.call(
      "GEOSEARCH",
      RedisKeys.DRIVER_LOCATION(vehicleType),
      "FROMLONLAT",
      coordinates.longitude.toString(),
      coordinates.latitude.toString(),
      "BYRADIUS",
      radius.toString(),
      "km",
      "ASC",
      ...(count ? ["COUNT", count.toString()] : []),
    );

    const candidates = (results as string[]) || [];
    if (candidates.length === 0) return null;

    const attemptedSet = new Set(attemptedDrivers);
    const filtered = candidates.filter((id) => !attemptedSet.has(id));
    if (filtered.length === 0) return null;

    const pipeline = this._redisClient.pipeline();
    for (const driverId of filtered) {
      pipeline.exists(RedisKeys.DRIVER_AVAILABLE(driverId));
    }

    const pipelineResults = await pipeline.exec();
    if (!pipelineResults) return null;

    for (let i = 0; i < filtered.length; i++) {
      const [err, exists] = pipelineResults[i] as [Error | null, number];
      if (!err && exists === 1) {
        return filtered[i];
      }
    }

    return null;
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

  async getAllNearbyDrivers(
    coordinates: Coordinate,
    radius: number,
    vehicleType?: VehicleType,
  ): Promise<INearbyDriverResponseDTO[]> {
    const typesToSearch = vehicleType
      ? [vehicleType]
      : Object.values(VEHICLE_TYPES);

    const allDrivers: INearbyDriverResponseDTO[] = [];

    for (const vType of typesToSearch) {
      // Fetch drivers and their coordinates
      const results = await this._redisClient.call(
        "GEOSEARCH",
        RedisKeys.DRIVER_LOCATION(vType),
        "FROMLONLAT",
        coordinates.longitude.toString(),
        coordinates.latitude.toString(),
        "BYRADIUS",
        radius.toString(),
        "km",
        "ASC",
        "WITHCOORD",
      );

      const candidates = (results as [string, [string, string]][]) || [];
      if (candidates.length === 0) continue;

      const pipeline = this._redisClient.pipeline();
      for (const candidate of candidates) {
        const driverId = candidate[0];
        pipeline.exists(RedisKeys.DRIVER_AVAILABLE(driverId));
        pipeline.get(RedisKeys.DRIVER_HEADING(driverId));
      }

      const pipelineResults = await pipeline.exec();
      if (!pipelineResults) continue;

      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const driverId = candidate[0];
        const lon = parseFloat(candidate[1][0]);
        const lat = parseFloat(candidate[1][1]);

        // Each candidate has 2 pipeline results: exists (available) and get (heading)
        const availableResult = pipelineResults[i * 2] as [
          Error | null,
          number,
        ];
        const headingResult = pipelineResults[i * 2 + 1] as [
          Error | null,
          string | null,
        ];

        const isAvailable = !availableResult[0] && availableResult[1] === 1;
        const headingValue =
          !headingResult[0] && headingResult[1]
            ? parseFloat(headingResult[1])
            : undefined;

        if (isAvailable) {
          allDrivers.push({
            driverId,
            vehicleType: vType,
            coordinates: { longitude: lon, latitude: lat },
            heading: headingValue,
          });
        }
      }
    }

    return allDrivers;
  }
}
