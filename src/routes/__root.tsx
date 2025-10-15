import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import NavBar from '@/components/shared/nav/Navbar';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import '../index.css';
import '../../i18n';

export const Route = createRootRoute({
  component: () => (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <NavBar />
          <Outlet />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  ),
  head: () => ({
    scripts: [
      {
        src: '/static/dist/client/client.js',
        type: 'module',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: '/static/dist/client/client.css',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/static/ISSGEO_dark.png',
      },
    ],
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        charSet: 'UTF-8',
      },
    ],
  }),
});
