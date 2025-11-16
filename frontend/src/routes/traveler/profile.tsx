import Profile from "@/pages/traveler/Profile";
import { createGetUserProfileQueryOptions } from "@/queryOptions/authQueryOptions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/profile")({
    loader: ({ context }) =>
        context.queryClient.ensureQueryData(createGetUserProfileQueryOptions()),
    component: Profile,
    errorComponent: ({ error }) => <h1>{error.message}</h1>,
});
