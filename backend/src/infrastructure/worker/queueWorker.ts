import { env } from "@config/envConfig";
import { QUEUE_NAMES } from "@domain/constants/queueNames";
import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { IDriverMatchingUseCase } from "@application/interfaces/useCase/ride/driverMatchingUseCase.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class QueueWorker {
  private _connection: IORedis;
  constructor(
    @inject("IDriverMatchingUseCase")
    private _driverMatchingUseCase: IDriverMatchingUseCase,
  ) {
    this._connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
    this._setWorker();
    console.log("QueueWorkerStarted");
  }

  private async _setWorker() {
    const driverMatcherWorker = async (job: Job) => {
      await this._driverMatchingUseCase.execute({
        ride_id: job.data.ride_id,
        attempt_id: job.data.attempt_id,
      });
    };

    const worker = new Worker(QUEUE_NAMES.DEFAULT, driverMatcherWorker, {
      connection: this._connection,
    });

    worker.on("error", (error) => {
      console.log(error);
    });
  }
}
