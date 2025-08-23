import logo from '../../../../assets/ISSGEO_white.png';
import darkLogo from '../../../../assets/ISSGEO_dark.png';
import pageLinks from './pageLinks';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

export default function NavBar() {
  return (
    <div className='w-full h-[4rem] text-foreground bg-primary/80'>
      <div className='container mx-auto p-2 h-full flex items-center justify-between lg:p-4'>
        <img src={darkLogo} alt='Logo' className='w-12 h-12' />
        <div className="flex items-center gap-8">
          {pageLinks.map(link => (
            <a key={link.path} href={link.path} className='hover:underline text-primary-foreground'>
              {link.title}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </div>
  );
}
