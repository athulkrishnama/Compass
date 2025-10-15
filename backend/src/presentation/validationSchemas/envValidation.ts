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
  ACCESS_TOKEN_SECRET: z.string({ error: Errors.ENV_ACCESS_TOKEN_ERROR }),
  REFRESH_TOKEN_SECRET: z.string({ error: Errors.ENV_REFRESH_TOKEN_ERROR }),
  ACCESS_TOKEN_EXPIRATION_TIME: z.coerce.number({
    error: Errors.ENV_ACCESS_TOKEN_EXPIRATION_TIME_ERROR,
  }),
  REFRESH_TOKEN_EXPIRATION_TIME: z.coerce.number({
    error: Errors.ENV_REFRESH_TOKEN_EXPIRATION_TIME_ERROR,
  }),
  EMAIL: z.email({ error: Errors.ENV_EMAIL_ERROR }),
  EMAIL_PASSWORD: z.string({ error: Errors.ENV_EMAIL_PASSWORD_ERROR }),
  REDIS_URL: z.url({ error: Errors.ENV_REDIS_URL_ERROR }),
  GOOGLE_CLIENT_ID: z.string({ error: Errors.GOOGLE_CLIENT_ID_ERROR }),
  GOOGLE_CLIENT_SECRET: z.string({ error: Errors.GOOGLE_CLIENT_SECRET_ERROR }),
});
