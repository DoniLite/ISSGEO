// import logo from '../../../../assets/ISSGEO_white.png';
import { Link } from '@tanstack/react-router';
import darkLogo from '../../../../assets/ISSGEO_dark.png';
import { Navigation } from './NavigationLinks';
import { useIsMobile } from '@/hooks/use-mobile';

export default function NavBar() {
  const isMobile = useIsMobile()
  return (
    <div className='w-full h-[4rem] fixed text-foreground bg-transparent z-20'>
      <div className='container mx-auto p-2 h-full flex items-center justify-between lg:p-4'>
        <Link to='.'>
          <img src={darkLogo} alt='Logo' className='w-12 h-12' />
        </Link>
        {!isMobile ? (
          <>
            <Navigation />
            <div className='flex items-center gap-4'>
              <button
                type='button'
                className='bg-muted cursor-pointer text-muted-foreground font-medium px-4 py-2 rounded-md hover:bg-muted/90'
              >
                Make Reservation
              </button>
              <button
                type='button'
                className='bg-secondary cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-secondary/90'
              >
                Get started
              </button>
            </div>
          </>
        ) : ''}
      </div>
    </div>
  );
}
