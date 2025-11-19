import { createFileRoute } from "@tanstack/react-router";
import { ogImageUrl } from "@/seo";
import AboutMainActivities from "@/components/about/MainActivities";
import AboutValues from "@/components/about/Values";
import Contact from "@/components/home/Contact";
import MissionSection from "@/components/home/Missions";
import Hero from "@/components/services/Hero";
import BaseHeroWrapper from "@/components/shared/BasePageHeroWrapper";
import Footer from "@/components/shared/Footer";

export const Route = createFileRoute("/about")({
	head: () => ({
		title: "About — ISSGEO",
		meta: [
			{ name: "description", content: "About ISSGEO — our mission, partners and team." },
			{ property: "og:title", content: "About — ISSGEO" },
			{ property: "og:description", content: "About ISSGEO — our mission, partners and team." },
			{ property: "og:image", content: ogImageUrl("About — ISSGEO", "About ISSGEO — our mission, partners and team.") },
		],
	}),
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
