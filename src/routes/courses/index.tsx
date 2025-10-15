import { createFileRoute } from "@tanstack/react-router";
import FormationsCatalogue from "@/components/courses/CatalogPage";

export const Route = createFileRoute("/courses/")({
	component: FormationsCatalogue,
});
