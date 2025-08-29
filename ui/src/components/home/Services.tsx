import { Link } from '@tanstack/react-router';
import { Badge } from '../ui/badge';
import { Card, CardDescription, CardTitle } from '../ui/card';
import type { ReactNode } from 'react';
import { SchoolIcon, SquareArrowOutUpRight } from 'lucide-react';

export default function Services() {
  return (
    <div>
      <div className='container mx-auto my-8 p-2 lg:p-4'>
        <Badge id='services'>Our Services</Badge>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4'>
          {services.map((s) => (
            <ServiceCard {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ServiceProps {
  title: string | ReactNode;
  desc: string | ReactNode;
  link: string;
}

function ServiceCard({ title, desc, link }: ServiceProps) {
  return (
    <Link to={link}>
      <Card className='p-2 lg:p-4 min-h-[15rem] flex flex-col hover:ring transition-all'>
        <CardTitle className='w-full h-[10%]'>{title}</CardTitle>
        <CardDescription className='pt-2 w-full h-[80%]'>{desc}</CardDescription>
      </Card>
    </Link>
  );
}

const services: ServiceProps[] = [
  {
    title: (
      <div className='flex gap-2 items-center'>
        <SchoolIcon className='text-lg' />
        <h1 className='lg:text-xl font-bold'>Formation</h1>
      </div>
    ),
    desc: (
      <span className='d'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        suscipit rem fuga magni ea. Atque quia exercitationem eligendi ipsum
        eos. Expedita perspiciatis, distinctio ipsum adipisci voluptatibus
        maxime nulla itaque impedit dolorem! Voluptas iusto deserunt id, placeat
        cumque qui ratione voluptatibus aut quas perferendis repudiandae minima,
        debitis ea quibusdam eius unde, quasi veritatis reprehenderit harum
        commodi nam. Dolorum voluptatem nesciunt sit dignissimos. Quo voluptates
        deleniti tempore, officiis a rerum. Aliquam, beatae!
      </span>
    ),
    link: '/formations',
  },
  {
    title: (
      <div className='flex gap-2 items-center'>
        <SquareArrowOutUpRight className='text-lg' />
        <h1 className='lg:text-xl font-bold'>Certification</h1>
      </div>
    ),
    desc: (
      <span className=''>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam
        exercitationem in, dolores nisi velit cupiditate dolorum nam dignissimos
        odit nulla?
      </span>
    ),
    link: '/certification',
  },
];
