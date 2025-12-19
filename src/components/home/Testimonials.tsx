import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReviewModal from "../review/ReviewModal";
import { AnimatedSlider } from "../shared/Slider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Container from "./Container";
import type { TestimonialsTableType } from "@/db";
import type { Base } from "@/lib/interfaces/base";
import useTestimonialStore from "@/stores/testimonials.store";

export default function Testimonials() {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const { items, fetchData, create } = useTestimonialStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Container id="testimonials">
			<ReviewModal open={open} setOpen={setOpen} create={create} />
			<div className="container mx-auto p-2 lg:p-4">
				<div className="w-full flex">
					<Badge className="my-4 ml-auto">{t("navBadge.testimonials")}</Badge>
				</div>
				<div className="w-full flex flex-col lg:flex-row gap-4">
					<div className="w-[70%] md:w-[80%] xl:w-[55%] mt-8 lg:mt-0 flex mx-auto">
						{items && items.length > 0 && (
							<AnimatedSlider
								items={items.map((t) => (
									<TestimonialsCard key={t.name} {...t} />
								))}
								showNavigation={false}
								pluginOptions={{ speed: 0.5, startDelay: 3000, stopOnInteraction: false }}
								opts={{ loop: true }}
							/>
						)}
					</div>
					<div>
						<h1 className="text-lg font-bold lg:text-3xl">
							{t("testimonials.sectionTitle")}
						</h1>
						<p className="text-muted-foreground text-sm font-bold">
							{t("testimonials.sectionDescription", {
								testimonialsLength: items?.length ?? 0,
							})}
						</p>
						<Button
							className="w-full font-bold mt-4 cursor-pointer transition-all"
							onClick={() => setOpen(true)}
						>
							{t("testimonials.cta")}
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}

interface  TestimonialsCardProps extends Base<TestimonialsTableType> {}

function TestimonialsCard({
	name,
	message,
	starNumber,
}: TestimonialsCardProps) {
	const starCount = Math.max(0, Math.min(5, starNumber ?? 0));

	return (
		<div className="p-4 border rounded-md flex flex-col gap-3">
			<div className="flex items-center gap-2">
				<div className="text-yellow-400">{"★".repeat(starCount)}</div>
			</div>
			<p className="text-sm line-clamp-5">{message}</p>
			<span className="text-xs text-muted-foreground">- {name}</span>
		</div>
	);
}
