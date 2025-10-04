// import logo from '../../../../assets/ISSGEO_white.png';
import { Link } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import LanguageSwitcher from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToogle';
import MobileNavDetails from './MobileNavDetails';
import { Navigation } from './NavigationLinks';
import getPageLinks from './pageLinks';

export default function NavBar() {
	// const { t } = useTranslation();
	const [navClass, setNavClass] = useState(
		'w-full h-[4rem] fixed text-foreground bg-transparent z-20 transition-all',
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
        <Link to='/'>
          <img src='/static/ISSGEO_dark.png' alt='Logo' className='w-12 h-12' />
        </Link>
        <Navigation />
        <div className='items-center gap-4 hidden lg:flex'>
          <LanguageSwitcher />
          <ThemeToggle />
          {/* <button
            type='button'
            className='bg-muted cursor-pointer text-muted-foreground font-medium px-4 py-2 rounded-md hover:bg-muted/90'
          >
            {t('nav.cta.reservation')}
          </button>
          <button
            type='button'
            className='bg-secondary cursor-pointer text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-secondary/90'
          >
            {t('nav.cta.getStarted')}
          </button> */}
        </div>
        <MobileNav />
      </div>
    </div>
  );
}

const MobileNav = () => {
	const { t } = useTranslation();
	return (
    <Sheet>
      <SheetTrigger className='block lg:hidden' asChild>
        <div className='w-[1.5rem] flex flex-col gap-1 items-center'>
          <div className='w-full h-[0.2rem] rounded-xs bg-background dark:bg-foreground'></div>
          <div className='w-full h-[0.2rem] rounded-xs bg-background dark:bg-foreground'></div>
          <div className='w-full h-[0.2rem] rounded-xs bg-background dark:bg-foreground'></div>
        </div>
      </SheetTrigger>
      <SheetContent className='bg-primary' removeDefaultCloseButton>
        <div className='w-full flex items-center justify-between p-3'>
          <SheetTitle>
            <div className='w-full flex gap-2 items-center text-primary-foreground'>
              <Link to='.'>
                <img
                  src='/static/ISSGEO_dark.png'
                  alt='Logo'
                  className='w-6 h-6'
                />
              </Link>
              ISSGEO Institute
            </div>
          </SheetTitle>
          <SheetClose asChild>
            <X className='text-primary-foreground w-4 h-4' />
          </SheetClose>
        </div>

        <div className='p-4 flex flex-col gap-4 text-primary-foreground'>
          <Link to='/' className='font-bold'>
            {t('nav.home.id')}
          </Link>
          <MobileNavDetails
            title={t('nav.services.id')}
            links={getPageLinks().services}
          />
          <MobileNavDetails
            title={t('nav.about.id')}
            links={getPageLinks().about}
          />
          {/* <MobileNavDetails
            title={t('nav.team.id')}
            links={getPageLinks().team}
          /> */}
          <Link to='/team/join' className='font-bold'>
            {t('nav.team.join.title')}
          </Link>
          <Link to='/faq' className='font-bold'>
            FAQ
          </Link>
        </div>

        <div className='p-4 w-full flex gap-3'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};
