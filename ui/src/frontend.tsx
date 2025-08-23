/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'; // auto-généré
import './index.css';

// biome-ignore lint/style/noNonNullAssertion: This element is guaranteed to exist
const elem = document.getElementById('root')!;

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const app = <RouterProvider router={router} />;

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  // biome-ignore lint/suspicious/noAssignInExpressions: assuming this is intentional
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
