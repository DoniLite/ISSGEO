import { Calendar, Home, Book, Contact, Handshake, User2, HandHeart } from 'lucide-react';

export const menuLinks = [
  {
    title: 'home',
    url: '/admin',
    icon: Home,
  },
  {
    title: 'users',
    url: '/admin/users',
    icon: User2,
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
    title: 'testimonials',
    url: '/admin/testimonials',
    icon: HandHeart,
  },
  {
    title: 'job',
    url: '/admin/job',
    icon: Handshake,
  },
];
