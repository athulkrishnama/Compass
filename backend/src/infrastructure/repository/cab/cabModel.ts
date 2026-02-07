import { model } from "mongoose";
import { cabSchema } from "../schemas/cabSchema";

export const cabModel = model("cabs", cabSchema);
