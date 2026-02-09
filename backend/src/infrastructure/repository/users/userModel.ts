import { model } from "mongoose";
import { userSchema } from "./userSchema";

export const userModel = model("users", userSchema);
