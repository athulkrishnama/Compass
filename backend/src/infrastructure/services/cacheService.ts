import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { Errors } from "presentation/constants/Error";
import { Messages } from "presentation/constants/messages";
import Redis from "ioredis";
import { env } from "@config/envConfig";
import { injectable } from "tsyringe";

@injectable()
export class CacheService implements ICacheService {
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
}
