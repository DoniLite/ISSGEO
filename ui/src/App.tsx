import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./index.css";
import "../i18n";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export const App = (
	<ThemeProvider>
		<RouterProvider router={router} />
	</ThemeProvider>
);
