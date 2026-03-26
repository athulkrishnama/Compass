export interface IRideStateService {
  setRideState(rideId: string, state: string): Promise<void>;
  getRideState(rideId: string): Promise<string | null>;
  addAttemptedDriver(rideId: string, driverId: string): Promise<void>;
  getAttemptedDrivers(rideId: string): Promise<string[]>;
  clearRideState(rideId: string): Promise<void>;
}
