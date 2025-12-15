import MasterPage from "@/components/dashboard/pages/Master";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/master")({
    component: MasterPage,
});
