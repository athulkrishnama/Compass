import { model } from "mongoose";
import { destinationSchema } from "./destinationSchema";

export const destinationModel = model("destinations", destinationSchema);
