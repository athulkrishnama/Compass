import ProfileLayout from "@/pages/traveler/profile/ProfileLayout";
import { createGetUserProfileQueryOptions } from "@/queryOptions/authQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/profile")({
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(createGetUserProfileQueryOptions());
    },
    component: ProfileLayout,
});
