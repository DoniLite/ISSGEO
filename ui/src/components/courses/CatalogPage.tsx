import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_THEMATICS, MOCK_TRAININGS } from "@/lib/mock";
import type { TrainingModule } from "@/lib/types";
import Hero from "../services/Hero";
import BaseHeroWrapper from "../shared/BasePageHeroWrapper";
import Footer from "../shared/Footer";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import TrainingCard from "./TrainingCard";

export default function FormationsCatalogue() {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<string | null>(null);

	const filteredTrainings = useMemo(() => {
		return MOCK_TRAININGS.filter((training: TrainingModule) => {
			// 1. Filtrage par Thématique
			if (activeFilter && training.thematic !== activeFilter) {
				return false;
			}
			// 2. Filtrage par Recherche
			if (searchTerm.trim() === "") return true;

			const lowerSearch = searchTerm.toLowerCase();
			return (
				training.title.toLowerCase().includes(lowerSearch) ||
				training.description.toLowerCase().includes(lowerSearch)
			);
		});
	}, [searchTerm, activeFilter, t]);

	return (
		<>
			<BaseHeroWrapper>
				<Hero
					titleKey="pages.formations.title"
					descriptionKey="pages.formations.desc"
				/>
			</BaseHeroWrapper>

			<div className="container mx-auto my-12 lg:p-4 p-3">
				<div className="grid 2xl:grid-cols-[25%_70%] lg:grid-cols-[30%_70%] grid-cols-1 2xl:gap-8 gap-4">
					{/* Colonne de Filtres */}
					<aside className="relative">
						<Card>
							<CardContent className="pt-6">
								<h3 className="text-lg font-semibold mb-3">
									{t("pages.formations.filterTitle")}
								</h3>
								<div className="flex flex-wrap gap-2">
									<Badge
										variant={activeFilter === null ? "default" : "outline"}
										onClick={() => setActiveFilter(null)}
										className="cursor-pointer text-sm py-1 line-clamp-1"
									>
										{t("them.all")}
									</Badge>
									{MOCK_THEMATICS.map((thematic) => (
										<Badge
											key={thematic.name}
											variant={
												activeFilter === thematic.name ? "default" : "outline"
											}
											onClick={() => setActiveFilter(thematic.name)}
											className="cursor-pointer text-sm py-1 flex items-center overflow-ellipsis"
										>
											<thematic.icon className="w-3 h-3 mr-1" />
											<span className="text-wrap">{thematic.name}</span>
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</aside>

					{/* Colonne de Résultats */}
					<main className="w-full">
						<div className="mb-6 flex items-center gap-2 p-3 group rounded-md bg-primary/30 lg:w-[50%] w-full border-primary dark:border-secondary">
							<Search className="w-4 h-4 text-primary dark:text-secondary" />
							<input
								placeholder={t("pages.formations.searchPlaceholder")}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="bg-transparent outline-none border-none w-full group-hover:border"
							/>
						</div>

						{filteredTrainings.length > 0 ? (
							<div className="grid xl:grid-cols-2 lg:grid-cols-1 grid-cols-1 gap-6 w-full">
								{filteredTrainings.map((training) => (
									<TrainingCard key={training.id} training={training} />
								))}
							</div>
						) : (
							<div className="text-center py-10">
								<p className="text-xl text-muted-foreground">
									{t("pages.formations.noResults")}
								</p>
							</div>
						)}
					</main>
				</div>
			</div>
			<Footer />
		</>
	);
}
