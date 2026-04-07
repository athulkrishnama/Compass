import { Coordinate } from "@domain/types/coordinate"
import { FareStatus } from "@domain/types/fareStatus"
import { FareType } from "@domain/types/fareType"

export interface FareEntity {
    _id: string
    rider_id: string
    pickup_location: Coordinate
    dropoff_location: Coordinate
    distance: number
    time: number
    created_at: Date
    expires_at: Date
    status: FareStatus
    fares: FareType[]
}

