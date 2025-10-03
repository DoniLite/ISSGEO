import { useTranslation } from 'react-i18next';
import { GraduationCap, Database, BriefcaseBusiness } from 'lucide-react'; // Icônes

export default function AboutMainActivities() {
  const { t } = useTranslation();

  const activities = [
    {
      key: 'mission1',
      icon: GraduationCap,
    },
    {
      key: 'mission2',
      icon: Database,
    },
    {
      key: 'mission3',
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-3xl font-bold text-primary dark:text-secondary mb-4'>
          {t('about.mainActivity.sectionTitle')}
        </h2>
        <p className='max-w-3xl mx-auto text-muted-foreground mb-12'>
          {t('about.mainActivity.intro')}
        </p>

        <div className='grid md:grid-cols-3 gap-8'>
          {activities.map((activity) => (
            <div
              key={activity.key}
              className='flex flex-col items-center p-6 border rounded-lg shadow-sm'
            >
              <activity.icon className='w-12 h-12 text-indigo-500 mb-4' />
              <h3 className='text-xl font-semibold mb-2'>
                {t(`about.mainActivity.${activity.key}.title`)}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {t(`about.mainActivity.${activity.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <p className='max-w-4xl mx-auto text-lg mt-12 p-6 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md'>
          {t('about.mainActivity.conclusion')}
        </p>
      </div>
    </section>
  );
}
