import { createFileRoute } from "@tanstack/react-router";
import TrainingCalendar from "@/components/courses/CalendarPage";

export const Route = createFileRoute("/calendar")({
	component: TrainingCalendar,
});
