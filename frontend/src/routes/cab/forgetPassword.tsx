import ForgetPassword from "@/pages/cab/ForgetPassword";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cab/forgetPassword")({
    component: ForgetPassword,
});
