import { Link } from "@tanstack/react-router";
import i18n from "i18n";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_SESSIONS, MOCK_TRAININGS } from "@/lib/mock";
import Hero from "../services/Hero";
import BaseHeroWrapper from "../shared/BasePageHeroWrapper";
import Footer from "../shared/Footer";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function TrainingCalendar() {
	const { t } = useTranslation();

	const sessionsWithDetails = useMemo(() => {
		// Jointure des sessions avec les détails de la formation correspondante
		return MOCK_SESSIONS.map((session) => ({
			...session,
			training: MOCK_TRAININGS.find((t) => t.id === session.moduleId),
			startDateObj: new Date(session.startDate),
		}))
			.filter(
				(session) => session.training && session.startDateObj >= new Date(),
			) // Filtrer les sessions futures
			.sort((a, b) => a.startDateObj.getTime() - b.startDateObj.getTime()); // Trier par date croissante
	}, []);

	return (
		<>
			<BaseHeroWrapper>
				<Hero
					titleKey="pages.calendar.title"
					descriptionKey="pages.calendar.desc"
				/>
			</BaseHeroWrapper>
			<div className="container mx-auto my-12 p-4">
				<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
					{t("pages.calendar.nextSessions")}
					<Calendar className="w-8 h-8 text-primary dark:text-secondary" />
				</h2>

				<div className="space-y-6">
					{sessionsWithDetails.length > 0 ? (
						sessionsWithDetails.map((session) => (
							<Card
								key={session.id}
								className="hover:ring-2 ring-primary/50 transition-all"
							>
								<CardHeader>
									<CardTitle className="text-2xl text-blue-800">
										{session.training?.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid md:grid-cols-3 gap-4 mb-4">
										<div className="flex items-center text-lg">
											<Clock className="w-5 h-5 mr-3 text-green-600" />
											<span className="font-semibold">
												{t("pages.calendar.startDate")}
											</span>
											<span className="ml-2">
												{session.startDateObj.toLocaleDateString(
													i18n.language,
													{ year: "numeric", month: "long", day: "numeric" },
												)}
											</span>
										</div>
										<div className="flex items-center text-lg">
											<MapPin className="w-5 h-5 mr-3 text-red-600" />
											<span className="font-semibold">
												{t("pages.calendar.location")}
											</span>
											<span className="ml-2">{session.location}</span>
										</div>
										<div className="flex items-center text-lg">
											<Users className="w-5 h-5 mr-3 text-purple-600" />
											<span className="font-semibold">Durée:</span>
											<span className="ml-2">
												{session.training?.duration}h
											</span>
										</div>
									</div>
									<Button asChild className="mt-3">
										<Link
											to={`/courses/$courseId`}
											params={{ courseId: session.moduleId }}
										>
											{t("pages.calendar.viewSession")}{" "}
											<ArrowRight className="w-4 h-4 ml-2" />
										</Link>
									</Button>
								</CardContent>
							</Card>
						))
					) : (
						<div className="text-center py-10">
							<p className="text-xl text-muted-foreground">
								Aucune session à venir n'est planifiée pour le moment.
							</p>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}
