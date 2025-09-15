import type { PropsWithChildren } from 'react';

export default function BaseHeroWrapper({ children }: PropsWithChildren) {
  return (
    <div className='relative w-full h-screen'>
      <div className='h-full w-full grid grid-cols-[90%_10%] lg:grid-cols-[70%_30%] -z-10'>
        <div className='w-full h-full bg-linear-to-tr from-primary/50 via-secondary to-primary'></div>
        <div className='w-full h-full bg-[url(../assets/coverv1.jpg)] bg-cover bg-center bg-no-repeat'></div>
      </div>
      {children}
    </div>
  );
}
