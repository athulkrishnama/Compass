import { createFileRoute } from "@tanstack/react-router";
import BookingConfirmation from "@/pages/traveler/BookingConfirmation";
import { z } from "zod";

const bookingConfirmationSearchSchema = z.object({
    roomVariantId: z.string(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guests: z.number(),
    numberOfRooms: z.number(),
    paymentIntentId: z.string(),
    clientSecret: z.string(),
    amount: z.number(),
});

export const Route = createFileRoute("/traveler/booking-confirmation")({
    validateSearch: bookingConfirmationSearchSchema,
    component: BookingConfirmation,
});
