export const RedisKeys = {
  driverGeo: "driver:geo",
  driverAvailableSet: (type: string) => `driver:available:${type}`,
  driverSocketId: (driverId: string) => `socket:driver:${driverId}`,
  driverLock: (driverId: string) => `driver:lock:${driverId}`,
  rideLock: (rideId: string) => `ride:lock:${rideId}`,
  rideState: (rideId: string) => `ride:state:${rideId}`,
  rideAttempted: (rideId: string) => `ride:attempted:${rideId}`,
  pricingConfig: "pricing:config",
} as const;
