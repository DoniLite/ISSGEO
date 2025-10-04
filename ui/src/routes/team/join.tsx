import { createFileRoute } from "@tanstack/react-router";
import JoinUsPage from "@/components/careers/JoinUs";

export const Route = createFileRoute("/team/join")({
	component: JoinUsPage,
});
