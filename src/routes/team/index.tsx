import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/services/Hero";
import BaseHeroWrapper from "@/components/shared/BasePageHeroWrapper";
import Footer from "@/components/shared/Footer";

export const Route = createFileRoute("/team/")({
	component: () => (
		<>
			<BaseHeroWrapper>
				<Hero />
			</BaseHeroWrapper>
			<Footer />
		</>
	),
});
