import type { ReactNode } from 'react';

export default function ServicesPage() {
  return <div className='container mx-auto p-4'></div>;
}

export interface PageServiceCardProps {
  title: ReactNode;
  icon: ReactNode;
  description: ReactNode;
  assets?: ReactNode;
  body: ReactNode;
}

export function PageServiceCard({
  title,
  icon,
  description,
  assets,
  body,
}: PageServiceCardProps) {
  return (
    <div className='w-full bg-card p-3 hover:ring flex flex-col'>
      <div className='w-full'>{icon}</div>
      <div className='w-full'>{title}</div>
      <div className='w-full'>{description}</div>
      <div className='w-full'>{assets}</div>
      <div className='w-full'>{body}</div>
    </div>
  );
}
