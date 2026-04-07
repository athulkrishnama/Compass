import { model } from "mongoose";
import { fareSchema } from "./fare.schema";

export const fareModel = model("fare", fareSchema);