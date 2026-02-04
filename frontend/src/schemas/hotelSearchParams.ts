import { z } from "zod";

export const hotelSearchParamsSchema = z.object({
    q: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    guests: z.coerce.number().min(1).default(1),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
});

export type HotelSearchParams = z.infer<typeof hotelSearchParamsSchema>;
