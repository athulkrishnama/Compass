export const DRIVER_EVENTS_TYPES = ["requested"] as const;
export type DRIVER_EVENTS_TYPE = (typeof DRIVER_EVENTS_TYPES)[number];

export const RIDER_EVENTS_TYPES = [
  "assigned",
  "cancelled",
  "no_drivers",
] as const;
export type RIDER_EVENTS_TYPE = (typeof RIDER_EVENTS_TYPES)[number];

export type SocketEventPayload<T> = {
  type: T;
  payload: object;
};

export type RiderEventPayload = SocketEventPayload<RIDER_EVENTS_TYPE>;

export type DriverEventPayload = SocketEventPayload<DRIVER_EVENTS_TYPE>;
