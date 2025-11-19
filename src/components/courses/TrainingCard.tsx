import { Link } from "@tanstack/react-router";
import { Clock, DollarSign, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type {
	KeyCompetencyTableType,
	ModuleTableType,
	ThematicTableType,
	TrainingTableType,
} from "@/db";

interface TrainingCardProps {
	training: TrainingTableType & {
		modules: ModuleTableType[];
		competencies: KeyCompetencyTableType[];
		thematic?: ThematicTableType;
	};
}

export default function TrainingCard({ training }: TrainingCardProps) {
	const { t } = useTranslation();

	return (
		<Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex flex-col  gap-2">
					<CardTitle className="text-lg">
						<span className="text-wrap">{t(training.title)}</span>
					</CardTitle>
					<Badge variant="secondary">
						<span className="text-wrap">{training.thematic?.name}</span>
					</Badge>
				</div>
				<CardDescription className="min-h-[3rem] pt-2">
					{training.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex-grow">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center text-muted-foreground">
						<Clock className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.duration")} : {training.totalDuration}h
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<DollarSign className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.priceRange")} : {training.priceMin}-
							{training.priceMax}$
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<Users className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.participants")} : {training.participants}+
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<Zap className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.enrolled")} : {training.enrolled}
						</span>
					</div>
				</div>
				<div className="mt-4">
					<h4 className="text-sm font-semibold mb-1">
						{t("pages.formations.keyCompetencies")} :
					</h4>
					<div className="flex flex-wrap gap-1">
						{training.competencies.map((key) => (
							<Badge key={key.id} variant="outline" className="text-xs">
								{key.title}
							</Badge>
						))}
					</div>
				</div>

				<div className="mt-4">
					<h4 className="text-sm font-semibold mb-1">
						{t("pages.formations.modules")} :
					</h4>
					<div className="flex flex-col gap-1">
						{training.modules.map((mod) => (
							<div key={mod.id} className="w-full py-3">
								<h2 className="font-bold">{mod.title}</h2>
								<div className="w-full flex gap-4 mt-2">
									<Badge variant={"destructive"}>{mod.duration}H</Badge>
									<Badge variant={"secondary"}>{mod.price}FCFA</Badge>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button asChild className="w-full">
					<Link
						to={`/courses/$courseId`}
						params={{ courseId: training.id as string }}
					>
						{t("pages.formations.viewDetails")}
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
