import { createFileRoute } from "@tanstack/react-router";
import CompetencesPage from "@/components/courses/CompetencePage";

export const Route = createFileRoute("/competences")({
	component: CompetencesPage,
});
