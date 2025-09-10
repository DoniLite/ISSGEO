interface RouteLink {
  title: string;
  paths: string | RouteLink[];
}

const pageLinks: RouteLink[] = [
  { title: 'Home', paths: '/' },
  {
    title: 'About',
    paths: [
      { title: 'Team', paths: '/about/team' },
      { title: 'Company', paths: '/about/company' },
    ],
  },
  {
    title: 'Contact',
    paths: [
      { title: 'Support', paths: '/contact/support' },
      { title: 'Sales', paths: '/contact/sales' },
    ],
  },
];

export default pageLinks;
