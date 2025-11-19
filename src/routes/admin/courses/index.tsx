import CoursesPage from "@/components/dashboard/pages/Formations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/courses/")({
	component: CoursesPage,
});
