import { Calendar, Home, Inbox, Search, Settings, Book } from 'lucide-react';

export const menuLinks = [
  {
    title: 'home',
    url: '',
    icon: Home,
  },
  {
    title: 'inbox',
    url: '/inbox',
    icon: Inbox,
  },
  {
    title: 'calendar',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'formations',
    url: '/courses',
    icon: Book,
  },
  {
    title: 'search',
    url: '/search',
    icon: Search,
  },
  {
    title: 'settings',
    url: '/settings',
    icon: Settings,
  },
];
