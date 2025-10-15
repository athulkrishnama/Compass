import "module-alias/register";
import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";

const envPath = path.join(
  __dirname,
  "..",
  process.env.NODE_ENV == "DEVELOPMENT"
    ? ".env.development"
    : ".env.production",
);
dotenv.config({ path: envPath });

import { Server } from "./server";
import { MongodbConfig } from "@config/mongoConfig";

async function start() {
  try {
    MongodbConfig.connect();
    const server = new Server();
    server.listen();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      process.exit(1);
    }
  }
}

start();
