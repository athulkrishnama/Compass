import { createFileRoute } from "@tanstack/react-router";
import BookingStatus from "@/pages/traveler/BookingStatus";
import { z } from "zod";

const bookingStatusSearchSchema = z.object({
    payment_intent: z.string().optional(),
    payment_intent_client_secret: z.string().optional(),
    redirect_status: z.string().optional(),
});

export const Route = createFileRoute("/traveler/booking-status")({
    component: BookingStatus,
    validateSearch: bookingStatusSearchSchema,
});
