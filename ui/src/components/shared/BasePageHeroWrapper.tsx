import type { PropsWithChildren } from 'react';

export default function BaseHeroWrapper({ children }: PropsWithChildren) {
  return (
    <div className='relative w-full h-screen'>
      <div className='h-full w-full -z-10'>
        <div className='w-full h-full bg-linear-to-tr from-primary/50 via-secondary to-primary'></div>
      </div>
      {children}
    </div>
  );
}
