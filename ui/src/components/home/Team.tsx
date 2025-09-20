import { Link } from '@tanstack/react-router';
import { Slider } from '../shared/Slider';
import { Badge } from '../ui/badge';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Team() {
  const { t } = useTranslation();
  return (
    <div className='w-full bg-primary py-12 text-primary-foreground my-8 lg:my-[8rem]'>
      <div className='container mx-auto p-2 lg:p-4'>
        <Badge className='my-2 bg-secondary text-secondary-foreground'>
          {t('navBadge.team')}
        </Badge>
        <div className='w-full flex flex-col lg:flex-row lg:items-center gap-4'>
          <div className='w-full lg:w-[40%] xl:w-[55%]'>
            <h1 className='text-lg lg:text-3xl font-bold mb-4 lg:mb-0 lg:mr-8'>
              Meet the Team Behind Our Success
            </h1>
            <p className='text-muted-foreground font-bold w-full lg:w-[90%]'>
              Our team is composed of dedicated professionals committed to
              delivering excellence and innovation in everything we do.
            </p>
            <Link
              to='/'
              className='mt-4 text-sm bg-primary-foreground py-3 px-4 hover:bg-primary-foreground/90 font-bold w-full lg:w-[60%] rounded-[4px] flex justify-center text-primary'
            >
              Join Our Team
            </Link>
          </div>
          <div className='w-[70%] md:w-[80%] xl:w-[45%] mt-8 lg:mt-0 flex mx-auto justify-center'>
            <Slider
              items={teamMembers.map((member) => (
                <TeamMemberCard {...member} />
              ))}
              iconsVariants={{ next: 'ghost', prev: 'ghost' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeamMemberCardProps {
  name: string;
  title: string;
  socials: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  image: string;
}

function TeamMemberCard({
  name,
  title,
  socials,
  image,
}: TeamMemberCardProps) {
  return (
    <div className='p-2 flex flex-col justify-center items-center'>
      <img
        src={image}
        alt='Team'
        className='w-[7rem] h-[7rem] rounded-full shadow object-cover'
      />
      <h2 className='text-lg font-bold'>{name}</h2>
      <span className='text-sm font-semibold text-muted-foreground'>
        {title}
      </span>
      <div className='w-full flex gap-2 justify-center'>
        {socials.facebook && (
          <a
            href={socials.facebook}
            target='_blank'
            rel='noreferrer'
            className='p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all'
          >
            <Facebook className='w-5 h-5 text-primary' />
          </a>
        )}
        {socials.twitter && (
          <a
            href={socials.twitter}
            target='_blank'
            rel='noreferrer'
            className='p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all'
          >
            <Twitter className='w-5 h-5 text-primary' />
          </a>
        )}
        {socials.instagram && (
          <a
            href={socials.instagram}
            target='_blank'
            rel='noreferrer'
            className='p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all'
          >
            <Instagram className='w-5 h-5 text-primary' />
          </a>
        )}
        {socials.linkedin && (
          <a
            href={socials.linkedin}
            target='_blank'
            rel='noreferrer'
            className='p-2 rounded-full bg-primary-foreground flex justify-center items-center hover:bg-primary-foreground/80 transition-all'
          >
            <Linkedin className='w-5 h-5 text-primary' />
          </a>
        )}
      </div>
    </div>
  );
}

const teamMembers = [
  {
    name: 'Alice Johnson',
    title: 'CEO',
    socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    name: 'Bob Smith',
    title: 'CTO',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Driving technological innovation and excellence.',
    socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  },
  {
    name: 'Catherine Lee',
    title: 'CFO',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Driving financial strategy and growth.',
    socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  },
  {
    name: 'Catherine Lee',
    title: 'CFO',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Managing financial strategies and growth.',
    socials: { facebook: '#',  linkedin: '#' },
  },
  {
    name: 'David Brown',
    title: 'COO',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Ensuring operational efficiency and effectiveness.',
    socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  },
];

