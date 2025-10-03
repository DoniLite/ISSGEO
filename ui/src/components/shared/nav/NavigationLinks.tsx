import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from '@tanstack/react-router';
import getPageLinks from './pageLinks';
import { useTranslation } from 'react-i18next';

const menuBaseClass = `
  bg-transparent text-primary-foreground hover:bg-transparent 
  focus:bg-transparent hover:underline data-[state=open]:bg-transparent 
  data-[state=open]:focus:bg-transparent data-[state=open]:hover:bg-transparent
  `;

export function Navigation() {
  const { t } = useTranslation();
  return (
    <NavigationMenu className='lg:block hidden' viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={menuBaseClass}>
            <Link to='/'>{t('nav.home.id')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={menuBaseClass}>
            {t('nav.services.id')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='bg-linear-to-br from-primary/50 via-secondary to-primary flex h-full w-full flex-col justify-end rounded-md p-6 no-underline outline-hidden select-none focus:shadow-md'
                    href='/#services'
                  >
                    <div className='mt-4 mb-2 text-primary dark:text-foreground text-lg font-medium'>
                      {t('nav.services.titleCard.title')}
                    </div>
                    <p className='text-muted text-sm leading-tight'>
                      {t('nav.services.titleCard.description')}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              {getPageLinks().services.map((link) => (
                <ListItem key={link.title} title={link.title} href={link.href}>
                  {link.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={menuBaseClass}>
            {t('nav.about.id')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
              {getPageLinks().about.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          {/* <NavigationMenuTrigger className={menuBaseClass}>
            {t('nav.team.id')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
              {getPageLinks().team.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent> */}
          <NavigationMenuLink asChild className={menuBaseClass}>
            <Link to='/team/join'>{t('nav.team.join.title')}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={menuBaseClass}>
            <Link to='/faq'>FAQ</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        asChild
        className='focus:bg-muted/10 hover:bg-muted-foreground/10 data-[active=true]:bg-muted-foreground/10 data-[active=true]:hover:bg-muted-foreground/10 data-[active=true]:focus:bg-muted-foreground/10 rounded-md'
      >
        <Link to={href}>
          <div className='text-sm leading-none font-bold text-primary dark:text-secondary'>
            {title}
          </div>
          <p className='text-foreground line-clamp-2 text-sm transition-all leading-snug'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
