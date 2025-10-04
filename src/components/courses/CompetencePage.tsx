import { Briefcase, Tag } from "lucide-react";
import { MOCK_COMPETENCIES } from "@/lib/mock";
import Hero from "../services/Hero";
import BaseHeroWrapper from "../shared/BasePageHeroWrapper";
import Footer from "../shared/Footer";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function CompetencesPage() {
	return (
		<>
			<BaseHeroWrapper>
				<Hero
					titleKey="pages.modules.title"
					descriptionKey="pages.modules.desc"
				/>
			</BaseHeroWrapper>
			<div className="container mx-auto my-12 lg:p-4 p-2">
				<div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
					{MOCK_COMPETENCIES.map((comp) => (
						<Card
							key={comp.title}
							className="p-6 hover:shadow-xl transition-shadow"
						>
							<CardHeader className="px-0 pt-0">
								<div className="flex items-center mb-4">
									<comp.icon className="w-8 h-8 text-primary dark:text-secondary mr-4" />
									<CardTitle className="text-2xl font-bold text-foreground">
										{comp.title}
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent className="px-0 pb-0 space-y-4">
								<p className="text-foreground">{comp.description}</p>

								<div className="pt-2 border-t">
									<h4 className="font-semibold mt-2 flex items-center text-lg text-primary/80 dark:text-secondary/80">
										<Briefcase className="w-4 h-4 mr-2" /> Secteurs Clés :
									</h4>
									<div className="flex flex-wrap gap-2 mt-2">
										{comp.sectors.map((sector) => (
											<Badge key={sector}>
												<Tag className="w-3 h-3 mr-1" />{" "}
												<span className="text-wrap">{sector}</span>
											</Badge>
										))}
									</div>
								</div>

								<div className="pt-2 border-t">
									<h4 className="font-semibold mt-2 flex items-center text-lg text-primary/80 dark:text-secondary/80">
										Avantages :
									</h4>
									<ul className="list-disc list-inside text-muted-foreground pl-4">
										{comp.advantages.map((a) => (
											<li>{a}</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
			<Footer />
		</>
	);
}
