export enum DRIVER_EVENTS_TYPES {
  REQUESTED = "driver:requested",
  ACCEPTED = "driver:accepted",
  CANCELLED = "driver:cancelled",
}
export type DRIVER_EVENTS_TYPE = DRIVER_EVENTS_TYPES;

export enum RIDER_EVENTS_TYPES {
  ASSIGNED = "rider:assigned",
  CANCELLED = "rider:cancelled",
  NO_DRIVERS = "rider:no_drivers",
  REQUESTED = "rider:requested",
}
export type RIDER_EVENTS_TYPE = RIDER_EVENTS_TYPES;

export type SocketEventPayload<T> = {
  type: T;
  payload: object;
};

export type RiderEventPayload = SocketEventPayload<RIDER_EVENTS_TYPE>;

export type DriverEventPayload = SocketEventPayload<DRIVER_EVENTS_TYPE>;
