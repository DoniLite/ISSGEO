/** biome-ignore-all lint/correctness/useUniqueElementIds: <> */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { CalendarDate } from "../shared/Calendar";
import { Link, useNavigate } from "@tanstack/react-router";
import useCoursesStore from "@/stores/formations/courses.store";
import useSessionStore from "@/stores/formations/session.store";
// import { SelectValue } from "@radix-ui/react-select";
import i18n from "i18n";
import EntitySelect from "../shared/entity/SortedCombobox";

export default function Hero() {
	const { t } = useTranslation();
	return (
		<div className="absolute inset-0 top-[25%] lg:top-0 flex items-center justify-center p-4">
			<div className="flex gap-4 lg:gap-6 flex-col lg:flex-row">
				<div className="flex flex-col relative lg:-left-[12rem] lg:gap-4 xl:gap-8">
					<h1 className="lg:text-4xl font-bold max-w-xl">
						{t("pages.home.title")}
					</h1>
					<span className="text-foreground max-w-xl font-bold mt-4 lg:mt-0 text-xs lg:text-[16px]">
						{t("pages.home.description")}
					</span>
					<div className="flex w-full items-center gap-2 lg:gap-4 mt-4">
						<Link
							to="/courses"
							className="bg-primary cursor-pointer lg:w-md 2xl:w-xl flex justify-center items-center w-full text-xs lg:text-lg text-primary-foreground lg:font-medium px-4 py-2 rounded-md hover:bg-primary/90"
						>
							{t("pages.home.ctas.explore")}
						</Link>
					</div>
				</div>
				<HeroForm />
			</div>
		</div>
	);
}

export function HeroForm() {
	const { t } = useTranslation();

	const courseStore = useCoursesStore();
	const sessionStore = useSessionStore();
	const navigate = useNavigate();

	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [course, setCourse] = useState<string>();
	const [openSelect, setOpen] = useState(false);

	const computedSessions = useMemo(
		() =>
			sessionStore.allItems.filter((s) => {
				const date = new Date();
				const sessionDate = new Date(s.startDate);
				return sessionDate > date;
			}),
		[sessionStore.allItems],
	);
	const computedCourses = useMemo(() => courseStore.items, [courseStore.items]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		courseStore.fetchData();
		sessionStore.fetchAll();
	}, []);

	const courseEntries = computedCourses.map((c) => ({
		label: c.title,
		id: c.id as string,
	}));

	const onCourseSearch = async (q: string) => {
		await courseStore.fetchData({ search: q });
	};

	const onCourseSelected = (c: string) => {
		setCourse(c);
	};

	return (
		<form className="w-full lg:w-[30rem] flex flex-col rounded-md p-2 lg:p-4 shadow h-auto lg:h-[32rem] bg-card lg:absolute lg:right-[1rem] xl:right-[6rem] 2xl:right-[16rem] lg:top-1/5 2xl:top-1/4">
			<div className="w-full flex flex-col gap-1 mt-2 lg:mt-4">
				<span className="lg:text-lg font-bold relative left-3">
					{t("pages.home.form.formation.label")}
				</span>

				<EntitySelect
					entries={courseEntries}
					placeholder={t("pages.home.form.formation.placeholder")}
					onSearch={onCourseSearch}
					onSelected={onCourseSelected}
				/>
			</div>

			<div className="w-full flex flex-col gap-1 mt-2 lg:mt-4">
				<span className="lg:text-lg font-bold relative left-3">
					{t("pages.home.form.disposability.label")}
				</span>
				<Select
					open={openSelect}
					onOpenChange={(s) => setOpen(s)}
				>
					<SelectTrigger className="w-full px-3 py-2">
						<span>
							{currentDate.toLocaleDateString(i18n.language, {
								year: "numeric",
								month: "long",
								day: "numeric",
							}) ?? t("pages.home.form.disposability.placeholder")}
						</span>
					</SelectTrigger>
					<SelectContent>
						<CalendarDate
							date={currentDate}
							setDate={(date) => {
								setCurrentDate(date);
								setOpen((prev) => !prev);
							}}
						/>
					</SelectContent>
				</Select>
			</div>

			<button
				type="button"
				className="bg-primary w-full mt-4 lg:mt-auto cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-primary/90"
				onClick={(e) => {
					e.preventDefault();
					const session = computedSessions.find((s) => s.moduleId === course);
					if (session) {
						const sessionDate = new Date(session.startDate);
						if (sessionDate > currentDate) {
							navigate({
								to: "/courses/$courseId",
								params: { courseId: course as string },
							});
							return
						}
						navigate({ to: "/calendar" });
					}

					navigate({ to: "/courses" });
				}}
			>
				{t("pages.home.form.submit")}
			</button>
		</form>
	);
}

// interface CountrySelectorProps {
// 	code: string;
// 	flag: string;
// 	onClick: (country: { code: string; flag: string }) => void;
// }

// function CountrySelector({ code, flag, onClick }: CountrySelectorProps) {
// 	return (
// 		// biome-ignore lint/a11y/noStaticElementInteractions: Have to handle action on this component
// 		// biome-ignore lint/a11y/useKeyWithClickEvents: Have to handle action on this component
// 		<div
// 			className="w-full grid grid-cols-2 gap-2 mb-3 cursor-pointer"
// 			onClick={() => {
// 				onClick({ code, flag });
// 			}}
// 		>
// 			<span className="line-clamp-1 font-bold">{code}</span>
// 			<img
// 				src={flag}
// 				alt="country flag"
// 				className="w-[50%] h-8 object-cover rounded-md"
// 			/>
// 		</div>
// 	);
// }
