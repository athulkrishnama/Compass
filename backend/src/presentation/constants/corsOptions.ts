import { env } from "../../config/envConfig";
import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: env.ORIGIN_URL,
  credentials: true,
};
