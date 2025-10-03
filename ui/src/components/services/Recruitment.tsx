import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Search, Award, Handshake, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RecruitmentContent() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Search,
      title: t('services.recruitment.page.steps.searchTitle'),
      desc: t('services.recruitment.page.steps.searchDesc'),
    },
    {
      icon: Award,
      title: t('services.recruitment.page.steps.certifTitle'),
      desc: t('services.recruitment.page.steps.certifDesc'),
    },
    {
      icon: Handshake,
      title: t('services.recruitment.page.steps.matchTitle'),
      desc: t('services.recruitment.page.steps.matchDesc'),
    },
  ];

  return (
    <div className='text-center'>
      <h2 className='text-3xl font-bold mb-4 text-primary'>
        {t('services.recruitment.page.sectionTitle')}
      </h2>
      <p className='max-w-3xl mx-auto text-muted-foreground mb-12'>
        {t('services.recruitment.page.introText')}
      </p>

      <div className='grid md:grid-cols-3 gap-8'>
        {steps.map((step, index) => (
          <Card
            key={step.title}
            className='p-6 text-left bg-gray-50 border-l-4 border-primary'
          >
            <div className='flex items-center gap-4 mb-4'>
              <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary'>
                {index + 1}
              </div>
              <h3 className='text-xl font-semibold'>{step.title}</h3>
            </div>
            <p className='text-sm text-muted-foreground'>{step.desc}</p>
          </Card>
        ))}
      </div>
      <Button variant='secondary' className='mt-12 text-lg px-8 py-6' asChild>
        <Link to='/'>
          <UserCheck className='mr-2 h-5 w-5' />
          {t('services.recruitment.page.cta')}
        </Link>
      </Button>
    </div>
  );
}
