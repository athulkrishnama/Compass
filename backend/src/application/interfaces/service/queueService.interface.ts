import { Job, JobsOptions } from "bullmq";
import {
  TJobData,
  TJobName,
  TQueueName,
} from "application/constants/queueConstants";

export interface IQueueService {
  addJob<T extends TJobName>(
    queueName: TQueueName,
    jobName: T,
    data: TJobData<T>,
    options?: JobsOptions,
  ): Promise<Job<TJobData<T>, unknown, string> | undefined>;
}
