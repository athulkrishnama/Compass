import { z } from "zod";

const envSchema = z.object({
    VITE_BASEURL: z.url(),
    VITE_GOOGLE_CLIENT_ID: z.string(),
});
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
export const env = envSchema.parse(import.meta.env);
