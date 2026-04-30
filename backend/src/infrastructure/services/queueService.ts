import { IQueueService } from "@application/interfaces/service/queueService.interface";
import { Queue } from "bullmq";
import { injectable } from "tsyringe";

@injectable()
export class QueueService implements IQueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue("queue", {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
        password: process.env.REDIS_PASSWORD,
      },
    });
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
