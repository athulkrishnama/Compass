import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Loading from "@/components/shared/loading/Loading";
import { createFindDestinationByIdQueryOption } from "@/queryOptions/destinationQueryOptions";
import DestinationDetail from "@/pages/traveler/DestinationDetail";

export const Route = createFileRoute("/traveler/destination/$id")({
    loader: async ({ context, params }) => {
        await context.queryClient.ensureQueryData(
            createFindDestinationByIdQueryOption(params.id)
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
            <DestinationDetail />
        </Suspense>
    ),
});
