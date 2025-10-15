import {
  createRootRoute,
  HeadContent,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import NavBar from '@/components/shared/nav/Navbar';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import '../index.css';
import '../../i18n';
import { Toaster } from '@/components/ui/sonner';
import { useDeviceType } from '@/hooks/useDeviceType';
import { TablePaginationProvider } from '@/lib/table/helpers/TablePaginationProvider';

export const Route = createRootRoute({
  component: () => {
    const { pathname } = useLocation();
    const { isMobile } = useDeviceType();
    return (
      <html lang='en'>
        <head>
          <HeadContent />
        </head>
        <body>
          <TablePaginationProvider>
            <ThemeProvider>
              {!pathname.includes('/admin') && <NavBar />}
              <Outlet />
              <ScrollToTop />
              <Toaster
                richColors
                closeButton
                position={isMobile ? 'top-right' : 'bottom-right'}
                duration={5000}
              />
            </ThemeProvider>
          </TablePaginationProvider>
        </body>
      </html>
    );
  },
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
