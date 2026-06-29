export const DRIVER_EVENTS_TYPES = {
    REQUESTED: "driver:requested",
    ACCEPTED: "driver:accepted",
    CANCELLED: "driver:cancelled",
    ARRIVED: "driver:arrived",
    STARTED: "driver:started",
    COMPLETED: "driver:completed",
    PAYMENT_INITIATED: "driver:payment_initiated",
    PAYMENT_RECEIVED: "driver:payment_received",
} as const;
export type DRIVER_EVENTS_TYPE =
    (typeof DRIVER_EVENTS_TYPES)[keyof typeof DRIVER_EVENTS_TYPES];

export const RIDER_EVENTS_TYPES = {
    ASSIGNED: "rider:assigned",
    CANCELLED: "rider:cancelled",
    NO_DRIVERS: "rider:no_drivers",
    ARRIVED: "rider:arrived",
    STARTED: "rider:started",
    COMPLETED: "rider:completed",
    PAYMENT_SUCCESS: "rider:payment_success",
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

export interface DriverPaymentInitiatedPayload {
    type: typeof DRIVER_EVENTS_TYPES.PAYMENT_INITIATED;
    payload: { ride_id: string; event: string };
}

export interface DriverPaymentReceivedPayload {
    type: typeof DRIVER_EVENTS_TYPES.PAYMENT_RECEIVED;
    payload: { ride_id: string; event: string };
}

export type DriverEventPayload =
    | DriverRequestedPayload
    | DriverAcceptedPayload
    | DriverCancelledPayload
    | DriverArrivedPayload
    | DriverStartedPayload
    | DriverCompletedPayload
    | DriverPaymentInitiatedPayload
    | DriverPaymentReceivedPayload;

export interface DriverArrivedPayload {
    type: typeof DRIVER_EVENTS_TYPES.ARRIVED;
    payload: { ride_id: string };
}

export interface DriverStartedPayload {
    type: typeof DRIVER_EVENTS_TYPES.STARTED;
    payload: { ride_id: string };
}

export interface DriverCompletedPayload {
    type: typeof DRIVER_EVENTS_TYPES.COMPLETED;
    payload: { ride_id: string };
}

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
        ride_id: string;
        message?: string;
    };
}

export interface RiderNoDriversPayload {
    type: typeof RIDER_EVENTS_TYPES.NO_DRIVERS;
    payload: {
        message?: string;
    };
}

export interface RiderArrivedPayload {
    type: typeof RIDER_EVENTS_TYPES.ARRIVED;
    payload: { ride_id: string };
}

export interface RiderStartedPayload {
    type: typeof RIDER_EVENTS_TYPES.STARTED;
    payload: { ride_id: string };
}

export interface RiderCompletedPayload {
    type: typeof RIDER_EVENTS_TYPES.COMPLETED;
    payload: { ride_id: string };
}

export interface RiderPaymentSuccessPayload {
    type: typeof RIDER_EVENTS_TYPES.PAYMENT_SUCCESS;
    payload: { ride_id: string; event: string };
}

export type RiderEventPayload =
    | RiderAssignedPayload
    | RiderCancelledPayload
    | RiderNoDriversPayload
    | RiderArrivedPayload
    | RiderStartedPayload
    | RiderCompletedPayload
    | RiderPaymentSuccessPayload;
