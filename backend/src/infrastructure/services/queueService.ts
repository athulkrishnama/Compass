import { IQueueService } from "@application/interfaces/service/queueService.interface";
import { Queue } from "bullmq";
import { injectable } from "tsyringe";
import IORedis from "ioredis";
import { env } from "@config/envConfig";

@injectable()
export class QueueService implements IQueueService {
  private queue: Queue;

  constructor() {
    const connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
    this.queue = new Queue("queue", { connection });
  }

  async addJob(name: string, data: object): Promise<void> {
    await this.queue.add(name, data);
  }

  async addDelayedJob(
    name: string,
    data: object,
    delay: number,
  ): Promise<void> {
    await this.queue.add(name, data, { delay });
  }
}
