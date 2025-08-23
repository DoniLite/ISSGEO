interface RouteLink {
  title: string;
  path: string;
}

const pageLinks: RouteLink[] = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
];

export default pageLinks;
