import { model } from "mongoose";
import { rideSchema } from "./ride.schema";

export const rideModel = model("ride", rideSchema);
