import { Badge } from '../ui/badge';

export default function Services() {
  return (
    <div>
      <div className='container mx-auto my-8 p-2 lg:p-4'>
        <Badge>Our Services</Badge>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Service items go here */}
        </div>
      </div>
    </div>
  );
}
