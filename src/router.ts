import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import ErrorPage from "./components/shared/errorPage";
import NotFound from "./components/shared/notFoundPage";

export function createRouter() {
	return createTanstackRouter({
		routeTree,
		defaultNotFoundComponent: NotFound,
		defaultErrorComponent: ErrorPage,
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
