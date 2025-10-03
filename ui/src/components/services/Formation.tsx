import { CheckCircle, BarChart3, Users, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import Testimonials from "../home/Testimonials";
import CTAWithImage from "../shared/CtaWithImage";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import academic_hub from '../../../assets/academic_hub.jpeg';
import your_target from '../../../assets/get_your_targets.jpeg';
import grow_idea from '../../../assets/grow_idea.jpeg';
import { Link } from "@tanstack/react-router";

export default function FormationContent() {
  const { t } = useTranslation();

  const advantages = [
    {
      icon: CheckCircle,
      title: t('services.formation.page.advantages.certifTitle'),
      desc: t('services.formation.page.advantages.certifDesc'),
    },
    {
      icon: BarChart3,
      title: t('services.formation.page.advantages.careerTitle'),
      desc: t('services.formation.page.advantages.careerDesc'),
    },
    {
      icon: Users,
      title: t('services.formation.page.advantages.expertTitle'),
      desc: t('services.formation.page.advantages.expertDesc'),
    },
  ];

  const extendedInformation = [
    {
      title: 'services.formation.page.extended_information.academic_hub.title',
      subtitle:
        'services.formation.page.extended_information.academic_hub.subtitle',
      description:
        'services.formation.page.extended_information.academic_hub.description',
      image: academic_hub,
    },
    {
      title:
        'services.formation.page.extended_information.get_your_target.title',
      subtitle:
        'services.formation.page.extended_information.get_your_target.subtitle',
      description:
        'services.formation.page.extended_information.get_your_target.description',
      image: your_target,
      reverse: true,
    },
    {
      title:
        'services.formation.page.extended_information.grow_your_idea.title',
      subtitle:
        'services.formation.page.extended_information.grow_your_idea.subtitle',
      description:
        'services.formation.page.extended_information.grow_your_idea.description',
      image: grow_idea,
    },
  ];

  return (
    <div className='text-center'>
      <h2 className='text-3xl font-bold mb-4 text-primary dark:text-secondary'>
        {t('services.formation.page.sectionTitle')}
      </h2>
      <p className='max-w-3xl mx-auto text-muted-foreground mb-12'>
        {t('services.formation.page.introText')}
      </p>

      <div className='grid md:grid-cols-3 gap-8'>
        {advantages.map((adv) => (
          <Card
            key={adv.title}
            className='p-6 text-left hover:shadow-lg transition-shadow'
          >
            <adv.icon className='w-8 h-8 text-blue-500 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>{adv.title}</h3>
            <p className='text-sm text-muted-foreground'>{adv.desc}</p>
          </Card>
        ))}
      </div>
      <Button
        className='mt-12 text-lg px-8 py-6 w-full lg:w-[50%] mx-auto'
        asChild
      >
        <Link to='/'>
          <BookOpen className='mr-2 h-5 w-5' />
          {t('services.formation.page.cta')}
        </Link>
      </Button>

      <div className='w-full flex flex-col gap-24 lg:gap-36 my-24'>
        {extendedInformation.map((e) => (
          <CTAWithImage
            key={e.title}
            title={e.title}
            subtitle={e.subtitle}
            image={e.image}
            description={e.description}
            reverse={e.reverse}
          />
        ))}
      </div>

      <Testimonials />
    </div>
  );
}
