import { model } from "mongoose";
import { userSchema } from "../schemas/userSchema";

export const userModel = model("users", userSchema);
