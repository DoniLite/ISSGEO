import { useTranslation } from 'react-i18next';
import Footer from '../shared/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { HelpCircle } from 'lucide-react';

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
      <div className='container mx-auto my-16 p-4'>
        <div className='text-center mb-12'>
          <HelpCircle className='w-12 h-12 text-primary mx-auto mb-4' />
          <h1 className='text-4xl font-extrabold mb-2'>
            {t('faq.sectionTitle')}
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            {t('faq.sectionDescription')}
          </p>
        </div>

        <div className='max-w-4xl mx-auto'>
          <Accordion type='single' collapsible className='w-full'>
            {faqItems.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className='text-lg font-semibold text-left hover:no-underline'>
                  {t(`faq.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className='text-gray-700 leading-relaxed'>
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
