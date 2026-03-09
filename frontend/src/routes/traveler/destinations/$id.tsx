import { Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import Loading from "@/components/shared/loading/Loading";
import { createFindDestinationByIdQueryOption } from "@/queryOptions/destinationQueryOptions";
import DestinationDetail from "@/pages/traveler/DestinationDetail";
import CommonErrorComponent from "@/components/errorBoundries/CommonErrorComponent";
import NotFound from "@/components/errorBoundries/destination/NotFound";

export const Route = createFileRoute("/traveler/destinations/$id")({
    loader: async ({ context, params }) => {
        try {
            await context.queryClient.ensureQueryData(
                createFindDestinationByIdQueryOption(params.id)
            );
        } catch {
            throw notFound();
        }
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
    errorComponent: () => {
        return <CommonErrorComponent />;
    },
    notFoundComponent: NotFound,
});
