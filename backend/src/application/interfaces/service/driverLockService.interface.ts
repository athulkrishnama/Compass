export interface IDriverLockService {
  acquireRideLock(rideId: string, ttlMs: number): Promise<boolean>;
  releaseRideLock(rideId: string): Promise<void>;
  acquireDriverLock(
    driverId: string,
    rideId: string,
    ttlMs: number,
  ): Promise<boolean>;
  releaseDriverLock(driverId: string): Promise<void>;
}
