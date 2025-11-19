import { createFileRoute } from "@tanstack/react-router";
import { ogImageUrl } from "@/seo";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import Missions from "@/components/home/Missions";
import Services from "@/components/home/Services";
// import Team from '@/components/home/Team';
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/shared/Footer";

export const Route = createFileRoute("/")({
	head: () => ({
		title: "ISSGEO — Home",
		meta: [
			{ name: "description", content: "ISSGEO Institute — training, recruitment and professional placement." },
			{ property: "og:title", content: "ISSGEO — Home" },
			{ property: "og:description", content: "ISSGEO Institute — training, recruitment and professional placement." },
			{ property: "og:image", content: ogImageUrl("ISSGEO — Home", "ISSGEO Institute — training, recruitment and professional placement.") },
		],
	}),
	component: () => (
		<>
			<div className="relative w-full h-screen">
				<div className="h-full w-full grid grid-cols-1 lg:grid-cols-[70%_30%] -z-10">
					<div className="w-full h-full bg-linear-to-tr from-primary/50 via-secondary to-primary"></div>
					<div className="w-full h-full hidden lg:block bg-[url(../static/coverv1.jpg)] bg-cover bg-center bg-no-repeat"></div>
				</div>
				<Hero />
			</div>
			<Services />
			<Missions />
			{/* <Team /> */}
			<Contact />
			<Testimonials />
			<Footer />
		</>
	),
});
