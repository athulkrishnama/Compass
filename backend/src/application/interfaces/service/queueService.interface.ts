export interface IQueueService {
  addJob(name: string, data: object): Promise<void>;
  addDelayedJob(name: string, data: object, delay: number): Promise<void>;
}
