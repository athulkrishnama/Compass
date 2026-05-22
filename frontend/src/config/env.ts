import { z } from "zod";

const envSchema = z.object({
    VITE_BASEURL: z.url(),
    VITE_GOOGLE_CLIENT_ID: z.string(),
    VITE_MAPBOX_ACCESS_TOKEN: z.string(),
    VITE_STRIPE_PUBLIC_KEY: z.string(),
    VITE_SOCKET_URL: z.url(),
});
export const env = envSchema.parse(import.meta.env);
