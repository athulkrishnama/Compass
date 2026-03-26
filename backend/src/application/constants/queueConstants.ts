export const QueueNames = {
  MATCHING: "matching",
  SECONDARY: "secondary",
} as const;

export type TQueueName = (typeof QueueNames)[keyof typeof QueueNames];

export const JobNames = {
  DRIVER_TIMEOUT: "driver-timeout",
  SECONDARY_JOB: "secondary-job",
} as const;

export type TJobName = (typeof JobNames)[keyof typeof JobNames];

export interface IDriverTimeoutData {
  rideId: string;
  driverId: string;
  attemptId: string;
}

export interface ISecondaryJobData {
  // Temporary type
  dummyData: string;
}

export type TJobData<T extends TJobName> =
  T extends typeof JobNames.DRIVER_TIMEOUT
    ? IDriverTimeoutData
    : T extends typeof JobNames.SECONDARY_JOB
      ? ISecondaryJobData
      : never;
