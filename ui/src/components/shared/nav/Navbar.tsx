// import logo from '../../../../assets/ISSGEO_white.png';
import { Link } from '@tanstack/react-router';
import darkLogo from '../../../../assets/ISSGEO_dark.png';
import { Navigation } from './NavigationLinks';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '../ThemeToogle';

export default function NavBar() {
  const [navClass, setNavClass] = useState(
    'w-full h-[4rem] fixed text-foreground bg-transparent z-20 transition-all'
  );

  useEffect(() => {
    window.onscroll = handleScroll;
    return () => window.removeEventListener('scroll', handleScroll);
  });
  const navRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const scrollX = Math.floor(window.scrollY);
    if (navRef.current) {
      if (scrollX > 10) {
        setNavClass((prev) => prev.replace('bg-transparent', 'bg-primary'));
        return;
      }
      setNavClass((prev) => prev.replace('bg-primary', 'bg-transparent'));
    }
  };
  return (
    <div ref={navRef} className={navClass}>
      <div className='container mx-auto p-2 h-full flex items-center justify-between lg:p-4'>
        <Link to='.'>
          <img src={darkLogo} alt='Logo' className='w-12 h-12' />
        </Link>
        <Navigation />
        <div className='items-center gap-4 hidden lg:flex'>
          <ThemeToggle />
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
        <MobileNav />
      </div>
    </div>
  );
}


const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className='block lg:hidden' asChild>
        <div className='w-[1.5rem] flex flex-col gap-1 items-center'>
          <div className='w-full h-[0.2rem] rounded-xs bg-background'></div>
          <div className='w-full h-[0.2rem] rounded-xs bg-background'></div>
          <div className='w-full h-[0.2rem] rounded-xs bg-background'></div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>ISSGEO Institute</SheetTitle>
      </SheetContent>
    </Sheet>
  );
}