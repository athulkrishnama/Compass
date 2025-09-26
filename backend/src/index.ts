import dotenv from "dotenv";
import path from "path";
import "module-alias/register";

const envPath = path.join(
  __dirname,
  "..",
  process.env.NODE_ENV == "DEVELOPMENT"
    ? ".env.development"
    : ".env.production",
);
dotenv.config({ path: envPath });

import { Server } from "./server";
import { MongodbConfig } from "./config/mongoConfig";

async function start() {
  try {
    MongodbConfig.connect();
    const server = new Server();
    server.listen();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}

start();
