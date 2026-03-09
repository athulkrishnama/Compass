import mongoose from "mongoose";
import { env } from "@config/envConfig";
import { Messages } from "presentation/constants/messages";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

export class MongodbConfig {
  public static connect() {
    mongoose
      .connect(env.MONGODB_URI)
      .then(() => console.log(Messages.MONGODB_CONNECTED))
      .catch((err) => {
        if (err instanceof Error) console.log(err);
      });
  }
}
