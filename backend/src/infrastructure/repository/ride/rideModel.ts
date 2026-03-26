import { model } from "mongoose";
import { rideSchema } from "./rideSchema";

export const rideModel = model("Ride", rideSchema);
