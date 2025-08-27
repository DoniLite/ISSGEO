import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => (
    <div className='relative w-full mx-auto h-screen'>
      <div className='h-full w-full grid grid-cols-[70%_30%] -z-10'>
        <div className='w-full h-full bg-linear-to-tr from-primary/50 via-secondary to-primary'></div>
        <div className='w-full h-full bg-[url(../assets/coverv1.jpg)] bg-cover bg-center bg-no-repeat'></div>
      </div>
      <div className='absolute inset-0 flex items-center justify-center p-4'>
        <div className='flex gap-4 lg:gap-6 flex-col lg:flex-row'>
          <div className='flex flex-col relative lg:-left-[12rem] lg:gap-4'>
            <h1 className='text-white text-4xl font-bold max-w-xl'>
              YOU CAN ALSO GET A CERTIFICATION TODAY
            </h1>
            <span className='text-foreground max-w-xl font-bold text-[16px]'>
              Notre institut propose une gamme de formation professionnel vous
              permettant d'ontenir des certifications dont vous avez besoin pour
              debuter votre carriere professionnelle
            </span>
            <div className='flex items-center gap-2 lg:gap-4 mt-4'>
              <button
                onClick={() => alert('clicked')}
                type='button'
                className='bg-muted cursor-pointer text-muted-foreground font-medium px-4 py-2 rounded-md hover:bg-muted/90'
              >
                More information
              </button>
              <button
                type='button'
                className='bg-primary cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-primary/90'
              >
                Begin the adventure
              </button>
            </div>
          </div>

          <form
            action='#'
            className='w-full lg:w-lg rounded-md p-2 lg:p-4 shadow h-auto lg:h-[35rem] bg-card lg:absolute lg:right-[1rem] xl:right-[6rem] 2xl:right-[16rem] lg:top-1/5 2xl:top-1/4'
          >
            <div className='w-full flex flex-col gap-1'>
              <span className='text-lg font-bold relative left-3'>
                Your Name
              </span>
              <input
                type='text'
                id='name'
                name='name'
                className='outline-none focus:ring px-3 py-2 rounded-md border'
                placeholder='Name'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  ),
});
