import { Card, CardContent } from '@/components/ui/card';
import Layout from '../Layout';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EntityStatistics } from '@/core/base.repository';
import useUsersStore from '@/stores/users.store';
import useCoursesStore from '@/stores/formations/courses.store';
import useTestimonialStore from '@/stores/testimonials.store';
import useContactStore from '@/stores/contact.store';

export default function IndexPage() {
  const { me } = useAuthStore();
  const userStore = useUsersStore();
  const courseStore = useCoursesStore();
  const testimonialsStore = useTestimonialStore();
  const contactStore = useContactStore();

  const [userStats, setUserStats] = useState<EntityStatistics>();
  const [courseStats, setCourseStats] = useState<EntityStatistics>();
  const [testimonialsStats, setTestimonialsStats] =
    useState<EntityStatistics>();
  const [contactStats, setContactStats] = useState<EntityStatistics>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    me();
    userStore.stats().then((s) => setUserStats(s));
    courseStore.stats().then((s) => setCourseStats(s));
    testimonialsStore.stats().then((s) => setTestimonialsStats(s));
    contactStore.stats().then((s) => setContactStats(s));
  }, []);

  const computedUserStats = useMemo(() => userStats, [userStats]);
  const computedCourseStats = useMemo(() => courseStats, [courseStats]);
  const computedTestimonialsStats = useMemo(
    () => testimonialsStats,
    [testimonialsStats]
  );
  const computedContactStats = useMemo(() => contactStats, [contactStats]);

  const base: CardStatType[] = [
    {
      entityTitle: 'admin.formations.id',
      entityDescriptionKey: 'admin.formations.description',
      data: computedCourseStats || ({} as EntityStatistics),
    },
    {
      entityTitle: 'admin.contact.id',
      entityDescriptionKey: 'admin.contact.description',
      data: computedContactStats || ({} as EntityStatistics),
    },
    {
      entityTitle: 'admin.testimonials.id',
      entityDescriptionKey: 'admin.testimonials.description',
      data: computedTestimonialsStats || ({} as EntityStatistics),
    },
    {
      entityTitle: 'admin.users.id',
      entityDescriptionKey: 'admin.users.description',
      data: computedUserStats || ({} as EntityStatistics),
    },
  ];

  return (
    <Layout>
      <div className='w-full'>
        <h1 className='lg:my-8 my-4 font-bold text-3xl lg:text-4xl'>
          Welcome Admin
        </h1>
      </div>

      <section className='my-8 w-full grid gap-8 lg:gap-12'>
        {base.map((m) => (
          <CardStatSection
            key={m.entityTitle}
            entityTitle={m.entityTitle}
            entityDescriptionKey={m.entityDescriptionKey}
            data={m.data}
          />
        ))}
      </section>
    </Layout>
  );
}

interface CardStatType {
  entityTitle: string;
  entityDescriptionKey: string;
  data: EntityStatistics;
}

export function CardStatSection({
  entityTitle,
  entityDescriptionKey,
  data,
}: CardStatType) {
  const { t } = useTranslation();

  const renderStatCard = (
    label: string,
    stat?: EntityStatistics[keyof EntityStatistics]
  ) => {
    if (!stat) {
      return
    }
    const positive = stat.growthPercentage >= 0;
    const Icon = positive ? ArrowUpRight : ArrowDownRight;
    const color = positive ? 'text-green-500' : 'text-red-500';
    const trendText = positive ? 'Up' : 'Down';

    return (
      <Card className='w-full sm:w-[30%] transition-all hover:scale-[1.02]'>
        <CardContent className='py-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-lg font-semibold capitalize'>{label}</h2>
              <p className='text-sm text-muted-foreground'>
                {stat.current.period}
              </p>
            </div>
            <Calendar className='w-4 h-4 text-muted-foreground' />
          </div>

          <div className='mt-4'>
            <h3 className='text-4xl font-bold'>{stat.current.count}</h3>
            <p className='text-sm text-muted-foreground'>
              {t('Compared to')} {stat.previous.period}
            </p>
          </div>

          <div className={`flex items-center mt-3 ${color} gap-1`}>
            <Icon className='w-4 h-4 animate-pulse' />
            <span className='text-lg font-semibold'>
              {Math.abs(stat.growthPercentage)}%
            </span>
            <span className='text-sm'>{trendText}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardContent>
        <div className='lg:my-8 my-4 flex items-center justify-between'>
          <div>
            <h1 className='font-bold lg:text-4xl text-2xl text-primary dark:text-secondary'>
              {t(entityTitle)}
            </h1>
            <p className='text-muted-foreground line-clamp-2'>
              {t(entityDescriptionKey)}
            </p>
          </div>
          <BarChart3 className='w-6 h-6 text-primary dark:text-secondary' />
        </div>

        <div className='flex flex-wrap justify-between gap-4 mt-6'>
          {renderStatCard(t('common.monthly'), data.monthly)}
          {renderStatCard(t('common.weekly'), data.weekly)}
          {renderStatCard(t('common.yearly'), data.yearly)}
        </div>
      </CardContent>
    </Card>
  );
}
