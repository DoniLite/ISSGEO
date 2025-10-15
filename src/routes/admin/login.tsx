import LoginPage from "@/components/dashboard/pages/LoginPage";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/login")({
    component: LoginPage,
});