import Users from "@/pages/admin/Users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
    component: Users,
});
