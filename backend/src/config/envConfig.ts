import { envSchema } from "../infrastructure/validationSchemas/envValidation";

const result = envSchema.safeParse(process.env);
if (result.error) {
  throw new Error(result.error.message);
}
export const env = result.data;
