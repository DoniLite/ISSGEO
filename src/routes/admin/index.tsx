import IndexPage from "@/components/dashboard/pages/Index";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/")({
    component: IndexPage,
});