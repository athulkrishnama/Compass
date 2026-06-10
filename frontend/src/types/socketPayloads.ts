export const DRIVER_EVENTS_TYPES = {
    REQUESTED: "requested",
} as const;
export type DRIVER_EVENTS_TYPE =
    (typeof DRIVER_EVENTS_TYPES)[keyof typeof DRIVER_EVENTS_TYPES];

export const RIDER_EVENTS_TYPES = {
    ASSIGNED: "assigned",
    CANCELLED: "cancelled",
    NO_DRIVERS: "no_drivers",
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
    };
}

export type DriverEventPayload = DriverRequestedPayload;

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
