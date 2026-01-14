import { model } from "mongoose";
import { destinationSchema } from "../schemas/destinationSchema";

export const destinationModel = model("destinations", destinationSchema);
