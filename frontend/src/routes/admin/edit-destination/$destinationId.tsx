import EditDestination from "@/pages/admin/EditDestination";
import { createFindDestinationByIdQueryOption } from "@/queryOptions/destinationQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/edit-destination/$destinationId")({
    loader: ({ context, params }) => {
        context.queryClient.ensureQueryData(
            createFindDestinationByIdQueryOption(params.destinationId)
        );
    },
    component: EditDestination,
});
