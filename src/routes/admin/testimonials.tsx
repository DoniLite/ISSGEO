import TestimonialsPage from "@/components/dashboard/pages/Testimonials";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/testimonials")({
	component: TestimonialsPage,
});
