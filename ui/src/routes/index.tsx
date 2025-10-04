import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import Missions from "@/components/home/Missions";
import Services from "@/components/home/Services";
// import Team from '@/components/home/Team';
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/shared/Footer";

export const Route = createFileRoute("/")({
	component: () => (
		<>
			<div className="relative w-full h-screen">
				<div className="h-full w-full grid grid-cols-[90%_10%] lg:grid-cols-[70%_30%] -z-10">
					<div className="w-full h-full bg-linear-to-tr from-primary/50 via-secondary to-primary"></div>
					<div className="w-full h-full bg-[url(../assets/coverv1.jpg)] bg-cover bg-center bg-no-repeat"></div>
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
