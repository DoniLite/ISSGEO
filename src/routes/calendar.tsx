import { createFileRoute } from "@tanstack/react-router";
import { ogImageUrl } from "@/seo";
import TrainingCalendar from "@/components/courses/CalendarPage";

export const Route = createFileRoute("/calendar")({
	head: () => ({
		title: "Calendar — ISSGEO",
		meta: [
			{ name: "description", content: "Upcoming training sessions and events at ISSGEO." },
			{ property: "og:title", content: "Calendar — ISSGEO" },
			{ property: "og:description", content: "Upcoming training sessions and events at ISSGEO." },
			{ property: "og:image", content: ogImageUrl("Calendar — ISSGEO", "Upcoming training sessions and events at ISSGEO.") },
		],
	}),
	component: TrainingCalendar,
});
