import type { ROLE } from "./role";

export const RIDE_EVENT_NAMES = {
    REQUESTED: "REQUESTED",
    ACCEPTED: "ACCEPTED",
    ARRIVED: "ARRIVED",
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    TIMED_OUT: "TIMED_OUT",
} as const;

export type RideEventName =
    (typeof RIDE_EVENT_NAMES)[keyof typeof RIDE_EVENT_NAMES];

export interface RideEvent {
    event_name: RideEventName;
    actor: ROLE;
    timestamp: string;
}
