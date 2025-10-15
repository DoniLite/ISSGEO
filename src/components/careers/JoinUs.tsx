import { Link } from "@tanstack/react-router";
import {
	Briefcase,
	Building2,
	Handshake,
	Lightbulb,
	Mail,
	Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { MOCK_JOB_OFFERS } from "@/lib/mock";
import Hero from "../services/Hero";
import BaseHeroWrapper from "../shared/BasePageHeroWrapper";
import Footer from "../shared/Footer";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

function WhyJoinCard({
	titleKey,
	descKey,
	Icon,
}: {
	titleKey: string;
	descKey: string;
	Icon: React.ElementType;
}) {
	const { t } = useTranslation();
	return (
		<Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
			<div className="flex justify-center mb-4">
				<Icon className="w-10 h-10 text-blue-600" />
			</div>
			<h3 className="text-xl font-bold mb-2">{t(titleKey)}</h3>
			<p className="text-sm text-muted-foreground">{t(descKey)}</p>
		</Card>
	);
}

export default function JoinUsPage() {
	const { t } = useTranslation();

	const advantages = [
		{ key: "point1", Icon: Zap },
		{ key: "point2", Icon: Lightbulb },
		{ key: "point3", Icon: Handshake },
	];

	return (
		<>
			<BaseHeroWrapper>
				<Hero
					titleKey="careers.hero.title"
					descriptionKey="careers.hero.description"
				/>
			</BaseHeroWrapper>

			<div className="container mx-auto my-16 p-4">
				{/* Section Pourquoi Nous Rejoindre */}
				<section className="mb-16">
					<h2 className="text-3xl font-extrabold text-center text-primary mb-10">
						{t("careers.whyJoin.title")}
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{advantages.map((adv) => (
							<WhyJoinCard
								key={adv.key}
								titleKey={`careers.whyJoin.${adv.key}.subtitle`}
								descKey={`careers.whyJoin.${adv.key}.desc`}
								Icon={adv.Icon}
							/>
						))}
					</div>
				</section>

				{/* Section Offres d'Emploi */}
				<section className="mb-16">
					<h2 className="text-3xl font-extrabold text-center text-primary mb-10">
						{t("careers.positions.sectionTitle")}
					</h2>

					{MOCK_JOB_OFFERS.length > 0 ? (
						<div className="max-w-4xl mx-auto space-y-4">
							{MOCK_JOB_OFFERS.map((offer) => (
								<Card
									key={offer.id}
									className="p-6 flex justify-between items-center hover:shadow-lg transition-shadow"
								>
									<div>
										<h3 className="text-xl font-semibold text-gray-800">
											{offer.title}
										</h3>
										<div className="flex gap-4 text-sm text-muted-foreground mt-1">
											<span className="flex items-center">
												<Briefcase className="w-4 h-4 mr-1" /> {offer.contract}
											</span>
											<span className="flex items-center">
												<Building2 className="w-4 h-4 mr-1" /> {offer.location}
											</span>
										</div>
									</div>
									{/* <Button asChild>
                    <Link to={`/careers/${offer.id}`}>
                      {t('careers.positions.cta')}
                    </Link>
                  </Button> */}
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-10 border border-dashed rounded-lg max-w-2xl mx-auto">
							<p className="text-xl text-muted-foreground">
								{t("careers.positions.noOffers")}
							</p>
						</div>
					)}
				</section>

				{/* Section Candidature Spontanée */}
				<section className="bg-green-50 p-8 rounded-xl max-w-4xl mx-auto text-center border-l-4 border-green-500">
					<Mail className="w-10 h-10 text-green-600 mx-auto mb-4" />
					<h3 className="text-2xl font-bold text-green-800 mb-3">
						{t("careers.spontaneous.title")}
					</h3>
					<p className="text-gray-700 mb-6">{t("careers.spontaneous.desc")}</p>
					<Button variant="secondary" className="text-lg px-8 py-6" asChild>
						<Link to="/" hash="contact">
							{t("careers.spontaneous.cta")}
						</Link>
					</Button>
				</section>
			</div>

			<Footer />
		</>
	);
}
