import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import '../i18n'
import { routeTree } from './routeTree.gen';
import { ThemeProvider } from './components/shared/ThemeProvider';

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App = (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
