import { createFileRoute } from "@tanstack/react-router";
import { ogImageUrl } from "@/seo";
import FaqPage from "@/components/faq/Page";

export const Route = createFileRoute("/faq")({
	head: () => ({
		title: "FAQ — ISSGEO",
		meta: [
			{ name: "description", content: "Frequently asked questions about ISSGEO services and courses." },
			{ property: "og:title", content: "FAQ — ISSGEO" },
			{ property: "og:description", content: "Frequently asked questions about ISSGEO services and courses." },
			{ property: "og:image", content: ogImageUrl("FAQ — ISSGEO", "Frequently asked questions about ISSGEO services and courses.") },
		],
	}),
	component: FaqPage,
});
