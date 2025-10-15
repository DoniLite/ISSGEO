import { createFileRoute } from "@tanstack/react-router";
import FaqPage from "@/components/faq/Page";

export const Route = createFileRoute("/faq")({
	component: FaqPage,
});
