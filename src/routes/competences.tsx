import { createFileRoute } from "@tanstack/react-router";
import { ogImageUrl } from "@/seo";
import CompetencesPage from "@/components/courses/CompetencePage";

export const Route = createFileRoute("/competences")({
	head: () => ({
		title: "Competences — ISSGEO",
		meta: [
			{ name: "description", content: "Discover the core competencies covered in our courses." },
			{ property: "og:title", content: "Competences — ISSGEO" },
			{ property: "og:description", content: "Discover the core competencies covered in our courses." },
			{ property: "og:image", content: ogImageUrl("Competences — ISSGEO", "Discover the core competencies covered in our courses.") },
		],
	}),
	component: CompetencesPage,
});
