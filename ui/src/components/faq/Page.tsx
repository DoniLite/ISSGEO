import { useTranslation } from 'react-i18next';
import Footer from '../shared/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import BaseHeroWrapper from '../shared/BasePageHeroWrapper';
import Hero from '../services/Hero';

export default function FaqPage() {
  const { t } = useTranslation();

  const faqItems = [
    'q1',
    'q2',
    'q3',
    'q4',
    'q5', // Clés de traduction à mapper
  ];

  return (
    <>
      <BaseHeroWrapper>
        <Hero
          titleKey='faq.sectionTitle'
          descriptionKey='faq.sectionDescription'
        />
      </BaseHeroWrapper>
      <div className='container mx-auto my-16 p-4'>
        <div className='max-w-4xl mx-auto'>
          <Accordion type='single' collapsible className='w-full'>
            {faqItems.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className='text-lg font-semibold text-left hover:no-underline'>
                  {t(`faq.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground leading-relaxed'>
                  {t(`faq.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <Footer />
    </>
  );
}
