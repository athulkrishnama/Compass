import { model } from "mongoose";
import { destinationSchema } from "../schemas/destination";

export const destinationModel = model("destinations", destinationSchema);
