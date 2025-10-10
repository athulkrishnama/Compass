import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { Errors } from "presentation/constants/Error";
import { Messages } from "presentation/constants/messages";
import { createClient, RedisClientType } from "@redis/client";
import { env } from "@config/envConfig";
import { injectable } from "tsyringe";

@injectable()
export class CacheService implements ICacheService {
  private _redisClient: RedisClientType;

  constructor() {
    this._redisClient = createClient({ url: env.REDIS_URL });

    this._redisClient.on("error", (err) =>
      console.log(
        Errors.REDIS_CONNECTION_ERROR,
        err instanceof Error && err.message,
      ),
    );

    this._redisClient.on("connect", () =>
      console.log(Messages.REDIS_CONNECTED),
    );

    this._redisClient.on("disconnect", () =>
      console.log(Messages.REDIS_DISCONNECTED),
    );
  }

  async connect() {
    if (!this._redisClient.isOpen) {
      await this._redisClient.connect();
    }
  }
  async setValue(key: string, value: string): Promise<void> {
    if (!this._redisClient.isOpen) {
      await this.connect();
    }
    this._redisClient.set(key, value);
  }
  async setWithExpiry(key: string, value: string, time: number): Promise<void> {
    if (!this._redisClient.isOpen) {
      await this.connect();
    }
    this._redisClient.setEx(key, time, value);
  }
  async getValue(key: string): Promise<string | null> {
    if (!this._redisClient.isOpen) {
      await this.connect();
    }

    return await this._redisClient.get(key);
  }
  async deleteValue(key: string): Promise<void> {
    if (!this._redisClient.isOpen) {
      await this.connect();
    }
    await this._redisClient.del(key);
  }
}
