import Login from "@/pages/cab/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/login")({
    component: Login,
});
