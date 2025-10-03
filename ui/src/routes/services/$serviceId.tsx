import Hero from '@/components/services/Hero';
import Footer from '@/components/shared/Footer';
import { createFileRoute } from '@tanstack/react-router';
import BaseHeroWrapper from '@/components/shared/BasePageHeroWrapper';
import FormationContent from '@/components/services/Formation';
import PlacementContent from '@/components/services/Placement';
import RecruitmentContent from '@/components/services/Recruitment';

const serviceMap = {
  formations: {
    heroTitleKey: 'services.formation.page.hero.title',
    heroDescKey: 'services.formation.page.hero.desc',
    ContentComponent: FormationContent,
  },
  recruitment: {
    heroTitleKey: 'services.recruitment.page.hero.title',
    heroDescKey: 'services.recruitment.page.hero.desc',
    ContentComponent: RecruitmentContent,
  },
  placement: {
    heroTitleKey: 'services.placement.page.hero.title',
    heroDescKey: 'services.placement.page.hero.desc',
    ContentComponent: PlacementContent,
  },
};

export const Route = createFileRoute('/services/$serviceId')({
  component: ServicePage,
});

function ServicePage() {
  const { serviceId } = Route.useParams();
  const service = serviceMap[serviceId as keyof typeof serviceMap];

  if (!service) {
    return (
      <div className='container mx-auto my-16 text-center'>
        <h1 className='text-3xl font-bold'>Service Non Trouvé</h1>
        <p className='mt-2'>
          Désolé, le service que vous cherchez ({serviceId}) n'existe pas.
        </p>
      </div>
    );
  }

  const { heroTitleKey, heroDescKey, ContentComponent } = service;

  return (
    <>
      <BaseHeroWrapper>
        <Hero titleKey={heroTitleKey} descriptionKey={heroDescKey} />
      </BaseHeroWrapper>
      <div className='container mx-auto my-16 p-4'>
        <ContentComponent />
      </div>
      <Footer />
    </>
  );
}


