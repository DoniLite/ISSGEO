import JobPage from "@/components/dashboard/pages/Job";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/job")({
    component: JobPage,
});