import { z } from "zod";

export const cabSearchParamsSchema = z.object({
    pickupLat: z.coerce.number(),
    pickupLng: z.coerce.number(),
    dropoffLat: z.coerce.number(),
    dropoffLng: z.coerce.number(),
});

export type CabSearchParams = z.infer<typeof cabSearchParamsSchema>;
