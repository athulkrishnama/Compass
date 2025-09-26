import mongoose from "mongoose";
import { env } from "./envConfig";
import { Messages } from "../infrastructure/constants/messages";

export class MongodbConfig {
  public static connect() {
    mongoose
      .connect(env.MONGODB_URI)
      .then(() => console.log(Messages.MONGODB_CONNECTED))
      .catch((err) => {
        if (err instanceof Error) console.log(err.message);
      });
  }
}
