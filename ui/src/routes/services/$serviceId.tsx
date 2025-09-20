import Hero from '@/components/services/Hero';
import Footer from '@/components/shared/Footer';
import { createFileRoute } from '@tanstack/react-router';
import BaseHeroWrapper from '@/components/shared/BasePageHeroWrapper';


export const Route = createFileRoute('/services/$serviceId')({
  component: () => (
    <>
      <BaseHeroWrapper>
        <Hero />
      </BaseHeroWrapper>
      <div className='container mx-auto my-8 p-4 flex flex-col items-center'></div>
      <Footer />
    </>
  ),
});
