import { model } from "mongoose";
import { cabSchema } from "./cabSchema";

export const cabModel = model("cabs", cabSchema);
