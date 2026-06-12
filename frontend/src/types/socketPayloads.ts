export const DRIVER_EVENTS_TYPES = {
    REQUESTED: "driver:requested",
    ACCEPTED: "driver:accepted",
    CANCELLED: "driver:cancelled",
} as const;
export type DRIVER_EVENTS_TYPE =
    (typeof DRIVER_EVENTS_TYPES)[keyof typeof DRIVER_EVENTS_TYPES];

export const RIDER_EVENTS_TYPES = {
    ASSIGNED: "rider:assigned",
    CANCELLED: "rider:cancelled",
    NO_DRIVERS: "rider:no_drivers",
} as const;
export type RIDER_EVENTS_TYPE =
    (typeof RIDER_EVENTS_TYPES)[keyof typeof RIDER_EVENTS_TYPES];

export interface DriverRequestedPayload {
    type: typeof DRIVER_EVENTS_TYPES.REQUESTED;
    payload: {
        ride_id: string;
        fare: {
            cab_type: string;
            fare: number;
        };
        pickup: { latitude: number; longitude: number };
        dropoff: { latitude: number; longitude: number };
        distance: number;
        time: number;
        attempt_id: string;
    };
}

export type DriverEventPayload =
    | DriverRequestedPayload
    | DriverAcceptedPayload
    | DriverCancelledPayload;

export interface DriverCancelledPayload {
    type: typeof DRIVER_EVENTS_TYPES.CANCELLED;
    payload: {
        ride_id: string;
        message?: string;
    };
}

export interface DriverAcceptedPayload {
    type: typeof DRIVER_EVENTS_TYPES.ACCEPTED;
    payload: {
        ride_id: string;
        rider_id: string;
    };
}

export interface RiderAssignedPayload {
    type: typeof RIDER_EVENTS_TYPES.ASSIGNED;
    payload: {
        driver_id?: string;
    };
}

export interface RiderCancelledPayload {
    type: typeof RIDER_EVENTS_TYPES.CANCELLED;
    payload: {
        message?: string;
    };
}

export interface RiderNoDriversPayload {
    type: typeof RIDER_EVENTS_TYPES.NO_DRIVERS;
    payload: {
        message?: string;
    };
}

export type RiderEventPayload =
    | RiderAssignedPayload
    | RiderCancelledPayload
    | RiderNoDriversPayload;
