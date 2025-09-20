import { useTranslation } from 'react-i18next';
import { AnimatedSlider } from '../shared/Slider';
import { Badge } from '../ui/badge';
import Container from './Container';

export default function Testimonials() {
  const { t } = useTranslation();
  return (
    <Container>
      <div className='container mx-auto p-2 lg:p-4'>
        <div className='w-full flex'>
          <Badge className='my-4 ml-auto'>{t('navBadge.testimonials')}</Badge>
        </div>
        <div className='w-full flex flex-col lg:flex-row gap-4'>
          <div className='w-[70%] md:w-[80%] xl:w-[55%] mt-8 lg:mt-0 flex mx-auto'>
            <AnimatedSlider
              items={mockTestimonials.map((t) => (
                <TestimonialsCard {...t} />
              ))}
              showNavigation={false}
            />
          </div>
          <div>
            <h1 className='text-lg font-bold lg:text-3xl'>
              What Our Clients Say
            </h1>
            <p className="text-muted-foreground text-sm font-bold">
              At most +{mockTestimonials.length} clients are using our services you can become one of them now
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

interface TestimonialsCardProps {
  name: string;
  text: string;
}

function TestimonialsCard({ name, text }: TestimonialsCardProps) {
  return (
    <div className='p-4 border rounded-md'>
      <p className='text-sm line-clamp-5'>{text}</p>
      <span className='text-xs text-muted-foreground'>- {name}</span>
    </div>
  );
}

const mockTestimonials: TestimonialsCardProps[] = [
  {
    name: 'Aïcha Diallo',
    text: "Grâce à cette plateforme, j'ai pu lancer mon premier site web en moins d'une semaine. L'expérience utilisateur est incroyable !",
  },
  {
    name: 'Jean-Baptiste Kouassi',
    text: 'Simple, rapide et efficace. Je recommande à tous ceux qui veulent créer des projets sans se prendre la tête.',
  },
  {
    name: 'Mariam Traoré',
    text: "Le support est super réactif. Ils m'ont aidée à configurer mon projet en un temps record.",
  },
  {
    name: 'Ousmane Sow',
    text: 'En tant que développeur freelance, cette solution m’a fait gagner énormément de temps et m’a permis d’attirer de nouveaux clients.',
  },
  {
    name: 'Fatoumata Koné',
    text: 'J’adore la simplicité et le design de l’interface. Tout est clair et bien organisé.',
  },
];
