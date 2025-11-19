import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Hero from "../services/Hero";
import BaseHeroWrapper from "../shared/BasePageHeroWrapper";
import Footer from "../shared/Footer";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import TrainingCard from "./TrainingCard";
import useCoursesStore from "@/stores/formations/courses.store";
import useThematicStoreStore from "@/stores/formations/thematic.store";
import type {
	KeyCompetencyTableType,
	ModuleTableType,
	ThematicTableType,
	TrainingTableType,
} from "@/db";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { PaginationQuery } from "@/lib/interfaces/pagination";

export default function FormationsCatalogue() {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<string | undefined>(
		undefined,
	);
	const [allThematic, setAllThematic] = useState<ThematicTableType[]>([]);
	const courseStore = useCoursesStore();
	const thematicStore = useThematicStoreStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		thematicStore.fetchAll().then((thematic) => {
			setAllThematic(thematic || []);
		});
		courseStore.fetchData({ populateChildren: true });
	}, []);

	const filteredTrainings = useMemo(
		() => courseStore.items,
		[courseStore.items],
	);

	function SearchBar({
		value,
		onChange,
	}: {
		value: string;
		onChange: (s: string) => void;
	}) {
		return (
			<div className="mb-6 flex items-center gap-2 p-3 group rounded-md bg-primary/30 lg:w-[50%] w-full border-primary dark:border-secondary">
				<Search className="w-4 h-4 text-primary dark:text-secondary" />
				<input
					placeholder={t("pages.formations.searchPlaceholder")}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="bg-transparent outline-none border-none w-full group-hover:border"
				/>
			</div>
		);
	}

	function FiltersSidebar({
		thematics,
		active,
		onSelect,
		onClear,
	}: {
		thematics: ThematicTableType[];
		active?: string;
		onSelect: (id?: string) => void;
		onClear: () => void;
	}) {
		return (
			<aside className="relative">
				<Card>
					<CardContent className="pt-6">
						<h3 className="text-lg font-semibold mb-3">
							{t("pages.formations.filterTitle")}
						</h3>
						<div className="flex flex-wrap gap-2">
							<Badge
								variant={active === undefined ? "default" : "outline"}
								onClick={onClear}
								className="cursor-pointer text-sm py-1 line-clamp-1"
							>
								{t("them.all")}
							</Badge>
							{thematics.map((thematic) => (
								<Badge
									key={thematic.name}
									variant={active === thematic.id ? "default" : "outline"}
									onClick={() => onSelect(thematic.id)}
									className="cursor-pointer text-sm py-1 flex items-center overflow-ellipsis"
								>
									<DynamicIcon
										name={thematic.icon as IconName}
										className="w-3 h-3 mr-1"
									/>
									<span className="text-wrap">{thematic.name}</span>
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</aside>
		);
	}

	function TrainingGrid({
		trainings,
	}: {
		trainings: (TrainingTableType & {
			modules: ModuleTableType[];
			competencies: KeyCompetencyTableType[];
		})[];
	}) {
		if (!trainings || trainings.length === 0) {
			return (
				<div className="text-center py-10">
					<p className="text-xl text-muted-foreground">
						{t("pages.formations.noResults")}
					</p>
				</div>
			);
		}

		return (
			<div className="grid xl:grid-cols-2 lg:grid-cols-1 grid-cols-1 gap-6 w-full">
				{trainings.map((training) => (
					<TrainingCard key={training.id} training={training} />
				))}
			</div>
		);
	}

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
					{/* Filters columns */}
					<FiltersSidebar
						thematics={allThematic}
						active={activeFilter}
						onSelect={(id) => {
							setActiveFilter(id);
							courseStore.fetchData({ thematicId: id } as PaginationQuery);
						}}
						onClear={() => {
							setActiveFilter(undefined);
							courseStore.fetchData();
						}}
					/>

					{/* Result Columns */}
					<main className="w-full">
						<SearchBar
							value={searchTerm}
							onChange={(s) => {
								setSearchTerm(s);
								courseStore.fetchData({ search: s } as PaginationQuery);
							}}
						/>

						<TrainingGrid trainings={filteredTrainings} />
					</main>
				</div>
			</div>
			<Footer />
		</>
	);
}
