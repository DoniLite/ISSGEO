import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => (
    <div className='relative w-full mx-auto h-screen -z-10'>
      <div className='h-full w-full grid grid-cols-[70%_30%]'>
        <div className='w-full h-full bg-linear-to-tr from-primary/50 via-secondary to-primary'></div>
        <div className='w-full h-full bg-[url(../assets/coverv1.jpg)] bg-cover bg-center bg-no-repeat'></div>
      </div>
      <h1 className='absolute inset-0 flex items-center justify-center text-white text-4xl font-bold'>
        Welcome to ISSGEO
      </h1>
    </div>
  ),
});
