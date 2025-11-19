import { Link } from "@tanstack/react-router";
import { Briefcase, Handshake, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function PlacementContent() {
	const { t } = useTranslation();

	const benefits = [
		{
			icon: Briefcase,
			title: t("services.placement.page.benefits.exposureTitle"),
			desc: t("services.placement.page.benefits.exposureDesc"),
		},
		{
			icon: Lightbulb,
			title: t("services.placement.page.benefits.innovationTitle"),
			desc: t("services.placement.page.benefits.innovationDesc"),
		},
	];

	return (
		<div className="text-center">
			<h2 className="text-3xl font-bold mb-4 text-primary dark:text-secondary">
				{t("services.placement.page.sectionTitle")}
			</h2>
			<p className="max-w-3xl mx-auto text-muted-foreground mb-12">
				{t("services.placement.page.introText")}
			</p>

			<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				{benefits.map((benefit) => (
					<Card
						key={benefit.title}
						className="p-6 text-left border-2 border-dashed"
					>
						<benefit.icon className="w-8 h-8 mb-4 dark:text-secondary" />
						<h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
						<p className="text-sm text-muted-foreground">{benefit.desc}</p>
					</Card>
				))}
			</div>

			<div className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-500 max-w-4xl mx-auto text-left">
				<p className="font-semibold text-yellow-800">
					{t("services.placement.page.note")}
				</p>
			</div>

			<Button className="mt-12 text-lg px-8 py-6" asChild>
				<Link to="/" hash="contact">
					<Handshake className="mr-2 h-5 w-5" />
					{t("services.placement.page.cta")}
				</Link>
			</Button>
		</div>
	);
}
