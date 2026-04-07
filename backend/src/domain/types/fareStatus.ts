export const FARE_STATUS = {
    CREATED: "CREATED",
    CONFIRMED: "CONFIRMED",
} as const

export type FareStatus = (typeof FARE_STATUS)[keyof typeof FARE_STATUS]