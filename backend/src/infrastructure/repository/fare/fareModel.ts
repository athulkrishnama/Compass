import { model } from "mongoose";
import { fareSchema } from "./fareSchema";

export const fareModel = model("fare", fareSchema);
