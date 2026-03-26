import { Queue, Job, JobsOptions, ConnectionOptions } from "bullmq";
import { injectable } from "tsyringe";
import { env } from "@config/envConfig";
import { IQueueService } from "application/interfaces/service/queueService.interface";
import {
  TJobData,
  TJobName,
  TQueueName,
  QueueNames,
} from "application/constants/queueConstants";

@injectable()
export class QueueService implements IQueueService {
  private queues: Map<TQueueName, Queue>;

  constructor() {
    this.queues = new Map();

    const connection = {
      url: env.REDIS_URL,
    };

    this.initializeQueue(QueueNames.MATCHING, connection);
    this.initializeQueue(QueueNames.SECONDARY, connection);
  }

  private initializeQueue(
    queueName: TQueueName,
    connection: ConnectionOptions,
  ) {
    try {
      const queue = new Queue(queueName, { connection });
      this.queues.set(queueName, queue);
      console.log(`[QueueService] Initialized queue: ${queueName}`);
    } catch (error) {
      console.error(
        `[QueueService] Error initializing queue ${queueName}`,
        error,
      );
    }
  }

  async addJob<T extends TJobName>(
    queueName: TQueueName,
    jobName: T,
    data: TJobData<T>,
    options?: JobsOptions,
  ): Promise<Job<TJobData<T>, unknown, string> | undefined> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      console.error(`[QueueService] Queue ${queueName} not found`);
      return;
    }
    return await queue.add(jobName, data, options);
  }
}
