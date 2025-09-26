import z from "zod";
import { Errors } from "../constants/Error";
import { environment } from "../constants/environment";

export const envSchema = z.object({
  PORT: z.coerce
    .number({ error: Errors.ENV_PORT_ERROR })
    .positive()
    .max(65536)
    .default(3000),
  MONGODB_URI: z.url({ error: Errors.ENV_MONGODB_URI_ERROR }),
  NODE_ENV: z
    .enum(environment, { error: Errors.ENV_NODE_ENV_ERROR })
    .default("DEVELOPMENT"),
  ORIGIN_URL: z.url(),
});
