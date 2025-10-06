import Login from "@/pages/admin/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
    component: Login,
});
