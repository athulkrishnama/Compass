import { z } from "zod";

export const hotelSearchParamsSchema = z.object({
    q: z.string().optional(),
    city: z.array(z.coerce.number()).optional(),
    cityName: z.string().optional(),
    proximityRadius: z.coerce.number().optional(),
    guests: z.coerce.number().min(1).default(1),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
});

export type HotelSearchParams = z.infer<typeof hotelSearchParamsSchema>;
