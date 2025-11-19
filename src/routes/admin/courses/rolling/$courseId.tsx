import RollingPage from "@/components/dashboard/pages/Rolling";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/courses/rolling/$courseId")({
	component: RollingPage,
});
