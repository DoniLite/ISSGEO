import Hero from '@/components/services/Hero';
import BaseHeroWrapper from '@/components/shared/BasePageHeroWrapper';
import Footer from '@/components/shared/Footer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/team/join')({
  component: () => (
    <>
      <BaseHeroWrapper>
        <Hero />
      </BaseHeroWrapper>
      <Footer />
    </>
  ),
});
