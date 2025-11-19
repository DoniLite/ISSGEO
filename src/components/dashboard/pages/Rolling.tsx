import { Route } from "@/routes/admin/courses/rolling/$courseId";
import Layout from "../Layout";
import useCoursesStore from "@/stores/formations/courses.store";
import { useEffect, useMemo, useState } from "react";
import type { TrainingTableType } from "@/db";
import Loader from "@/components/shared/Loader";
import useRollingStore from "@/stores/rolling.store";
import type { PaginationQuery } from "@/lib/interfaces/pagination";
import EntitySelect, {
	type EntryType,
} from "@/components/shared/entity/SortedCombobox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RollingCard from "../RollingCard";
import useModuleStore from "@/stores/formations/module.store";
import { useTranslation } from "react-i18next";

export default function RollingPage() {
	const { courseId } = Route.useParams();
	const [course, setCourse] = useState<TrainingTableType>();
	const [selectedModule, setSelectedModule] = useState("all");

	const { t } = useTranslation();

	const courseStore = useCoursesStore();
	const rollingStore = useRollingStore();
	const moduleStore = useModuleStore();

	const printedRollings = useMemo(() => {
		if (selectedModule === "all") {
			return rollingStore.allItems;
		}
		return rollingStore.allItems.filter((r) => {
			const modules = r.modules.map((m) => m.id).filter((m) => m !== undefined);
			return modules.includes(selectedModule);
		});
	}, [rollingStore.allItems, selectedModule]);
	const printedModules = useMemo(() => moduleStore.items, [moduleStore]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		courseStore.findOne(courseId).then((d) => setCourse(d));
		rollingStore.fetchAll({ courseId, populateChildren: true });
		moduleStore.fetchData({ courseId } as PaginationQuery);
	}, []);

	const moduleEntries: EntryType[] = useMemo(
		() => [
			{
				id: "all",
				label: t("common.all"),
			},
			...printedModules.map((m) => ({
				label: m.title,
				id: m.id as string,
			})),
		],
		[printedModules, t],
	);

	return (
		<Layout>
			{courseStore.loading ? (
				<Loader />
			) : (
				<div className="w-full p-4 my-8">
					{course && (
						<Card className="rounded-xl border bg-card">
							<CardHeader>
								<CardTitle className="text-2xl font-semibold">
									{course.title}
								</CardTitle>

								<p className="text-muted-foreground pt-2">
									{course.description}
								</p>
							</CardHeader>

							<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{course.totalDuration !== undefined && (
									<div className="p-3 border rounded-lg bg-muted/30">
										<p className="text-sm text-muted-foreground">
											{t("pages.rolling.duration")}
										</p>
										<p className="font-semibold">{course.totalDuration} h</p>
									</div>
								)}

								{course.priceMin !== undefined && (
									<div className="p-3 border rounded-lg bg-muted/30">
										<p className="text-sm text-muted-foreground">
											{t("pages.rolling.priceMin")}
										</p>
										<p className="font-semibold">
											{course.priceMin.toLocaleString()} CFA
										</p>
									</div>
								)}

								{course.priceMax !== undefined && (
									<div className="p-3 border rounded-lg bg-muted/30">
										<p className="text-sm text-muted-foreground">
											{t("pages.rolling.priceMax")}
										</p>
										<p className="font-semibold">
											{course.priceMax.toLocaleString()} CFA
										</p>
									</div>
								)}

								{course.enrolled !== undefined && (
									<div className="p-3 border rounded-lg bg-muted/30">
										<p className="text-sm text-muted-foreground">
											{t("pages.rolling.participants")}
										</p>
										<p className="font-semibold">{course.enrolled}</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
						<EntitySelect
							entries={moduleEntries}
							placeholder={t("pages.rolling.filter")}
							value={selectedModule}
							onSearch={(q) => moduleStore.fetchData({ search: q })}
							clearable
							onSelected={(v) => setSelectedModule(v)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 my-4">
						{printedRollings.map((rolling) => (
							<RollingCard key={rolling.id} rolling={rolling} />
						))}
					</div>

					{printedRollings.length === 0 && (
						<p className="text-center text-muted-foreground pt-10">
							{t("pages.rolling.noModule")}
						</p>
					)}
				</div>
			)}
		</Layout>
	);
}
