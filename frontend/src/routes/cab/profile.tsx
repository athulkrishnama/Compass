import Profile from "@/pages/cab/Profile";
import { createGetUserProfileQueryOptions } from "@/queryOptions/authQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/profile")({
    loader: ({ context }) => {
        context.queryClient.ensureQueryData(createGetUserProfileQueryOptions());
    },
    component: Profile,
});
