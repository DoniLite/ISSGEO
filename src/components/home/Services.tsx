import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Briefcase, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardTitle } from "../ui/card";

interface ServiceProps {
	titleKey: string;
	descKey: string;
	link: string;
	Icon: LucideIcon;
}

export default function Services() {
	const { t } = useTranslation();
	return (
		<div
			id="services"
			className="container relative mt-[30%] mx-auto my-8 p-2 lg:p-4 lg:my-[8rem]"
		>
			<Badge id="services">{t("navBadge.services")}</Badge>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
				{services.map((s) => (
					<ServiceCard
						title={t(s.titleKey)}
						desc={t(s.descKey)}
						link={s.link}
						Icon={s.Icon}
						key={s.link}
					/>
				))}
			</div>
		</div>
	);
}

interface ServiceCardProps {
	title: string;
	desc: string;
	link: string;
	Icon: LucideIcon;
}

function ServiceCard({ title, desc, link, Icon }: ServiceCardProps) {
	return (
		<Link to={link}>
			<Card className="p-2 lg:p-4 min-h-[15rem] flex flex-col hover:ring transition-all">
				<CardTitle className="w-full h-[10%]">
					<div className="flex gap-2 items-center">
						<Icon className="text-xl" />
						<h1 className="lg:text-xl font-bold">{title}</h1>
					</div>
				</CardTitle>
				<CardDescription className="pt-2 w-full h-[80%]">
					{desc}
				</CardDescription>
			</Card>
		</Link>
	);
}

const services: ServiceProps[] = [
	{
		titleKey: "services.formation.title",
		descKey: "services.formation.desc",
		link: "/services/formations",
		Icon: BookOpen,
	},
	{
		titleKey: "services.recruitment.title",
		descKey: "services.recruitment.desc",
		link: "/services/recruitment",
		Icon: UserCheck,
	},
	{
		titleKey: "services.placement.title",
		descKey: "services.placement.desc",
		link: "/services/placement",
		Icon: Briefcase,
	},
];
