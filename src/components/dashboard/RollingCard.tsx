import type { ModuleTableType, RollingTableType } from "@/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface RollingCardProps {
	rolling: RollingTableType & { modules: ModuleTableType[] };
}

export default function RollingCard({ rolling }: RollingCardProps) {
	const { t } = useTranslation();
	return (
		<Card className="w-full rounded-xl shadow-sm border border-border bg-card/80 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-xl font-semibold flex items-center gap-3">
					{rolling.name}

					{rolling.country && (
						<Badge
							variant="outline"
							className="px-2 py-0.5 text-xs bg-muted text-muted-foreground"
						>
							{rolling.country}
						</Badge>
					)}
				</CardTitle>

				<div className="text-sm text-muted-foreground leading-6">
					<p>
						<span className="font-medium mr-3">{t("admin.contact.id")}:</span>
						{rolling.contact}
					</p>
					{rolling.profession && (
						<p>
							<span className="font-medium mr-3">
								{t("pages.rolling.profession")}:
							</span>
							{rolling.profession}
						</p>
					)}
					{rolling.schoolLevel && (
						<p>
							<span className="font-medium mr-3">
								{t("pages.rolling.schoolLevel")}:
							</span>
							{rolling.schoolLevel}
						</p>
					)}
					{rolling.experience && (
						<p>
							<span className="font-medium mr-3">
								{t("pages.rolling.experience")}:
							</span>
							{rolling.experience}
						</p>
					)}
				</div>
			</CardHeader>

			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="modules">
						<AccordionTrigger className="text-base font-medium">
							{t("pages.rolling.module")} ({rolling.modules.length})
						</AccordionTrigger>

						<AccordionContent>
							<div className="flex flex-col gap-3 mt-2">
								{rolling.modules.map((module) => (
									<div
										key={module.id}
										className="flex items-center justify-between rounded-lg border p-3 bg-muted/40"
									>
										<div>
											<p className="font-medium">{module.title}</p>
											<p className="text-xs text-muted-foreground">
												{t("pages.rolling.duration")} : {module.duration}h
											</p>
										</div>

										<p className="font-semibold text-primary dark:text-secondary">
											{module.price.toLocaleString()} CFA
										</p>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</CardContent>
		</Card>
	);
}
