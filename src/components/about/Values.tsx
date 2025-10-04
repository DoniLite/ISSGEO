import {
	Handshake,
	LeafyGreen,
	Lightbulb,
	Scaling,
	ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AboutValues() {
	const { t } = useTranslation();

	const values = [
		{
			key: "excellence",
			icon: Scaling,
		},
		{
			key: "innovation",
			icon: Lightbulb,
		},
		{
			key: "ethics",
			icon: ShieldCheck,
		},
		{
			key: "sustainability",
			icon: LeafyGreen,
		},
		{
			key: "collaboration",
			icon: Handshake,
		},
	];

	return (
		<section className="py-16 bg-muted">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-3xl font-bold text-primary dark:text-secondary mb-4">
					{t("about.values.sectionTitle")}
				</h2>
				<p className="max-w-3xl mx-auto text-muted-foreground mb-12">
					{t("about.values.intro")}
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{values.map((value) => (
						<Card
							key={value.key}
							className="p-6 text-left hover:shadow-lg transition-shadow"
						>
							<CardHeader className="pb-4 px-0 pt-0">
								<value.icon className="w-10 h-10 text-blue-600 mb-4" />
								<CardTitle className="text-xl font-semibold">
									{t(`about.values.${value.key}.title`)}
								</CardTitle>
							</CardHeader>
							<CardContent className="px-0 pb-0">
								<p className="text-sm text-muted-foreground">
									{t(`about.values.${value.key}.description`)}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
