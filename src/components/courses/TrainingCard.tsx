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
import { MOCK_THEMATICS } from "@/lib/mock";
import type { TrainingModule } from "@/lib/types";

interface TrainingCardProps {
	training: TrainingModule;
}

export default function TrainingCard({ training }: TrainingCardProps) {
	const { t } = useTranslation();
	const thematic = MOCK_THEMATICS.find((t) => t.name === training.thematic);

	return (
		<Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex flex-col  gap-2">
					<CardTitle className="text-lg">
						<span className="text-wrap">{t(training.title)}</span>
					</CardTitle>
					<Badge variant="secondary">
						<span className="text-wrap">
							{thematic ? thematic.name : t("them.unknown")}
						</span>
					</Badge>
				</div>
				<CardDescription className="min-h-[3rem] pt-2">
					{t(training.description)}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex-grow">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="flex items-center text-muted-foreground">
						<Clock className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.duration")} {training.duration}h
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<DollarSign className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.priceRange")} {training.priceMin}-
							{training.priceMax}€
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<Users className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.participants")} {training.participants}+
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<Zap className="w-4 h-4 mr-2 text-primary dark:text-secondary" />
						<span>
							{t("pages.formations.enrolled")} {training.enrolled}
						</span>
					</div>
				</div>
				<div className="mt-4">
					<h4 className="text-sm font-semibold mb-1">Compétences Clés:</h4>
					<div className="flex flex-wrap gap-1">
						{training.detailedModules.slice(0, 3).map((key) => (
							<Badge key={key} variant="outline" className="text-xs">
								{key}
							</Badge>
						))}
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button asChild className="w-full">
					<Link to={`/courses/$courseId`} params={{ courseId: training.id }}>
						{t("pages.formations.viewDetails")}
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
