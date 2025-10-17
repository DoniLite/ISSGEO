import { Card, CardContent } from '@/components/ui/card';
import Layout from '../Layout';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function IndexPage() {
  const { me } = useAuthStore();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    me();
  }, []);

  const mocks: CardStatType[] = [
    {
      entityTitle: 'admin.formations.id',
      entityDescriptionKey: 'admin.formations.description',
    },
    {
      entityTitle: 'admin.contact.id',
      entityDescriptionKey: 'admin.contact.description',
    },
    {
      entityTitle: 'admin.testimonials.id',
      entityDescriptionKey: 'admin.testimonials.description',
    },
    {
      entityTitle: 'admin.users.id',
      entityDescriptionKey: 'admin.users.description',
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
        {mocks.map((m) => (
          <CardStatSection
            key={m.entityTitle}
            entityTitle={m.entityTitle}
            entityDescriptionKey={m.entityDescriptionKey}
          />
        ))}
      </section>
    </Layout>
  );
}

interface CardStatType {
  entityTitle: string;
  entityDescriptionKey: string;
}

function CardStatSection({ entityTitle, entityDescriptionKey }: CardStatType) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent>
        <div className='lg:my-8 my-4'>
          <h1 className='font-bold lg:text-4xl text-2xl text-primary dark:text-secondary'>
            {t(entityTitle)}
          </h1>
          <p className='text-muted-foreground line-clamp-2'>
            {t(entityDescriptionKey)}
          </p>
        </div>

        <div className='flex flex-wrap gap-4 lg:gap-8'>
          <div className='relative'>
            <div className='flex gap-1'>
              <h1 className='text-4xl lg:text-6xl font-bold'>350</h1>
              <h2 className='mt-auto'>Total</h2>
            </div>
            <ArrowRight className='w-4 h-4 absolute right-1 top-0' />
          </div>

          <div className='relative mt-auto'>
            <div className='flex gap-1'>
              <h1 className='text-2xl text-green-500 lg:text-4xl font-bold'>
                30%
              </h1>
            </div>
            <ArrowUpRight className='text-green-500 w-4 h-4 absolute -right-3 top-0 ml-3' />
          </div>

          <div className='relative mt-auto'>
            <div className='flex gap-1'>
              <h1 className='text-2xl text-red-500 lg:text-4xl font-bold'>
                50%
              </h1>
            </div>
            <ArrowDownRight className='text-red-500 w-4 h-4 absolute -right-3 top-0' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
