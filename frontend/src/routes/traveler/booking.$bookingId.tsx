import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Loading from "@/components/shared/loading/Loading";
import { createGetBookingDetailsQueryOptions } from "@/queryOptions/bookingQueryOptions";
import BookingDetails from "@/pages/traveler/BookingDetails";

export const Route = createFileRoute("/traveler/booking/$bookingId")({
    loader: async ({ context, params }) => {
        await context.queryClient.ensureQueryData(
            createGetBookingDetailsQueryOptions(params.bookingId)
        );
    },
    component: () => (
        <Suspense
            fallback={
                <div className="min-h-screen">
                    <Loading />
                </div>
            }
        >
            <BookingDetails />
        </Suspense>
    ),
});
