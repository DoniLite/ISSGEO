import { Calendar, Home, Inbox, Book, Contact, Handshake } from 'lucide-react';

export const menuLinks = [
  {
    title: 'home',
    url: '/admin',
    icon: Home,
  },
  {
    title: 'inbox',
    url: '/admin/inbox',
    icon: Inbox,
  },
  {
    title: 'calendar',
    url: '/admin/calendar',
    icon: Calendar,
  },
  {
    title: 'formations',
    url: '/admin/courses',
    icon: Book,
  },
  {
    title: 'contact',
    url: '/admin/contact',
    icon: Contact,
  },
  {
    title: 'job',
    url: '/admin/job',
    icon: Handshake,
  },
];
