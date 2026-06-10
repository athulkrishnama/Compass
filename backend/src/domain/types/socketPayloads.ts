export enum DRIVER_EVENTS_TYPES {
  REQUESTED = "requested",
}
export type DRIVER_EVENTS_TYPE = DRIVER_EVENTS_TYPES;

export enum RIDER_EVENTS_TYPES {
  ASSIGNED = "assigned",
  CANCELLED = "cancelled",
  NO_DRIVERS = "no_drivers",
  REQUESTED = "requested",
}
export type RIDER_EVENTS_TYPE = RIDER_EVENTS_TYPES;

export type SocketEventPayload<T> = {
  type: T;
  payload: object;
};

export type RiderEventPayload = SocketEventPayload<RIDER_EVENTS_TYPE>;

export type DriverEventPayload = SocketEventPayload<DRIVER_EVENTS_TYPE>;
