import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from '@tanstack/react-router';

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

const menuBaseClass =
  'bg-transparent text-primary-foreground hover:bg-transparent focus:bg-transparent hover:underline data-[state=open]:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:hover:bg-transparent';

export function Navigation() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={menuBaseClass}>
            <Link to='.'>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={menuBaseClass}>
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='bg-linear-to-br from-primary/50 via-secondary to-primary flex h-full w-full flex-col justify-end rounded-md p-6 no-underline outline-hidden select-none focus:shadow-md'
                    href='/'
                  >
                    <div className='mt-4 mb-2 text-primary text-lg font-medium'>
                      Courses and Certifications
                    </div>
                    <p className='text-muted text-sm leading-tight'>
                      Discover our range of courses and certifications to
                      enhance your skills and advance your career.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href='/docs' title='Courses'>
                Reserve now a spot in our courses.
              </ListItem>
              <ListItem href='/docs/installation' title='Calendar'>
                Browse our calendar for upcoming events and workshops.
              </ListItem>
              <ListItem href='/docs/primitives/typography' title='Masters'>
                We offer a variety of masterclasses to deepen your knowledge.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={menuBaseClass}>
            About us
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
              {components.map((component) => (
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
          <NavigationMenuTrigger className={menuBaseClass}>
            Our team
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
              {components.map((component) => (
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
          <NavigationMenuLink asChild className={menuBaseClass}>
            <Link to='.'>FAQ</Link>
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
        className='focus:bg-muted-foreground/90 hover:bg-muted-foreground/90 data-[active=true]:bg-muted-foreground/90 data-[active=true]:hover:bg-muted-foreground/90 data-[active=true]:focus:bg-muted-foreground/90 rounded-md'
      >
        <Link to={href}>
          <div className='text-sm leading-none font-bold text-primary'>
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
