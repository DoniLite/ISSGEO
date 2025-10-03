import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import CTAWithImage from '../shared/CtaWithImage';
import formationImg from '../../../assets/formation.jpeg'
import accImg from '../../../assets/accompagnement.jpeg'
import knowImg from '../../../assets/knowlage.jpeg'
import devImg from '../../../assets/development.jpeg'
import { Badge } from '../ui/badge';

export default function MissionSection() {
  const { t } = useTranslation();

  const missionsData = [
    {
      key: 'pillar_1',
      image: formationImg,
      reverse: false,
      link: '/formations',
    },
    {
      key: 'pillar_2',
      image: accImg,
      reverse: true,
      link: '/contact',
    },
    {
      key: 'pillar_3',
      image: knowImg,
      reverse: false,
      link: '/publications',
    },
    {
      key: 'pillar_4',
      image: devImg,
      reverse: true,
      link: '/recherche',
    },
  ];

  return (
    <div id='missions' className='container mx-auto my-16 p-4'>
      <Badge className='my-4'>{t('navBadge.missions')}</Badge>
      <h2 className='text-3xl lg:text-4xl font-extrabold text-center mb-12'>
        {t('missions.sectionTitle')}
      </h2>
      <div className='flex flex-col gap-24 lg:gap-36'>
        {missionsData.map((mission) => (
          <CTAWithImage
            key={mission.key}
            image={mission.image}
            title={`missions.${mission.key}.title`}
            subtitle={`missions.${mission.key}.subtitle`}
            description={`missions.${mission.key}.description`}
            reverse={mission.reverse}
          >
            <Button className='mt-4 w-fit' asChild>
              <Link to={mission.link}>
                {t(`missions.${mission.key}.cta`)}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CTAWithImage>
        ))}
      </div>
    </div>
  );
}
