import ForgetPassword from "@/pages/traveler/ForgetPassword";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traveler/forgetPassword")({
    component: ForgetPassword,
});
