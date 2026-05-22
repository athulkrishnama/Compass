export const DRIVER_EVENTS_TYPES = {
    REQUESTED: "REQUESTED",
} as const;
export type DRIVER_EVENTS_TYPE =
    (typeof DRIVER_EVENTS_TYPES)[keyof typeof DRIVER_EVENTS_TYPES];

export const RIDER_EVENTS_TYPES = {
    ASSIGNED: "ASSIGNED",
    CANCELLED: "CANCELLED",
    NO_DRIVERS: "NO_DRIVERS",
} as const;
export type RIDER_EVENTS_TYPE =
    (typeof RIDER_EVENTS_TYPES)[keyof typeof RIDER_EVENTS_TYPES];

export type SocketEventPayload<T> = {
    type: T;
    payload: object;
};

export type RiderEventPayload = SocketEventPayload<RIDER_EVENTS_TYPE>;

export type DriverEventPayload = SocketEventPayload<DRIVER_EVENTS_TYPE>;
