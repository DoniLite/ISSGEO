import { createFileRoute } from "@tanstack/react-router";
import AboutMainActivities from "@/components/about/MainActivities";
import AboutValues from "@/components/about/Values";
import Contact from "@/components/home/Contact";
import MissionSection from "@/components/home/Missions";
import Hero from "@/components/services/Hero";
import BaseHeroWrapper from "@/components/shared/BasePageHeroWrapper";
import Footer from "@/components/shared/Footer";

export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	return (
		<>
			<BaseHeroWrapper>
				<Hero
					titleKey="about.hero.title"
					descriptionKey="about.hero.description"
				/>
			</BaseHeroWrapper>
			<AboutValues />
			<AboutMainActivities />
			<MissionSection />
			<Contact />
			<Footer />
		</>
	);
}
