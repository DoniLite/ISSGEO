import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';

interface MobileLinkDetailsProps {
  title: string;
  links: readonly {
    readonly title: string;
    readonly description: string;
    readonly href: string;
  }[];
}

export default function MobileNavDetails({
  title,
  links,
}: MobileLinkDetailsProps) {
  return (
    <details className='group'>
      <summary className='hover:bg-muted/50 cursor-pointer rounded-lg transition-colors outline-none'>
        <div className='flex items-center justify-between'>
          <span className='font-bold'>{title}</span>
          <ChevronDown className='text-muted-foreground h-5 w-5 transition-transform duration-200 group-open:rotate-180' />
        </div>
      </summary>

      <div className='flex w-full flex-col gap-3 relative left-3 top-3 mb-3'>
        {links.map((link) => (
          <Link key={link.title} to={link.href} className='font-bold'>
            {link.title}
          </Link>
        ))}
      </div>
    </details>
  );
}
