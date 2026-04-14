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
  S3_BUCKET_NAME: z.string({ error: Errors.S3_BUCKET_NAME_ERROR }),
  S3_ACCESS_KEY: z.string({ error: Errors.S3_ACCESS_KEY_ERROR }),
  S3_REGION: z.string({ error: Errors.S3_REGION_ERROR }),
  S3_SECRET_ACCESS_KEY: z.string({ error: Errors.S3_SECRET_ACCESS_KEY_ERROR }),
  SIGNED_URL_EXPIRY: z.coerce.number({ error: Errors.SIGNED_URL_EXPIRY_ERROR }),
  OTP_EXPIRATION_TIME: z.coerce.number({
    error: Errors.OTP_EXPIRATION_TIME_ERROR,
  }),
  STRIPE_SECRET_KEY: z.string({ error: Errors.STRIPE_SECRET_KEY_ERROR }),
  STRIPE_WEBHOOK_SECRET: z.string({
    error: Errors.STRIPE_WEBHOOK_SECRET_ERROR,
  }),
  ROOM_LOCK_TIME: z.coerce.number({
    error: Errors.ROOM_LOCK_EXPIRATION_TIME_ERROR,
  }),
  COMMISSION_PERCENTAGE: z.coerce
    .number({ error: Errors.COMMISSION_PERCENTAGE_ERROR })
    .min(0)
    .max(100),
  MAPBOX_ACCESS_TOKEN: z.string({ error: Errors.MAPBOX_ACCESS_TOKEN_ERROR }),
  SOCKET_UI_ORIGIN: z.url({ error: Errors.ENV_SOCKET_UI_ORIGIN_ERROR }),
  SOCKET_ADMIN_USERNAME: z.string({
    error: Errors.ENV_SOCKET_ADMIN_USERNAME_ERROR,
  }),
  SOCKET_ADMIN_PASSWORD: z.string({
    error: Errors.ENV_SOCKET_ADMIN_PASSWORD_ERROR,
  }),
});
